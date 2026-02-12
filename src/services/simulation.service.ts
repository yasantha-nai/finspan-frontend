import { SimulationInputs, SimulationResult as FrontendResult, SimulationYearOutput } from "@/types/simulation";

const API_BASE_URL = import.meta.env.VITE_RETIREMENT_API_URL || 'http://localhost:5050/api';

export interface SimulationParams {
    p1_start_age: number;
    p2_start_age: number;
    end_simulation_age: number;
    inflation_rate: number;
    annual_spend_goal: number;
    p1_employment_income: number;
    p1_employment_until_age: number;
    p2_employment_income: number;
    p2_employment_until_age: number;
    p1_ss_amount: number;
    p1_ss_start_age: number;
    p2_ss_amount: number;
    p2_ss_start_age: number;
    p1_pension: number;
    p1_pension_start_age: number;
    p2_pension: number;
    p2_pension_start_age: number;
    bal_taxable: number;
    bal_pretax_p1: number;
    bal_pretax_p2: number;
    bal_roth_p1: number;
    bal_roth_p2: number;
    growth_rate_taxable: number;
    growth_rate_pretax_p1: number;
    growth_rate_pretax_p2: number;
    growth_rate_roth_p1: number;
    growth_rate_roth_p2: number;
    taxable_basis_ratio: number;
    target_tax_bracket_rate: number;
}

export interface BackendYearResult {
    Year: number;
    P1_Age: number;
    P2_Age: number;
    Employment_P1: number;
    Employment_P2: number;
    SS_P1: number;
    SS_P2: number;
    Pension_P1: number;
    Pension_P2: number;
    RMD_P1: number;
    RMD_P2: number;
    Total_Income: number;
    Spend_Goal: number;
    Previous_Taxes: number;
    Cash_Need: number;
    WD_PreTax_P1: number;
    WD_PreTax_P2: number;
    WD_Taxable: number;
    WD_Roth_P1: number;
    WD_Roth_P2: number;
    Roth_Conversion: number;
    Conv_P1: number;
    Conv_P2: number;
    Ord_Income: number;
    Cap_Gains: number;
    Tax_Bill: number;
    Taxes_Paid: number;
    Bal_PreTax_P1: number;
    Bal_PreTax_P2: number;
    Bal_Roth_P1: number;
    Bal_Roth_P2: number;
    Bal_Taxable: number;
    Net_Worth: number;
}

export interface SimulationResponse {
    success: boolean;
    results: BackendYearResult[];
    columns: string[];
    error?: string;
}

export const simulationService = {
    runSimulation: async (params: SimulationParams): Promise<SimulationResponse> => {
        const startTime = performance.now();
        
        try {
            console.log('🔗 API Request:', {
                url: `${API_BASE_URL}/run-simulation`,
                method: 'POST',
            });

            const response = await fetch(`${API_BASE_URL}/run-simulation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const endTime = performance.now();
            console.log(`⏱️ API Response time: ${(endTime - startTime).toFixed(0)}ms`);

            if (!response.ok) {
                console.error('❌ API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                });
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📦 Raw API Response:', {
                success: data.success,
                hasScenarios: !!data.scenarios,
                hasStandard: !!(data.scenarios?.standard),
                resultsCount: data.scenarios?.standard?.results?.length || data.results?.length || 0,
            });

            // ADAPTER: Map new 'scenarios' format to legacy 'results' format expected by context
            if (data.scenarios && data.scenarios.standard) {
                const adapted = {
                    success: data.success,
                    results: data.scenarios.standard.results,
                    columns: data.scenarios.standard.columns,
                    error: data.error
                };
                console.log('🔄 Adapted response format (scenarios -> results)');
                return adapted;
            }

            return data;
        } catch (error) {
            console.error('❌ Simulation request failed:', error);
            throw error;
        }
    }
};

export function mapFrontendToBackend(inputs: SimulationInputs): SimulationParams {
    const isMarried = inputs.taxFilingStatus === 'married_joint';
    console.log('🔄 Mapping Frontend → Backend:', { isMarried });

    const params = {
        p1_start_age: inputs.currentAge,
        p2_start_age: isMarried ? (inputs.spouseAge || inputs.currentAge) : inputs.currentAge,
        end_simulation_age: inputs.lifeExpectancy,
        inflation_rate: inputs.generalInflation / 100,
        annual_spend_goal: inputs.currentExpenses,
        p1_employment_income: inputs.currentSalary,
        p1_employment_until_age: inputs.retirementAge,
        p2_employment_income: isMarried ? (inputs.spouseSalary || 0) : 0,
        p2_employment_until_age: isMarried ? (inputs.spouseRetirementAge || inputs.retirementAge) : inputs.retirementAge,
        p1_ss_amount: inputs.ssEstimatedAmount,
        p1_ss_start_age: inputs.ssStartAge,
        p2_ss_amount: isMarried ? (inputs.spouseSsAmount || 0) : 0,
        p2_ss_start_age: isMarried ? (inputs.spouseSsStartAge || 67) : 67,
        p1_pension: inputs.pensionIncome,
        p1_pension_start_age: 65,
        p2_pension: isMarried ? (inputs.spousePensionIncome || 0) : 0,
        p2_pension_start_age: 65,
        bal_taxable: inputs.taxableSavings + (inputs.spouseTaxableSavings || 0),
        // Split balances if married, otherwise all to P1
        bal_pretax_p1: isMarried ?
            (inputs.taxDeferredSavings || 0) :
            inputs.taxDeferredSavings,
        bal_pretax_p2: isMarried ?
            (inputs.spouseTaxDeferredSavings || 0) :
            0,
        bal_roth_p1: isMarried ?
            (inputs.taxFreeSavings || 0) :
            inputs.taxFreeSavings,
        bal_roth_p2: isMarried ?
            (inputs.spouseTaxFreeSavings || 0) :
            0,
        growth_rate_taxable: inputs.preRetirementReturn / 100,
        growth_rate_pretax_p1: inputs.preRetirementReturn / 100,
        growth_rate_pretax_p2: inputs.preRetirementReturn / 100,
        growth_rate_roth_p1: inputs.preRetirementReturn / 100,
        growth_rate_roth_p2: inputs.preRetirementReturn / 100,
        taxable_basis_ratio: 0.8,
        target_tax_bracket_rate: (parseFloat(inputs.taxTargetBracket) || 22.0) / 100
    };

    // Log critical balance calculations
    console.log('💰 Balance Mapping:', {
        'Your Tax-Deferred': inputs.taxDeferredSavings,
        'Spouse Tax-Deferred': inputs.spouseTaxDeferredSavings || 0,
        '→ bal_pretax_p1': params.bal_pretax_p1,
        '→ bal_pretax_p2': params.bal_pretax_p2,
        'Your Roth': inputs.taxFreeSavings,
        'Spouse Roth': inputs.spouseTaxFreeSavings || 0,
        '→ bal_roth_p1': params.bal_roth_p1,
        '→ bal_roth_p2': params.bal_roth_p2,
        'Taxable Total': params.bal_taxable,
    });

    // Validation warnings
    const totalSavings = params.bal_pretax_p1 + params.bal_pretax_p2 + params.bal_roth_p1 + params.bal_roth_p2 + params.bal_taxable;
    if (totalSavings === 0) {
        console.warn('⚠️ WARNING: Total savings is $0! You need to enter your current savings in Phase 3 (Savings & Contributions).');
    }
    if (params.annual_spend_goal > (params.p1_employment_income + params.p2_employment_income)) {
        console.warn('⚠️ WARNING: Annual spending ($' + params.annual_spend_goal.toLocaleString() + ') exceeds income ($' + (params.p1_employment_income + params.p2_employment_income).toLocaleString() + ')!');
    }

    return params;
}

export function mapBackendToFrontend(backendResults: BackendYearResult[], inputs: SimulationInputs): FrontendResult {
    console.log('🔄 Mapping Backend → Frontend:', {
        resultsCount: backendResults.length,
        firstYear: backendResults[0]?.Year,
        lastYear: backendResults[backendResults.length - 1]?.Year,
    });

    const years: SimulationYearOutput[] = backendResults.map(r => ({
        year: r.Year,
        userAge: r.P1_Age,
        spouseAge: r.P2_Age,
        workIncome: (r.Employment_P1 || 0) + (r.Employment_P2 || 0),
        socialSecurity: (r.SS_P1 || 0) + (r.SS_P2 || 0),
        pension: (r.Pension_P1 || 0) + (r.Pension_P2 || 0),
        rmds: (r.RMD_P1 || 0) + (r.RMD_P2 || 0),
        interestDividends: 0,
        grossIncome: r.Total_Income || 0,
        standardDeduction: 0,
        taxableIncome: r.Ord_Income || 0,
        federalTax: r.Tax_Bill || 0,
        stateTax: 0,
        ficaTax: 0,
        totalTax: r.Taxes_Paid || 0,
        essentialExpenses: r.Spend_Goal || 0,
        healthcare: 0,
        discretionary: 0,
        oneTimeExpense: 0,
        totalSpend: r.Spend_Goal || 0,
        netSurplusGap: (r.Total_Income || 0) - (r.Taxes_Paid || 0) - (r.Spend_Goal || 0),
        contributions: 0,
        drawTaxable: r.WD_Taxable || 0,
        drawDeferred: (r.WD_PreTax_P1 || 0) + (r.WD_PreTax_P2 || 0),
        drawRoth: (r.WD_Roth_P1 || 0) + (r.WD_Roth_P2 || 0),
        rothConversion: r.Roth_Conversion || 0,
        conversionTaxCost: 0,
        taxableBalance: r.Bal_Taxable || 0,
        deferredBalance: (r.Bal_PreTax_P1 || 0) + (r.Bal_PreTax_P2 || 0),
        rothBalance: (r.Bal_Roth_P1 || 0) + (r.Bal_Roth_P2 || 0),
        totalPortfolio: r.Net_Worth || 0,
        legacyValue: r.Year === new Date().getFullYear() + (inputs.lifeExpectancy - inputs.currentAge) ? r.Net_Worth : 0,
        realWealth: r.Net_Worth,
    }));

    const lastYear = years[years.length - 1];
    const shortfallYears = backendResults
        .filter(r => {
            const totalGenerated = (r.Total_Income || 0) +
                (r.WD_PreTax_P1 || 0) +
                (r.WD_PreTax_P2 || 0) +
                (r.WD_Taxable || 0) +
                (r.WD_Roth_P1 || 0) +
                (r.WD_Roth_P2 || 0);
            return totalGenerated < (r.Cash_Need || 0) - 1; // Allow small rounding margin
        })
        .map(r => r.Year);

    const result = {
        years,
        successProbability: shortfallYears.length === 0 ? 100 : Math.max(0, 100 - (shortfallYears.length / years.length * 100)),
        financialIndependenceAge: years.find(y => y.totalPortfolio >= inputs.currentExpenses * 25)?.userAge ?? inputs.retirementAge,
        totalLegacy: lastYear?.totalPortfolio ?? 0,
        shortfallYears
    };

    console.log('✅ Mapped Result:', {
        yearsSimulated: result.years.length,
        successProbability: result.successProbability + '%',
        shortfallYears: result.shortfallYears.length,
        shortfallYearsList: result.shortfallYears,
        finalPortfolio: lastYear?.totalPortfolio.toLocaleString(),
        totalLegacy: result.totalLegacy.toLocaleString(),
    });

    return result;
}
