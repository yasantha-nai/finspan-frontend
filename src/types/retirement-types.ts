/**
 * Type definitions for Retirement Planner
 */

export interface RetirementSimulationParams {
  // Demographics
  p1_start_age: number;
  p2_start_age: number;
  end_simulation_age: number;
  inflation_rate: number;
  annual_spend_goal: number;
  filing_status?: string;

  // Employment Income
  p1_employment_income: number;
  p1_employment_until_age: number;
  p2_employment_income: number;
  p2_employment_until_age: number;

  // Social Security
  p1_ss_amount: number;
  p1_ss_start_age: number;
  p2_ss_amount: number;
  p2_ss_start_age: number;

  // Pensions
  p1_pension: number;
  p1_pension_start_age: number;
  p2_pension: number;
  p2_pension_start_age: number;

  // Account Balances
  bal_taxable: number;
  bal_pretax_p1: number;
  bal_pretax_p2: number;
  bal_roth_p1: number;
  bal_roth_p2: number;

  // Growth Rates
  growth_rate_taxable: number;
  growth_rate_pretax_p1: number;
  growth_rate_pretax_p2: number;
  growth_rate_roth_p1: number;
  growth_rate_roth_p2: number;

  // Tax Settings
  taxable_basis_ratio: number;
  target_tax_bracket_rate: number;
  previous_year_taxes?: number;

  // Real Estate & Mortgages
  primary_home_value?: number;
  primary_home_growth_rate?: number;
  primary_home_mortgage_principal?: number;
  primary_home_mortgage_rate?: number;
  primary_home_mortgage_years?: number;

  // Rental Properties (supports multiple)
  rental_1_value?: number;
  rental_1_income?: number;
  rental_1_growth_rate?: number;
  rental_1_income_growth_rate?: number;
  rental_1_mortgage_principal?: number;
  rental_1_mortgage_rate?: number;
  rental_1_mortgage_years?: number;

  rental_2_value?: number;
  rental_2_income?: number;
  rental_2_growth_rate?: number;
  rental_2_income_growth_rate?: number;
  rental_2_mortgage_principal?: number;
  rental_2_mortgage_rate?: number;
  rental_2_mortgage_years?: number;
}

export interface RetirementYearResult {
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
  Rental_Income?: number;
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
  Primary_Home_Value?: number;
  Primary_Home_Equity?: number;
  Primary_Mortgage_Liability?: number;
  Rental_Home_Value?: number;
  Rental_Home_Equity?: number;
  Rental_Mortgage_Liability?: number;
  Total_Home_Equity?: number;
  Net_Worth: number;
  Market_Return?: number;
  Mortgage_Payment?: number;
  Discretionary_Spend?: number;
}

export interface StrategyResults {
  results: RetirementYearResult[];
  columns: string[];
}

export interface SimulationResponse {
  success: boolean;
  config?: Record<string, any>;
  scenarios?: {
    standard: StrategyResults;
    taxable_first: StrategyResults;
  };
  error?: string;
}

export interface MonteCarloStats {
  Year: number;
  Net_Worth_median: number;
  Net_Worth_P10: number;
  Net_Worth_P90: number;
  Bal_Roth_Total_median: number;
  Bal_Roth_Total_P10: number;
  Bal_Roth_Total_P90: number;
  Bal_PreTax_Total_median: number;
  Bal_PreTax_Total_P10: number;
  Bal_PreTax_Total_P90: number;
  Bal_Taxable_median: number;
  Bal_Taxable_P10: number;
  Bal_Taxable_P90: number;
  Market_Return_median?: number;
  Market_Return_min?: number;
  Market_Return_max?: number;
}

export interface MonteCarloRun {
  run_id: number;
  final_nw: number;
  data: RetirementYearResult[];
}

export interface MonteCarloResults {
  success: boolean;
  success_rate: number;
  stats: MonteCarloStats[];
  all_runs: MonteCarloRun[];
  num_simulations: number;
  volatility: number;
  baselines?: {
    standard: StrategyResults;
    taxable_first: StrategyResults;
  };
  error?: string;
}

export interface MonteCarloParams extends RetirementSimulationParams {
  volatility: number;
  num_simulations: number;
}
