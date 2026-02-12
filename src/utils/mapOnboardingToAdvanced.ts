import { SimulationInputs } from '@/types/simulation';
import { RetirementSimulationParams } from '@/types/retirement-types';

/**
 * Maps onboarding data to Advanced Planner fields (ONLY safe, explicit overlaps)
 * 
 * UX Principle: Recognition over recall
 * We prefill ONLY what the user already provided, with full transparency
 * 
 * @param onboardingInputs - Data from SimulationContext (from onboarding)
 * @returns Partial retirement params with safe prefills
 */
export function mapOnboardingToAdvancedPlanner(
    onboardingInputs: SimulationInputs
): Partial<RetirementSimulationParams> {
    // Only map fields that have clear 1:1 correspondence
    const mapped: Partial<RetirementSimulationParams> = {};

    // Demographics - Person 1 only (never assume spouse data)
    if (onboardingInputs.currentAge) {
        mapped.p1_start_age = onboardingInputs.currentAge;
    }

    // Tax filing status (map enum values)
    if (onboardingInputs.taxFilingStatus) {
        const filingStatusMap: Record<string, 'Single' | 'MFJ' | 'MFS' | 'HOH'> = {
            'single': 'Single',
            'married_joint': 'MFJ',
            'married_separate': 'MFS',
            'head_of_household': 'HOH',
        };
        mapped.filing_status = filingStatusMap[onboardingInputs.taxFilingStatus] || 'Single';
    }

    // Inflation rate (convert percentage to decimal)
    if (onboardingInputs.generalInflation !== undefined) {
        mapped.inflation_rate = onboardingInputs.generalInflation / 100;
    }

    // Employment income - Person 1 only
    if (onboardingInputs.currentSalary) {
        mapped.p1_employment_income = onboardingInputs.currentSalary;
    }

    // Social Security - Person 1 only
    if (onboardingInputs.ssEstimatedAmount) {
        // Convert monthly to annual
        mapped.p1_ss_amount = onboardingInputs.ssEstimatedAmount * 12;
    }
    if (onboardingInputs.ssStartAge) {
        mapped.p1_ss_start_age = onboardingInputs.ssStartAge;
    }

    // Account balances (direct mapping)
    if (onboardingInputs.taxableSavings !== undefined) {
        mapped.bal_taxable = onboardingInputs.taxableSavings;
    }
    if (onboardingInputs.taxDeferredSavings !== undefined) {
        mapped.bal_pretax_p1 = onboardingInputs.taxDeferredSavings;
    }
    if (onboardingInputs.taxFreeSavings !== undefined) {
        mapped.bal_roth_p1 = onboardingInputs.taxFreeSavings;
    }

    // Pension (if provided)
    if (onboardingInputs.pensionIncome) {
        mapped.p1_pension = onboardingInputs.pensionIncome;
    }

    return mapped;
}

/**
 * Checks if any onboarding data was actually used for prefilling
 * 
 * @param mapped - Result from mapOnboardingToAdvancedPlanner
 * @returns true if at least one field was prefilled
 */
export function hasPrefilledData(mapped: Partial<RetirementSimulationParams>): boolean {
    return Object.keys(mapped).length > 0;
}

/**
 * Returns a list of field names that were prefilled (for UX feedback)
 * 
 * @param mapped - Result from mapOnboardingToAdvancedPlanner
 * @returns Array of human-readable field names
 */
export function getPrefilledFieldNames(mapped: Partial<RetirementSimulationParams>): string[] {
    const fieldNameMap: Record<keyof RetirementSimulationParams, string> = {
        p1_start_age: 'Age',
        filing_status: 'Filing Status',
        inflation_rate: 'Inflation Rate',
        p1_employment_income: 'Employment Income',
        p1_ss_amount: 'Social Security',
        p1_ss_start_age: 'SS Start Age',
        bal_taxable: 'Taxable Account',
        bal_pretax_p1: 'Pre-Tax Account',
        bal_roth_p1: 'Roth Account',
        p1_pension: 'Pension',
    } as any;

    return Object.keys(mapped)
        .filter(key => mapped[key as keyof RetirementSimulationParams] !== undefined)
        .map(key => fieldNameMap[key as keyof RetirementSimulationParams])
        .filter(Boolean);
}
