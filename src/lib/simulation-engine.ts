import { SimulationInputs, SimulationYearOutput, SimulationResult } from '@/types/simulation';

// Federal tax brackets 2024 (simplified)
const FEDERAL_BRACKETS = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married_joint: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
};

// Standard deductions
const STANDARD_DEDUCTIONS = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_of_household: 21900,
};

// FICA rates
const FICA_RATE = 0.0765;
const FICA_WAGE_BASE = 168600;

// RMD life expectancy table (simplified)
const RMD_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9,
  78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7,
  84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9,
  90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9,
};

// State tax rates (simplified - uses flat approximations)
const STATE_TAX_RATES: Record<string, number> = {
  'California': 0.093, 'New York': 0.085, 'New Jersey': 0.089,
  'Texas': 0, 'Florida': 0, 'Nevada': 0, 'Washington': 0,
  'Tennessee': 0, 'Wyoming': 0, 'Alaska': 0, 'South Dakota': 0,
  'Illinois': 0.0495, 'Pennsylvania': 0.0307, 'Ohio': 0.04,
  'default': 0.05,
};

function calculateFederalTax(taxableIncome: number, status: string): number {
  const brackets = status === 'married_joint' ? FEDERAL_BRACKETS.married_joint : FEDERAL_BRACKETS.single;
  let tax = 0;
  let remaining = taxableIncome;
  
  for (const bracket of brackets) {
    const taxableInBracket = Math.min(Math.max(remaining - bracket.min, 0), bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
    if (remaining <= 0) break;
  }
  
  return tax;
}

function calculateStateTax(taxableIncome: number, state: string): number {
  const rate = STATE_TAX_RATES[state] ?? STATE_TAX_RATES['default'];
  return taxableIncome * rate;
}

function calculateRMD(age: number, deferredBalance: number): number {
  if (age < 73) return 0;
  const divisor = RMD_TABLE[age] ?? 8.9;
  return deferredBalance / divisor;
}

export function runSimulation(inputs: SimulationInputs): SimulationResult {
  const years: SimulationYearOutput[] = [];
  const currentYear = new Date().getFullYear();
  const simulationYears = inputs.lifeExpectancy - inputs.currentAge;
  
  // Initialize balances
  let taxableBalance = inputs.taxableSavings;
  let deferredBalance = inputs.taxDeferredSavings;
  let rothBalance = inputs.taxFreeSavings;
  
  // Cumulative inflation multiplier
  let inflationMultiplier = 1;
  let medicalInflationMultiplier = 1;
  
  const shortfallYears: number[] = [];
  
  for (let i = 0; i <= simulationYears; i++) {
    const year = currentYear + i;
    const userAge = inputs.currentAge + i;
    const isRetired = userAge >= inputs.retirementAge;
    const returnRate = isRetired ? inputs.postRetirementReturn / 100 : inputs.preRetirementReturn / 100;
    
    // Update inflation multipliers
    if (i > 0) {
      inflationMultiplier *= (1 + inputs.generalInflation / 100);
      medicalInflationMultiplier *= (1 + inputs.medicalInflation / 100);
    }
    
    // =============== STEP 1: Income Aggregation ===============
    
    // Work Income
    let workIncome = 0;
    if (!isRetired) {
      const yearsWorked = i;
      const escalator = Math.pow(1 + inputs.savingsEscalator / 100, yearsWorked);
      workIncome = inputs.currentSalary * Math.pow(1 + inputs.salaryGrowthRate / 100, yearsWorked);
    }
    
    // Social Security
    let socialSecurity = 0;
    if (userAge >= inputs.ssStartAge) {
      // Delayed credits: 8% per year of delay after FRA (67)
      const delayYears = Math.max(0, inputs.ssStartAge - 67);
      const earlyYears = Math.max(0, 67 - inputs.ssStartAge);
      const adjustmentFactor = 1 + (delayYears * 0.08) - (earlyYears * 0.0667);
      socialSecurity = inputs.ssEstimatedAmount * 12 * adjustmentFactor * inflationMultiplier;
    }
    
    // Pension
    let pension = 0;
    if (isRetired && inputs.pensionIncome > 0) {
      pension = inputs.pensionIncome * 12;
      if (inputs.pensionCOLA) {
        pension *= inflationMultiplier;
      }
    }
    
    // RMDs
    const rmds = calculateRMD(userAge, deferredBalance);
    
    // Interest/Dividends (assume 2% yield on taxable)
    const interestDividends = taxableBalance * 0.02;
    
    // Gross Income
    const grossIncome = workIncome + socialSecurity + pension + rmds + interestDividends + inputs.passiveIncome;
    
    // =============== STEP 2: Tax Calculation ===============
    
    const standardDeduction = STANDARD_DEDUCTIONS[inputs.taxFilingStatus];
    const taxableIncome = Math.max(0, grossIncome - standardDeduction);
    
    const federalTax = calculateFederalTax(taxableIncome, inputs.taxFilingStatus);
    const stateTax = calculateStateTax(taxableIncome, inputs.stateOfResidence);
    const ficaTax = isRetired ? 0 : Math.min(workIncome, FICA_WAGE_BASE) * FICA_RATE;
    const totalTax = federalTax + stateTax + ficaTax;
    
    // =============== STEP 3: Net Income ===============
    
    const netIncome = grossIncome - totalTax;
    
    // =============== STEP 4: Expenses ===============
    
    const baseExpenses = inputs.currentExpenses * (isRetired ? inputs.retirementRatio / 100 : 1);
    const essentialExpenses = baseExpenses * 0.7 * inflationMultiplier;
    const healthcare = baseExpenses * 0.15 * medicalInflationMultiplier;
    const discretionary = baseExpenses * 0.15 * inflationMultiplier;
    
    // One-time expenses
    const oneTimeExpense = inputs.oneTimeExpenses
      .filter(e => e.year === year)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const totalSpend = essentialExpenses + healthcare + discretionary + oneTimeExpense;
    
    // =============== STEP 5 & 6: Surplus/Gap Dynamics ===============
    
    const netSurplusGap = netIncome - totalSpend;
    
    let contributions = 0;
    let drawTaxable = 0;
    let drawDeferred = 0;
    let drawRoth = 0;
    
    if (netSurplusGap > 0 && !isRetired && userAge < inputs.stopContributionAge) {
      // Surplus: make contributions
      contributions = Math.min(
        netSurplusGap,
        inputs.contribDeferred + inputs.contribRoth + inputs.contribTaxable
      );
      
      // Allocate contributions to buckets
      deferredBalance += Math.min(inputs.contribDeferred, contributions);
      rothBalance += Math.min(inputs.contribRoth, Math.max(0, contributions - inputs.contribDeferred));
      taxableBalance += Math.max(0, contributions - inputs.contribDeferred - inputs.contribRoth);
      
      // Employer match
      const matchAmount = workIncome * (inputs.employerMatch / 100);
      deferredBalance += matchAmount;
    } else if (netSurplusGap < 0) {
      // Gap: need to draw from accounts
      const gap = Math.abs(netSurplusGap);
      
      // Drawdown hierarchy: Taxable -> Deferred -> Roth
      drawTaxable = Math.min(gap, taxableBalance);
      taxableBalance -= drawTaxable;
      
      const remainingGap1 = gap - drawTaxable;
      drawDeferred = Math.min(remainingGap1, Math.max(0, deferredBalance - rmds));
      deferredBalance -= drawDeferred;
      
      const remainingGap2 = remainingGap1 - drawDeferred;
      drawRoth = Math.min(remainingGap2, rothBalance);
      rothBalance -= drawRoth;
      
      // Check for shortfall
      if (remainingGap2 > rothBalance) {
        shortfallYears.push(year);
      }
    }
    
    // Handle RMD withdrawal
    deferredBalance -= rmds;
    if (inputs.rmdReinvestment && rmds > 0) {
      // Reinvest in taxable after taxes
      const rmdAfterTax = rmds * (1 - 0.22); // Assume 22% bracket
      taxableBalance += rmdAfterTax;
    }
    
    // =============== STEP 7: Growth ===============
    
    // Roth Conversion
    let rothConversion = 0;
    let conversionTaxCost = 0;
    
    if (inputs.rothStrategy === 'fill_bracket' && deferredBalance > 0) {
      const targetBracketLimit = inputs.taxFilingStatus === 'married_joint' ? 94300 : 47150;
      const headroom = Math.max(0, targetBracketLimit - taxableIncome);
      rothConversion = Math.min(headroom, deferredBalance);
      conversionTaxCost = rothConversion * 0.22;
      deferredBalance -= rothConversion;
      rothBalance += rothConversion;
    } else if (inputs.rothStrategy === 'fixed_amount' && inputs.rothConversionAmount) {
      rothConversion = Math.min(inputs.rothConversionAmount, deferredBalance);
      conversionTaxCost = rothConversion * 0.22;
      deferredBalance -= rothConversion;
      rothBalance += rothConversion;
    }
    
    // Apply growth
    taxableBalance *= (1 + returnRate);
    deferredBalance *= (1 + returnRate);
    rothBalance *= (1 + returnRate);
    
    // Ensure non-negative
    taxableBalance = Math.max(0, taxableBalance);
    deferredBalance = Math.max(0, deferredBalance);
    rothBalance = Math.max(0, rothBalance);
    
    const totalPortfolio = taxableBalance + deferredBalance + rothBalance;
    
    // =============== Analytics ===============
    
    const legacyValue = userAge === inputs.lifeExpectancy ? totalPortfolio : 0;
    const realWealth = totalPortfolio / inflationMultiplier;
    
    years.push({
      year,
      userAge,
      workIncome,
      socialSecurity,
      pension,
      rmds,
      interestDividends,
      grossIncome,
      standardDeduction,
      taxableIncome,
      federalTax,
      stateTax,
      ficaTax,
      totalTax,
      essentialExpenses,
      healthcare,
      discretionary,
      oneTimeExpense,
      totalSpend,
      netSurplusGap,
      contributions,
      drawTaxable,
      drawDeferred,
      drawRoth,
      rothConversion,
      conversionTaxCost,
      taxableBalance,
      deferredBalance,
      rothBalance,
      totalPortfolio,
      legacyValue,
      realWealth,
    });
  }
  
  // Calculate success metrics
  const lastYear = years[years.length - 1];
  const successProbability = shortfallYears.length === 0 
    ? 100 
    : Math.max(0, 100 - (shortfallYears.length / years.length * 100));
  
  const financialIndependenceAge = years.find(
    y => y.totalPortfolio >= inputs.currentExpenses * 25
  )?.userAge ?? inputs.retirementAge;
  
  return {
    years,
    successProbability,
    financialIndependenceAge,
    totalLegacy: lastYear?.totalPortfolio ?? 0,
    shortfallYears,
  };
}

// Format currency for display
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format percentage for display
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
