import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Paper,
    Grid,
    InputAdornment,
    Divider,
    CircularProgress,
    Alert,
    Collapse,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import { OnboardingStepCard } from '@/components/onboarding/OnboardingStepCard';
import { retirementService } from '@/services/retirement.service';
import { SimulationResponse } from '@/types/retirement-types';
import { useSimulation } from '@/context/SimulationContext';
import { mapOnboardingToAdvancedPlanner, hasPrefilledData } from '@/utils/mapOnboardingToAdvanced';

interface RetirementInputFormProps {
    onSimulationComplete: (results: SimulationResponse) => void;
}

interface FormData {
    // Demographics
    p1_name: string;
    p2_name: string;
    p1_start_age: number;
    p2_start_age: number;
    end_simulation_age: number;
    inflation_rate: number;

    // Spending
    annual_spend_goal: number;
    filing_status: string;
    target_tax_bracket_rate: number;
    previous_year_taxes: number;

    // Employment
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

    // Investment Returns
    growth_rate_taxable: number;
    growth_rate_pretax_p1: number;
    growth_rate_pretax_p2: number;
    growth_rate_roth_p1: number;
    growth_rate_roth_p2: number;
    taxable_basis_ratio: number;

    // Real Estate
    primary_home_value: number;
    primary_home_growth_rate: number;
    primary_home_mortgage_principal: number;
    primary_home_mortgage_rate: number;
    primary_home_mortgage_years: number;

    rental_1_value: number;
    rental_1_income: number;
    rental_1_growth_rate: number;
    rental_1_income_growth_rate: number;
    rental_1_mortgage_principal: number;
    rental_1_mortgage_rate: number;
    rental_1_mortgage_years: number;
}

const defaultValues: FormData = {
    p1_name: 'Husband',
    p2_name: 'Wife',
    p1_start_age: 65,
    p2_start_age: 63,
    end_simulation_age: 95,
    inflation_rate: 0.03,
    annual_spend_goal: 120000,
    filing_status: 'MFJ',
    target_tax_bracket_rate: 0.24,
    previous_year_taxes: 50000,
    p1_employment_income: 100000,
    p1_employment_until_age: 67,
    p2_employment_income: 80000,
    p2_employment_until_age: 65,
    p1_ss_amount: 45000,
    p1_ss_start_age: 70,
    p2_ss_amount: 45000,
    p2_ss_start_age: 65,
    p1_pension: 0,
    p1_pension_start_age: 65,
    p2_pension: 0,
    p2_pension_start_age: 65,
    bal_taxable: 700000,
    bal_pretax_p1: 1250000,
    bal_pretax_p2: 1250000,
    bal_roth_p1: 60000,
    bal_roth_p2: 60000,
    growth_rate_taxable: 0.07,
    growth_rate_pretax_p1: 0.07,
    growth_rate_pretax_p2: 0.07,
    growth_rate_roth_p1: 0.07,
    growth_rate_roth_p2: 0.07,
    taxable_basis_ratio: 0.75,
    primary_home_value: 0,
    primary_home_growth_rate: 0.03,
    primary_home_mortgage_principal: 0,
    primary_home_mortgage_rate: 0,
    primary_home_mortgage_years: 0,
    rental_1_value: 0,
    rental_1_income: 0,
    rental_1_growth_rate: 0.03,
    rental_1_income_growth_rate: 0.03,
    rental_1_mortgage_principal: 0,
    rental_1_mortgage_rate: 0,
    rental_1_mortgage_years: 0,
};

export const RetirementInputForm = ({ onSimulationComplete }: RetirementInputFormProps) => {
    // Access onboarding data from SimulationContext
    const { inputs: onboardingInputs } = useSimulation();

    // UX: Track whether data was prefilled (for feedback message)
    const [wasPrefilledFromOnboarding, setWasPrefilledFromOnboarding] = useState(false);
    const [showPrefilledAlert, setShowPrefilledAlert] = useState(false);

    // Initialize form data with potential prefill from onboarding
    const [formData, setFormData] = useState<FormData>(() => {
        // Check if onboarding data exists and has usable values
        if (onboardingInputs) {
            const prefilledData = mapOnboardingToAdvancedPlanner(onboardingInputs);

            if (hasPrefilledData(prefilledData)) {
                // Merge prefilled data with defaults (prefilled takes precedence)
                return {
                    ...defaultValues,
                    p1_start_age: prefilledData.p1_start_age || defaultValues.p1_start_age,
                    filing_status: prefilledData.filing_status || defaultValues.filing_status,
                    inflation_rate: prefilledData.inflation_rate || defaultValues.inflation_rate,
                    p1_employment_income: prefilledData.p1_employment_income || defaultValues.p1_employment_income,
                    p1_ss_amount: prefilledData.p1_ss_amount || defaultValues.p1_ss_amount,
                    p1_ss_start_age: prefilledData.p1_ss_start_age || defaultValues.p1_ss_start_age,
                    bal_taxable: prefilledData.bal_taxable || defaultValues.bal_taxable,
                    bal_pretax_p1: prefilledData.bal_pretax_p1 || defaultValues.bal_pretax_p1,
                    bal_roth_p1: prefilledData.bal_roth_p1 || defaultValues.bal_roth_p1,
                    p1_pension: prefilledData.p1_pension || defaultValues.p1_pension,
                };
            }
        }

        return defaultValues;
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // UX: Show gentle feedback message on mount if data was prefilled
    useEffect(() => {
        if (onboardingInputs) {
            const prefilledData = mapOnboardingToAdvancedPlanner(onboardingInputs);
            if (hasPrefilledData(prefilledData)) {
                setWasPrefilledFromOnboarding(true);
                setShowPrefilledAlert(true);
            }
        }
    }, []); // Only run once on mount

    const handleChange = (field: keyof FormData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: field === 'p1_name' || field === 'p2_name' || field === 'filing_status'
                ? value
                : typeof value === 'string' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await retirementService.runSimulation(formData as any);
            onSimulationComplete(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Simulation failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Subtle UX Feedback - Prefilled Data Notice */}
            <Collapse in={showPrefilledAlert && wasPrefilledFromOnboarding}>
                <Alert
                    severity="info"
                    onClose={() => setShowPrefilledAlert(false)}
                    sx={{
                        mb: 3,
                        backgroundColor: theme => alpha(theme.palette.info.main, 0.08),
                        border: theme => `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        '& .MuiAlert-message': {
                            color: 'text.primary',
                        },
                        '& .MuiAlert-icon': {
                            color: 'info.main',
                        }
                    }}
                    icon={<Icon icon="solar:check-circle-bold-duotone" width={24} />}
                >
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                        We've pre-filled some details from onboarding
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.8 }}>
                        You can change anything. Complete the rest for deeper accuracy.
                    </Typography>
                </Alert>
            </Collapse>

            {/* Demographics */}
            {/* Demographics */}
            <OnboardingStepCard
                icon={<Icon icon="solar:users-group-rounded-bold-duotone" width={32} color="white" />}
                title="Demographics"
                description="Basic information about you and your partner"
            >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Person 1 Name"
                            value={formData.p1_name}
                            onChange={handleChange('p1_name')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Person 2 Name"
                            value={formData.p2_name}
                            onChange={handleChange('p2_name')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Person 1 Current Age"
                            type="number"
                            value={formData.p1_start_age}
                            onChange={handleChange('p1_start_age')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Person 2 Current Age"
                            type="number"
                            value={formData.p2_start_age}
                            onChange={handleChange('p2_start_age')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="End Simulation Age"
                            type="number"
                            value={formData.end_simulation_age}
                            onChange={handleChange('end_simulation_age')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Inflation Rate (annual)"
                            type="number"
                            inputProps={{ step: 0.001 }}
                            value={formData.inflation_rate}
                            onChange={handleChange('inflation_rate')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Filing Status</InputLabel>
                            <Select
                                value={formData.filing_status}
                                onChange={handleChange('filing_status')}
                                label="Filing Status"
                            >
                                <MenuItem value="MFJ">Married Filing Jointly (MFJ)</MenuItem>
                                <MenuItem value="MFS">Married Filing Separately (MFS)</MenuItem>
                                <MenuItem value="Single">Single</MenuItem>
                                <MenuItem value="HOH">Head of Household (HOH)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </OnboardingStepCard>

            {/* Spending & Goals */}
            <OnboardingStepCard
                icon={<Icon icon="solar:dollar-bold-duotone" width={32} color="white" />}
                title="Annual Spending & Goals"
                description="Your retirement lifestyle and financial targets"
            >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Annual Spend Goal (today's dollars)"
                            type="number"
                            value={formData.annual_spend_goal}
                            onChange={handleChange('annual_spend_goal')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Target Tax Bracket Rate</InputLabel>
                            <Select
                                value={formData.target_tax_bracket_rate}
                                onChange={handleChange('target_tax_bracket_rate')}
                                label="Target Tax Bracket Rate"
                            >
                                <MenuItem value={0.22}>22% Bracket</MenuItem>
                                <MenuItem value={0.24}>24% Bracket</MenuItem>
                                <MenuItem value={0.32}>32% Bracket</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Previous Year Taxes"
                            type="number"
                            value={formData.previous_year_taxes}
                            onChange={handleChange('previous_year_taxes')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            helperText="Estimated taxes paid last year"
                            required
                        />
                    </Grid>
                </Grid>
            </OnboardingStepCard>

            {/* Employment Income */}
            <OnboardingStepCard
                icon={<Icon icon="solar:case-minimalistic-bold-duotone" width={32} color="white" />}
                title="Employment Income"
                description="Current salary and income details"
            >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="P1 Annual Employment Income"
                            type="number"
                            value={formData.p1_employment_income}
                            onChange={handleChange('p1_employment_income')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="P1 Works Until Age"
                            type="number"
                            value={formData.p1_employment_until_age}
                            onChange={handleChange('p1_employment_until_age')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="P2 Annual Employment Income"
                            type="number"
                            value={formData.p2_employment_income}
                            onChange={handleChange('p2_employment_income')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="P2 Works Until Age"
                            type="number"
                            value={formData.p2_employment_until_age}
                            onChange={handleChange('p2_employment_until_age')}
                            required
                        />
                    </Grid>
                </Grid>
            </OnboardingStepCard>

            {/* Social Security */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    🏛️ Social Security
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Husband SS Amount (annual)"
                            type="number"
                            value={formData.p1_ss_amount}
                            onChange={handleChange('p1_ss_amount')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Husband SS Start Age"
                            type="number"
                            value={formData.p1_ss_start_age}
                            onChange={handleChange('p1_ss_start_age')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Wife SS Amount (annual)"
                            type="number"
                            value={formData.p2_ss_amount}
                            onChange={handleChange('p2_ss_amount')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Wife SS Start Age"
                            type="number"
                            value={formData.p2_ss_start_age}
                            onChange={handleChange('p2_ss_start_age')}
                            required
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Pensions */}
            <OnboardingStepCard
                icon={<Icon icon="solar:wallet-money-bold-duotone" width={32} color="white" />}
                title="Pensions"
                description="Pension plan details"
            >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Husband Annual Pension"
                            type="number"
                            value={formData.p1_pension}
                            onChange={handleChange('p1_pension')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Husband Pension Start Age"
                            type="number"
                            value={formData.p1_pension_start_age}
                            onChange={handleChange('p1_pension_start_age')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Wife Annual Pension"
                            type="number"
                            value={formData.p2_pension}
                            onChange={handleChange('p2_pension')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Wife Pension Start Age"
                            type="number"
                            value={formData.p2_pension_start_age}
                            onChange={handleChange('p2_pension_start_age')}
                        />
                    </Grid>
                </Grid>
            </OnboardingStepCard>

            {/* Account Balances */}
            <OnboardingStepCard
                icon={<Icon icon="solar:wallet-bold-duotone" width={32} color="white" />}
                title="Account Balances"
                description="Current retirement savings and investments (today's dollars)"
            >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Taxable Brokerage Account"
                            type="number"
                            value={formData.bal_taxable}
                            onChange={handleChange('bal_taxable')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Pre-Tax P1 (401k/IRA)"
                            type="number"
                            value={formData.bal_pretax_p1}
                            onChange={handleChange('bal_pretax_p1')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Pre-Tax P2 (401k/IRA)"
                            type="number"
                            value={formData.bal_pretax_p2}
                            onChange={handleChange('bal_pretax_p2')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Roth P1"
                            type="number"
                            value={formData.bal_roth_p1}
                            onChange={handleChange('bal_roth_p1')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Roth P2"
                            type="number"
                            value={formData.bal_roth_p2}
                            onChange={handleChange('bal_roth_p2')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                </Grid>
            </OnboardingStepCard>

            {/* Investment Returns */}
            <OnboardingStepCard
                icon={<Icon icon="solar:graph-up-bold-duotone" width={32} color="white" />}
                title="Expected Annual Returns"
                description="Projected investment growth rates"
            >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Taxable Brokerage Return"
                            type="number"
                            inputProps={{ step: 0.001 }}
                            value={formData.growth_rate_taxable}
                            onChange={handleChange('growth_rate_taxable')}
                            helperText="e.g., 0.07 = 7%"
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="P1 Pre-Tax Return"
                            type="number"
                            inputProps={{ step: 0.001 }}
                            value={formData.growth_rate_pretax_p1}
                            onChange={handleChange('growth_rate_pretax_p1')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="P2 Pre-Tax Return"
                            type="number"
                            inputProps={{ step: 0.001 }}
                            value={formData.growth_rate_pretax_p2}
                            onChange={handleChange('growth_rate_pretax_p2')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="P1 Roth Return"
                            type="number"
                            inputProps={{ step: 0.001 }}
                            value={formData.growth_rate_roth_p1}
                            onChange={handleChange('growth_rate_roth_p1')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="P2 Roth Return"
                            type="number"
                            inputProps={{ step: 0.001 }}
                            value={formData.growth_rate_roth_p2}
                            onChange={handleChange('growth_rate_roth_p2')}
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Taxable Basis Ratio"
                            type="number"
                            inputProps={{ step: 0.01, min: 0, max: 1 }}
                            value={formData.taxable_basis_ratio}
                            onChange={handleChange('taxable_basis_ratio')}
                            helperText="Portion of withdrawal that is principal (0.75 = 75% principal, 25% gains)"
                            required
                        />
                    </Grid>
                </Grid>
            </OnboardingStepCard>

            {/* Real Estate */}
            <OnboardingStepCard
                icon={<Icon icon="solar:home-smile-bold-duotone" width={32} color="white" />}
                title="Real Estate Assets & Mortgages"
                description="Home value and property details"
            >

                <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
                    Primary Home
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Home Value"
                            type="number"
                            value={formData.primary_home_value}
                            onChange={handleChange('primary_home_value')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Annual Appreciation"
                            type="number"
                            inputProps={{ step: 0.001 }}
                            value={formData.primary_home_growth_rate}
                            onChange={handleChange('primary_home_growth_rate')}
                            helperText="e.g., 0.03 = 3%"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Mortgage Principal"
                            type="number"
                            value={formData.primary_home_mortgage_principal}
                            onChange={handleChange('primary_home_mortgage_principal')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Interest Rate (%)"
                            type="number"
                            inputProps={{ step: 0.01 }}
                            value={formData.primary_home_mortgage_rate}
                            onChange={handleChange('primary_home_mortgage_rate')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Years Remaining"
                            type="number"
                            inputProps={{ step: 0.1 }}
                            value={formData.primary_home_mortgage_years}
                            onChange={handleChange('primary_home_mortgage_years')}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Rental Property 1
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Property Value"
                            type="number"
                            value={formData.rental_1_value}
                            onChange={handleChange('rental_1_value')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Annual Rental Income"
                            type="number"
                            value={formData.rental_1_income}
                            onChange={handleChange('rental_1_income')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Property Growth Rate"
                            type="number"
                            inputProps={{ step: 0.001 }}
                            value={formData.rental_1_growth_rate}
                            onChange={handleChange('rental_1_growth_rate')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Income Growth Rate"
                            type="number"
                            inputProps={{ step: 0.001 }}
                            value={formData.rental_1_income_growth_rate}
                            onChange={handleChange('rental_1_income_growth_rate')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Mortgage Principal"
                            type="number"
                            value={formData.rental_1_mortgage_principal}
                            onChange={handleChange('rental_1_mortgage_principal')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Interest Rate (%)"
                            type="number"
                            inputProps={{ step: 0.01 }}
                            value={formData.rental_1_mortgage_rate}
                            onChange={handleChange('rental_1_mortgage_rate')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Years Remaining"
                            type="number"
                            inputProps={{ step: 0.1 }}
                            value={formData.rental_1_mortgage_years}
                            onChange={handleChange('rental_1_mortgage_years')}
                        />
                    </Grid>
                </Grid>
            </OnboardingStepCard>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                        px: 6,
                        fontWeight: 600,
                        borderRadius: '12px',
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #5BE49B 0%, #00A76F 100%) !important',
                        boxShadow: '0 8px 16px 0 rgba(0, 167, 111, 0.24)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 20px 0 rgba(0, 167, 111, 0.32)',
                            background: 'linear-gradient(135deg, #5BE49B 0%, #00A76F 100%) !important',
                        }
                    }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Run Retirement Analysis ▶️'}
                </Button>
            </Box>

            {error && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
                    {error}
                </Box>
            )}
        </Box>
    );
};
