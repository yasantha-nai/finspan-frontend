import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { Icon } from '@iconify/react';
import { alpha, useTheme } from '@mui/material/styles';
import { muiTheme } from '@/theme/mui-theme';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { navConfig } from '@/config/navigation';
import { useSimulation } from '@/context/SimulationContext';
import { TaxFilingStatus, US_STATES, TAX_BRACKETS } from '@/types/simulation';
import { useNavigate } from 'react-router-dom';

export default function InputDataPage() {
    const { inputs, updateInput, runSim, isSimulating } = useSimulation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [hasChanges, setHasChanges] = useState(false);

    const handleSaveAndSimulate = async () => {
        await runSim();
        setHasChanges(false);
        // Navigate to dashboard after simulation completes
        navigate('/dashboard');
    };

    const handleInputChange = (key: string, value: any) => {
        updateInput(key as any, value);
        setHasChanges(true);
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <DashboardLayout navItems={navConfig} title="Input Data">
                <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Input Data & Parameters
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            View and edit all simulation parameters. Changes will re-run the simulation automatically.
                        </Typography>
                    </Box>

                    {/* Save Button */}
                    {hasChanges && (
                        <Alert 
                            severity="info" 
                            sx={{ mb: 3 }}
                            action={
                                <Button 
                                    color="inherit" 
                                    size="small"
                                    variant="outlined"
                                    onClick={handleSaveAndSimulate}
                                    disabled={isSimulating}
                                >
                                    {isSimulating ? 'Running...' : 'Save & Run Simulation'}
                                </Button>
                            }
                        >
                            You have unsaved changes. Save to update your simulation.
                        </Alert>
                    )}

                    <Stack spacing={2}>
                        {/* 1. IDENTITY & DEMOGRAPHICS */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold" />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Icon icon="solar:user-id-bold-duotone" width={24} color={theme.palette.primary.main} />
                                    <Typography variant="h6" fontWeight={600}>Identity & Timeline</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                    <TextField
                                        type="number"
                                        label="Current Age"
                                        value={inputs.currentAge || ''}
                                        onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value))}
                                        inputProps={{ min: 18, max: 100 }}
                                    />
                                    <TextField
                                        type="number"
                                        label="Retirement Age"
                                        value={inputs.retirementAge || ''}
                                        onChange={(e) => handleInputChange('retirementAge', parseInt(e.target.value))}
                                        inputProps={{ min: inputs.currentAge + 1, max: 80 }}
                                    />
                                    <TextField
                                        type="number"
                                        label="Plan Until Age (Life Expectancy)"
                                        value={inputs.lifeExpectancy || ''}
                                        onChange={(e) => handleInputChange('lifeExpectancy', parseInt(e.target.value))}
                                        inputProps={{ min: inputs.retirementAge + 1, max: 110 }}
                                    />
                                    <TextField
                                        select
                                        label="Tax Filing Status"
                                        value={inputs.taxFilingStatus}
                                        onChange={(e) => handleInputChange('taxFilingStatus', e.target.value as TaxFilingStatus)}
                                    >
                                        <MenuItem value="single">Single</MenuItem>
                                        <MenuItem value="married_joint">Married Filing Jointly</MenuItem>
                                    </TextField>
                                    <TextField
                                        select
                                        label="State of Residence"
                                        value={inputs.stateOfResidence}
                                        onChange={(e) => handleInputChange('stateOfResidence', e.target.value)}
                                        sx={{ gridColumn: { sm: 'span 2' } }}
                                    >
                                        {US_STATES.map((state) => (
                                            <MenuItem key={state} value={state}>{state}</MenuItem>
                                        ))}
                                    </TextField>
                                    
                                    {inputs.taxFilingStatus === 'married_joint' && (
                                        <TextField
                                            type="number"
                                            label="Spouse Age"
                                            value={inputs.spouseAge || inputs.currentAge || ''}
                                            onChange={(e) => handleInputChange('spouseAge', parseInt(e.target.value))}
                                            inputProps={{ min: 18, max: 100 }}
                                        />
                                    )}
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* 2. EMPLOYMENT & INCOME */}
                        <Accordion>
                            <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold" />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Icon icon="solar:briefcase-bold-duotone" width={24} color={theme.palette.primary.main} />
                                    <Typography variant="h6" fontWeight={600}>Employment & Income</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                    <TextField
                                        type="number"
                                        label="Annual Salary"
                                        value={inputs.currentSalary || ''}
                                        onChange={(e) => handleInputChange('currentSalary', parseFloat(e.target.value) || 0)}
                                        InputProps={{ startAdornment: '$' }}
                                    />
                                    <TextField
                                        type="number"
                                        label="Annual Spending Goal"
                                        value={inputs.currentExpenses || ''}
                                        onChange={(e) => handleInputChange('currentExpenses', parseFloat(e.target.value) || 0)}
                                        InputProps={{ startAdornment: '$' }}
                                    />
                                    
                                    {inputs.taxFilingStatus === 'married_joint' && (
                                        <>
                                            <TextField
                                                type="number"
                                                label="Spouse Annual Salary"
                                                value={inputs.spouseSalary || ''}
                                                onChange={(e) => handleInputChange('spouseSalary', parseFloat(e.target.value) || 0)}
                                                InputProps={{ startAdornment: '$' }}
                                            />
                                            <TextField
                                                type="number"
                                                label="Spouse Retirement Age"
                                                value={inputs.spouseRetirementAge || inputs.retirementAge || ''}
                                                onChange={(e) => handleInputChange('spouseRetirementAge', parseInt(e.target.value))}
                                                inputProps={{ min: (inputs.spouseAge || inputs.currentAge) + 1, max: 80 }}
                                            />
                                        </>
                                    )}
                                    
                                    <TextField
                                        type="number"
                                        label="Inflation Rate (%)"
                                        value={inputs.generalInflation || ''}
                                        onChange={(e) => handleInputChange('generalInflation', parseFloat(e.target.value) || 0)}
                                        InputProps={{ endAdornment: '%' }}
                                        helperText="Expected annual inflation (typically 2-3%)"
                                    />
                                    <TextField
                                        select
                                        label="Target Tax Bracket"
                                        value={inputs.taxTargetBracket}
                                        onChange={(e) => handleInputChange('taxTargetBracket', e.target.value)}
                                        helperText="Tax optimization strategy"
                                    >
                                        {TAX_BRACKETS.map((bracket) => (
                                            <MenuItem key={bracket} value={bracket}>{bracket}%</MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* 3. SAVINGS & ACCOUNTS */}
                        <Accordion>
                            <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold" />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Icon icon="solar:safe-square-bold-duotone" width={24} color={theme.palette.primary.main} />
                                    <Typography variant="h6" fontWeight={600}>Current Savings & Account Balances</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={3}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Your Accounts
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                        <TextField
                                            type="number"
                                            label="401(k) / Traditional IRA"
                                            value={inputs.taxDeferredSavings || ''}
                                            onChange={(e) => handleInputChange('taxDeferredSavings', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Roth IRA / Roth 401(k)"
                                            value={inputs.taxFreeSavings || ''}
                                            onChange={(e) => handleInputChange('taxFreeSavings', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Taxable/Brokerage Account"
                                            value={inputs.taxableSavings || ''}
                                            onChange={(e) => handleInputChange('taxableSavings', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Expected Return (%)"
                                            value={inputs.preRetirementReturn || ''}
                                            onChange={(e) => handleInputChange('preRetirementReturn', parseFloat(e.target.value) || 0)}
                                            InputProps={{ endAdornment: '%' }}
                                            helperText="Annual investment return (typically 5-10%)"
                                        />
                                    </Box>

                                    {inputs.taxFilingStatus === 'married_joint' && (
                                        <>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mt: 2 }}>
                                                Spouse Accounts
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                                <TextField
                                                    type="number"
                                                    label="Spouse 401(k) / Traditional IRA"
                                                    value={inputs.spouseTaxDeferredSavings || ''}
                                                    onChange={(e) => handleInputChange('spouseTaxDeferredSavings', parseFloat(e.target.value) || 0)}
                                                    InputProps={{ startAdornment: '$' }}
                                                />
                                                <TextField
                                                    type="number"
                                                    label="Spouse Roth IRA / Roth 401(k)"
                                                    value={inputs.spouseTaxFreeSavings || ''}
                                                    onChange={(e) => handleInputChange('spouseTaxFreeSavings', parseFloat(e.target.value) || 0)}
                                                    InputProps={{ startAdornment: '$' }}
                                                />
                                                <TextField
                                                    type="number"
                                                    label="Spouse Taxable/Brokerage Account"
                                                    value={inputs.spouseTaxableSavings || ''}
                                                    onChange={(e) => handleInputChange('spouseTaxableSavings', parseFloat(e.target.value) || 0)}
                                                    InputProps={{ startAdornment: '$' }}
                                                />
                                            </Box>
                                        </>
                                    )}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>

                        {/* 4. SOCIAL SECURITY & PENSION */}
                        <Accordion>
                            <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold" />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Icon icon="solar:hand-money-bold-duotone" width={24} color={theme.palette.primary.main} />
                                    <Typography variant="h6" fontWeight={600}>Social Security & Pension</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                    <TextField
                                        type="number"
                                        label="Your SS Monthly Benefit"
                                        value={inputs.ssEstimatedAmount || ''}
                                        onChange={(e) => handleInputChange('ssEstimatedAmount', parseFloat(e.target.value) || 0)}
                                        InputProps={{ startAdornment: '$' }}
                                        helperText="Monthly amount (estimate from SSA.gov)"
                                    />
                                    <TextField
                                        type="number"
                                        label="Your SS Start Age"
                                        value={inputs.ssStartAge || 67}
                                        onChange={(e) => handleInputChange('ssStartAge', parseInt(e.target.value))}
                                        inputProps={{ min: 62, max: 75 }}
                                        helperText="Age you'll start claiming (62-70)"
                                    />
                                    
                                    {inputs.taxFilingStatus === 'married_joint' && (
                                        <>
                                            <TextField
                                                type="number"
                                                label="Spouse SS Monthly Benefit"
                                                value={inputs.spouseSsAmount || ''}
                                                onChange={(e) => handleInputChange('spouseSsAmount', parseFloat(e.target.value) || 0)}
                                                InputProps={{ startAdornment: '$' }}
                                            />
                                            <TextField
                                                type="number"
                                                label="Spouse SS Start Age"
                                                value={inputs.spouseSsStartAge || 67}
                                                onChange={(e) => handleInputChange('spouseSsStartAge', parseInt(e.target.value))}
                                                inputProps={{ min: 62, max: 75 }}
                                            />
                                        </>
                                    )}

                                    <TextField
                                        type="number"
                                        label="Your Annual Pension"
                                        value={inputs.pensionIncome || ''}
                                        onChange={(e) => handleInputChange('pensionIncome', parseFloat(e.target.value) || 0)}
                                        InputProps={{ startAdornment: '$' }}
                                        helperText="Annual pension amount (if any)"
                                    />
                                    
                                    {inputs.taxFilingStatus === 'married_joint' && (
                                        <TextField
                                            type="number"
                                            label="Spouse Annual Pension"
                                            value={inputs.spousePensionIncome || ''}
                                            onChange={(e) => handleInputChange('spousePensionIncome', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                    )}
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* 5. DEBTS & HOUSING */}
                        <Accordion>
                            <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold" />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Icon icon="solar:home-2-bold-duotone" width={24} color={theme.palette.primary.main} />
                                    <Typography variant="h6" fontWeight={600}>Housing, Debts & Expenses</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={3}>
                                    {/* Housing */}
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                        Housing
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                        <TextField
                                            select
                                            label="Housing Status"
                                            value={inputs.homePurchasePlan || 'rent'}
                                            onChange={(e) => handleInputChange('homePurchasePlan', e.target.value)}
                                        >
                                            <MenuItem value="rent">Rent</MenuItem>
                                            <MenuItem value="own">Own</MenuItem>
                                        </TextField>
                                        
                                        {inputs.homePurchasePlan === 'rent' ? (
                                            <TextField
                                                type="number"
                                                label="Monthly Rent"
                                                value={inputs.currentMonthlyRent || ''}
                                                onChange={(e) => handleInputChange('currentMonthlyRent', parseFloat(e.target.value) || 0)}
                                                InputProps={{ startAdornment: '$' }}
                                            />
                                        ) : (
                                            <>
                                                <TextField
                                                    type="number"
                                                    label="Home Value"
                                                    value={inputs.homeValue || ''}
                                                    onChange={(e) => handleInputChange('homeValue', parseFloat(e.target.value) || 0)}
                                                    InputProps={{ startAdornment: '$' }}
                                                />
                                                <TextField
                                                    type="number"
                                                    label="Mortgage Balance"
                                                    value={inputs.mortgageBalance || ''}
                                                    onChange={(e) => handleInputChange('mortgageBalance', parseFloat(e.target.value) || 0)}
                                                    InputProps={{ startAdornment: '$' }}
                                                />
                                                <TextField
                                                    type="number"
                                                    label="Monthly Mortgage Payment"
                                                    value={inputs.monthlyMortgagePayment || ''}
                                                    onChange={(e) => handleInputChange('monthlyMortgagePayment', parseFloat(e.target.value) || 0)}
                                                    InputProps={{ startAdornment: '$' }}
                                                />
                                                <TextField
                                                    type="number"
                                                    label="Mortgage Years Remaining"
                                                    value={inputs.mortgageYearsRemaining || ''}
                                                    onChange={(e) => handleInputChange('mortgageYearsRemaining', parseFloat(e.target.value) || 0)}
                                                />
                                            </>
                                        )}
                                    </Box>

                                    {/* Debts */}
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mt: 2 }}>
                                        Debts & Loans
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
                                        <TextField
                                            type="number"
                                            label="Student Loan Balance"
                                            value={inputs.studentLoanBalance || ''}
                                            onChange={(e) => handleInputChange('studentLoanBalance', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Student Loan Payment"
                                            value={inputs.studentLoanPayment || ''}
                                            onChange={(e) => handleInputChange('studentLoanPayment', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Student Loan Rate (%)"
                                            value={inputs.studentLoanRate || ''}
                                            onChange={(e) => handleInputChange('studentLoanRate', parseFloat(e.target.value) || 0)}
                                            InputProps={{ endAdornment: '%' }}
                                        />
                                        
                                        <TextField
                                            type="number"
                                            label="Car Loan Balance"
                                            value={inputs.carLoanBalance || ''}
                                            onChange={(e) => handleInputChange('carLoanBalance', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Car Loan Payment"
                                            value={inputs.carLoanPayment || ''}
                                            onChange={(e) => handleInputChange('carLoanPayment', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Car Loan Years"
                                            value={inputs.carLoanYears || ''}
                                            onChange={(e) => handleInputChange('carLoanYears', parseFloat(e.target.value) || 0)}
                                        />
                                        
                                        <TextField
                                            type="number"
                                            label="Credit Card Debt"
                                            value={inputs.creditCardDebt || ''}
                                            onChange={(e) => handleInputChange('creditCardDebt', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="CC Monthly Payment"
                                            value={inputs.creditCardPayment || ''}
                                            onChange={(e) => handleInputChange('creditCardPayment', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                    </Box>

                                    {/* Other Income/Expenses */}
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mt: 2 }}>
                                        Additional Income & Expenses
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                        <TextField
                                            type="number"
                                            label="Rental Property Income (Annual)"
                                            value={inputs.rentalIncome || ''}
                                            onChange={(e) => handleInputChange('rentalIncome', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Business Income (Annual)"
                                            value={inputs.businessIncome || ''}
                                            onChange={(e) => handleInputChange('businessIncome', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Annual Medical Expenses"
                                            value={inputs.annualMedicalExpenses || ''}
                                            onChange={(e) => handleInputChange('annualMedicalExpenses', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                        <TextField
                                            type="number"
                                            label="Medical Inflation Rate (%)"
                                            value={inputs.medicalInflation || 5}
                                            onChange={(e) => handleInputChange('medicalInflation', parseFloat(e.target.value) || 0)}
                                            InputProps={{ endAdornment: '%' }}
                                        />
                                    </Box>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>

                        {/* 6. KIDS & DEPENDENTS */}
                        <Accordion>
                            <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold" />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Icon icon="solar:users-group-two-rounded-bold-duotone" width={24} color={theme.palette.primary.main} />
                                    <Typography variant="h6" fontWeight={600}>Kids & Dependents</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
                                    <TextField
                                        type="number"
                                        label="Number of Children"
                                        value={inputs.numChildren || 0}
                                        onChange={(e) => handleInputChange('numChildren', parseInt(e.target.value) || 0)}
                                        inputProps={{ min: 0, max: 10 }}
                                    />
                                    <TextField
                                        type="number"
                                        label="Monthly Spending Per Child"
                                        value={inputs.monthlySpendingPerChild || ''}
                                        onChange={(e) => handleInputChange('monthlySpendingPerChild', parseFloat(e.target.value) || 0)}
                                        InputProps={{ startAdornment: '$' }}
                                    />
                                    <TextField
                                        type="number"
                                        label="College Savings Goal (per child)"
                                        value={inputs.collegeSavingsPerChild || ''}
                                        onChange={(e) => handleInputChange('collegeSavingsPerChild', parseFloat(e.target.value) || 0)}
                                        InputProps={{ startAdornment: '$' }}
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* 7. LEGACY & INSURANCE */}
                        <Accordion>
                            <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-bold" />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Icon icon="solar:shield-check-bold-duotone" width={24} color={theme.palette.primary.main} />
                                    <Typography variant="h6" fontWeight={600}>Legacy Planning & Insurance</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                    <TextField
                                        type="number"
                                        label="Legacy Goal"
                                        value={inputs.legacyGoal || ''}
                                        onChange={(e) => handleInputChange('legacyGoal', parseFloat(e.target.value) || 0)}
                                        InputProps={{ startAdornment: '$' }}
                                        helperText="Amount to leave to heirs"
                                    />
                                    <TextField
                                        select
                                        label="Life Insurance Type"
                                        value={inputs.lifeInsuranceType || 'none'}
                                        onChange={(e) => handleInputChange('lifeInsuranceType', e.target.value)}
                                    >
                                        <MenuItem value="none">None</MenuItem>
                                        <MenuItem value="term">Term Life</MenuItem>
                                        <MenuItem value="whole">Whole Life</MenuItem>
                                    </TextField>
                                    {inputs.lifeInsuranceType !== 'none' && (
                                        <TextField
                                            type="number"
                                            label="Monthly Insurance Premium"
                                            value={inputs.lifeInsurancePremium || ''}
                                            onChange={(e) => handleInputChange('lifeInsurancePremium', parseFloat(e.target.value) || 0)}
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                    )}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>

                    {/* Bottom Action Bar */}
                    <Box sx={{ 
                        position: 'sticky', 
                        bottom: 0, 
                        bgcolor: alpha(theme.palette.background.paper, 0.95),
                        backdropFilter: 'blur(8px)',
                        borderTop: 1,
                        borderColor: 'divider',
                        p: 3,
                        mt: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            {hasChanges ? '⚠️ Unsaved changes' : '✅ All changes saved'}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button 
                                variant="outlined" 
                                onClick={() => navigate('/dashboard')}
                                disabled={isSimulating}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={handleSaveAndSimulate}
                                disabled={!hasChanges || isSimulating}
                                startIcon={isSimulating ? <Icon icon="svg-spinners:ring-resize" /> : <Icon icon="solar:check-circle-bold" />}
                            >
                                {isSimulating ? 'Running Simulation...' : 'Save & Update Simulation'}
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </DashboardLayout>
        </ThemeProvider>
    );
}
