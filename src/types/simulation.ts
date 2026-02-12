// Simulation Input Types - 33 Parameters organized by phase

export type TaxFilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';

export type RothStrategy = 'none' | 'fill_bracket' | 'fixed_amount';

export interface Phase1Identity {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  taxFilingStatus: TaxFilingStatus;
  stateOfResidence: string;
  // Spouse fields (for married filing jointly)
  spouseAge?: number;
  spouseRetirementAge?: number;
}

export interface Phase2Income {
  currentSalary: number;
  salaryGrowthRate: number;
  taxableSavings: number;
  taxDeferredSavings: number;
  taxFreeSavings: number;
  ssStartAge: number;
  ssEstimatedAmount: number;
  yearsWorked: number;
  pensionIncome: number;
  pensionCOLA: boolean;
  passiveIncome: number;
  // Spouse income fields
  spouseSalary?: number;
  spouseTaxDeferredSavings?: number;
  spouseTaxFreeSavings?: number;
  spouseTaxableSavings?: number;
  spouseSsStartAge?: number;
  spouseSsAmount?: number;
  spousePensionIncome?: number;
}

export interface Phase3Contributions {
  contribTaxable: number;
  contribDeferred: number;
  contribRoth: number;
  employerMatch: number;
  catchUpEligible: boolean;
  savingsEscalator: number;
  stopContributionAge: number;
}

export interface Phase4FutureReality {
  currentExpenses: number;
  retirementRatio: number;
  medicalInflation: number;
  generalInflation: number;
  preRetirementReturn: number;
  postRetirementReturn: number;
  // Optional Planning Fields
  numChildren: number;
  homePurchasePlan: 'rent' | 'own';
  currentMonthlyRent: number;
  studentLoanBalance: number;
  studentLoanPayment: number;
  studentLoanRate?: number;
  carLoanBalance?: number;
  carLoanPayment?: number;
  carLoanYears?: number;
  creditCardDebt?: number;
  creditCardPayment?: number;
  homeValue?: number;
  mortgageBalance?: number;
  monthlyMortgagePayment?: number;
  mortgageYearsRemaining?: number;
  rentalIncome?: number;
  annualMedicalExpenses?: number;
  businessIncome?: number;
  businessGrowthRate?: number;
  monthlySpendingPerChild?: number;
  collegeSavingsPerChild?: number;
  lifeInsuranceType: 'none' | 'term' | 'whole';
  lifeInsurancePremium: number;
  oneTimeExpenses: OneTimeExpense[];
}

export interface Phase5Strategy {
  rothStrategy: RothStrategy;
  rmdReinvestment: boolean;
  taxTargetBracket: string;
  legacyGoal: number;
}

export interface OneTimeExpense {
  id: string;
  year: number;
  amount: number;
  description: string;
}

export interface SimulationInputs extends
  Phase1Identity,
  Phase2Income,
  Phase3Contributions,
  Phase4FutureReality,
  Phase5Strategy { }

// Simulation Output Types - 33 Columns
export interface SimulationYearOutput {
  // Timeline
  year: number;
  userAge: number;
  spouseAge?: number;

  // Income Sources
  workIncome: number;
  socialSecurity: number;
  pension: number;
  rmds: number;
  interestDividends: number;
  grossIncome: number;

  // Tax Liability
  standardDeduction: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  totalTax: number;

  // Outflows
  essentialExpenses: number;
  healthcare: number;
  discretionary: number;
  oneTimeExpense: number;
  totalSpend: number;

  // Flow Dynamics
  netSurplusGap: number;

  // Portfolio Actions
  contributions: number;
  drawTaxable: number;
  drawDeferred: number;
  drawRoth: number;
  rothConversion: number;
  conversionTaxCost: number;

  // Net Worth
  taxableBalance: number;
  deferredBalance: number;
  rothBalance: number;
  totalPortfolio: number;

  // Analytics
  legacyValue: number;
  realWealth: number;
}

export interface SimulationResult {
  years: SimulationYearOutput[];
  successProbability: number;
  financialIndependenceAge: number;
  totalLegacy: number;
  shortfallYears: number[];
}

// Default values for simulation
export const defaultInputs: SimulationInputs = {
  // Phase 1
  currentAge: 35,
  retirementAge: 65,
  lifeExpectancy: 90,
  taxFilingStatus: 'single',
  stateOfResidence: 'California',

  // Phase 2
  currentSalary: 100000,
  salaryGrowthRate: 2,
  taxableSavings: 50000,
  taxDeferredSavings: 200000,
  taxFreeSavings: 50000,
  ssStartAge: 67,
  ssEstimatedAmount: 2500,
  yearsWorked: 15,
  pensionIncome: 0,
  pensionCOLA: false,
  passiveIncome: 0,

  // Phase 3
  contribTaxable: 5000,
  contribDeferred: 19500,
  contribRoth: 6000,
  employerMatch: 6,
  catchUpEligible: false,
  savingsEscalator: 1,
  stopContributionAge: 65,

  // Phase 4
  currentExpenses: 75000,
  retirementRatio: 80,
  medicalInflation: 5,
  generalInflation: 2.5,
  preRetirementReturn: 7,
  postRetirementReturn: 5,

  // Phase 4 - Optional
  numChildren: 0,
  homePurchasePlan: 'rent',
  currentMonthlyRent: 2000,
  studentLoanBalance: 0,
  studentLoanPayment: 0,
  lifeInsuranceType: 'none',
  lifeInsurancePremium: 0,

  // Phase 5
  rothStrategy: 'none',
  rmdReinvestment: true,
  taxTargetBracket: '22',
  legacyGoal: 0,
  oneTimeExpenses: [],
};

// US States for dropdown
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'
];

// Tax brackets for reference
export const TAX_BRACKETS = ['10', '12', '22', '24', '32', '35', '37'];
