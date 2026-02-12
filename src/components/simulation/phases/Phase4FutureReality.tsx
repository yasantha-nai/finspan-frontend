import { Icon } from '@iconify/react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { alpha, useTheme } from '@mui/material/styles';
import { useSimulation } from '@/context/SimulationContext';
import { OnboardingStepCard } from '@/components/onboarding/OnboardingStepCard';
import { InputField } from '../InputField';

export function Phase4FutureReality() {
  const { inputs, updateInput } = useSimulation();
  const theme = useTheme();
  const isMarried = inputs.taxFilingStatus === 'married_joint';

  return (
    <OnboardingStepCard
      icon={<Icon icon="solar:bill-list-bold-duotone" width={32} color="white" />}
      title="Optional Details"
      description="Additional financial information for more accurate planning (optional - you can skip these for now)"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Debt & Loans */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon="solar:card-bold-duotone" width={24} color="#EF4444" />
              <Typography fontWeight={600}>Debts & Loans</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {/* Student Loans */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 1.5 }}>
                  Student Loans
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box flex={1}>
                    <InputField
                      id="studentLoanBalance"
                      type="currency"
                      label="Total Balance"
                      value={inputs.studentLoanBalance || 0}
                      onChange={(v) => updateInput('studentLoanBalance', v)}
                      tooltip="Total remaining student loan balance"
                    />
                  </Box>
                  <Box flex={1}>
                    <InputField
                      id="studentLoanPayment"
                      type="currency"
                      label="Monthly Payment"
                      value={inputs.studentLoanPayment || 0}
                      onChange={(v) => updateInput('studentLoanPayment', v)}
                      tooltip="Your monthly student loan payment"
                    />
                  </Box>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Interest Rate (%)"
                      value={inputs.studentLoanRate || 0}
                      onChange={(e) => updateInput('studentLoanRate', parseFloat(e.target.value) || 0)}
                      inputProps={{ min: 0, max: 20, step: 0.1 }}
                    />
                  </Box>
                </Stack>
              </Box>

              {/* Car Loans */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 1.5 }}>
                  Car Loans
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Total Balance"
                      value={inputs.carLoanBalance || 0}
                      onChange={(e) => updateInput('carLoanBalance', parseFloat(e.target.value) || 0)}
                      InputProps={{ startAdornment: '$' }}
                    />
                  </Box>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Monthly Payment"
                      value={inputs.carLoanPayment || 0}
                      onChange={(e) => updateInput('carLoanPayment', parseFloat(e.target.value) || 0)}
                      InputProps={{ startAdornment: '$' }}
                    />
                  </Box>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Years Remaining"
                      value={inputs.carLoanYears || 0}
                      onChange={(e) => updateInput('carLoanYears', parseFloat(e.target.value) || 0)}
                      inputProps={{ min: 0, max: 10, step: 0.5 }}
                    />
                  </Box>
                </Stack>
              </Box>

              {/* Credit Card Debt */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 1.5 }}>
                  Credit Card Debt
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Total Balance"
                      value={inputs.creditCardDebt || 0}
                      onChange={(e) => updateInput('creditCardDebt', parseFloat(e.target.value) || 0)}
                      InputProps={{ startAdornment: '$' }}
                    />
                  </Box>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Monthly Payment"
                      value={inputs.creditCardPayment || 0}
                      onChange={(e) => updateInput('creditCardPayment', parseFloat(e.target.value) || 0)}
                      InputProps={{ startAdornment: '$' }}
                    />
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Housing */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon="solar:home-bold-duotone" width={24} color="#3B82F6" />
              <Typography fontWeight={600}>Housing</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Housing Status</FormLabel>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Box
                    onClick={() => updateInput('homePurchasePlan', 'rent')}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: inputs.homePurchasePlan === 'rent' ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: inputs.homePurchasePlan === 'rent' ? alpha('#3B82F6', 0.1) : 'transparent',
                      flex: 1,
                      textAlign: 'center'
                    }}
                  >
                    Rent
                  </Box>
                  <Box
                    onClick={() => updateInput('homePurchasePlan', 'buy')}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: inputs.homePurchasePlan === 'buy' ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: inputs.homePurchasePlan === 'buy' ? alpha('#3B82F6', 0.1) : 'transparent',
                      flex: 1,
                      textAlign: 'center'
                    }}
                  >
                    Own
                  </Box>
                </Box>
              </FormControl>

              {inputs.homePurchasePlan === 'rent' ? (
                <TextField
                  fullWidth
                  type="number"
                  label="Monthly Rent"
                  value={inputs.currentMonthlyRent || 0}
                  onChange={(e) => updateInput('currentMonthlyRent', parseFloat(e.target.value) || 0)}
                  InputProps={{ startAdornment: '$' }}
                />
              ) : (
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Box flex={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Home Value"
                        value={inputs.homeValue || 0}
                        onChange={(e) => updateInput('homeValue', parseFloat(e.target.value) || 0)}
                        InputProps={{ startAdornment: '$' }}
                      />
                    </Box>
                    <Box flex={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Mortgage Balance"
                        value={inputs.mortgageBalance || 0}
                        onChange={(e) => updateInput('mortgageBalance', parseFloat(e.target.value) || 0)}
                        InputProps={{ startAdornment: '$' }}
                      />
                    </Box>
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Box flex={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Monthly Mortgage Payment"
                        value={inputs.monthlyMortgagePayment || 0}
                        onChange={(e) => updateInput('monthlyMortgagePayment', parseFloat(e.target.value) || 0)}
                        InputProps={{ startAdornment: '$' }}
                      />
                    </Box>
                    <Box flex={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Years Remaining"
                        value={inputs.mortgageYearsRemaining || 0}
                        onChange={(e) => updateInput('mortgageYearsRemaining', parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 0, max: 30, step: 0.5 }}
                      />
                    </Box>
                  </Stack>
                </Stack>
              )}

              {/* Rental Income */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 1.5 }}>
                  Rental Property Income (if applicable)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  label="Annual Rental Income"
                  value={inputs.rentalIncome || 0}
                  onChange={(e) => updateInput('rentalIncome', parseFloat(e.target.value) || 0)}
                  InputProps={{ startAdornment: '$' }}
                  helperText="Net annual income from rental properties"
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Healthcare & Medical */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon="solar:health-bold-duotone" width={24} color="#10B981" />
              <Typography fontWeight={600}>Healthcare & Medical Expenses</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                fullWidth
                type="number"
                label="Annual Medical Expenses"
                value={inputs.annualMedicalExpenses || 0}
                onChange={(e) => updateInput('annualMedicalExpenses', parseFloat(e.target.value) || 0)}
                InputProps={{ startAdornment: '$' }}
                helperText="Out-of-pocket medical costs, premiums, prescriptions"
              />
              <TextField
                fullWidth
                type="number"
                label="Medical Inflation Rate (%)"
                value={inputs.medicalInflation}
                onChange={(e) => updateInput('medicalInflation', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0, max: 15, step: 0.1 }}
                helperText="Typically 5-7% annually"
                InputProps={{ endAdornment: '%' }}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Business Income */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon="solar:case-round-bold-duotone" width={24} color="#F59E0B" />
              <Typography fontWeight={600}>Business Income</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                fullWidth
                type="number"
                label="Annual Business Income"
                value={inputs.businessIncome || 0}
                onChange={(e) => updateInput('businessIncome', parseFloat(e.target.value) || 0)}
                InputProps={{ startAdornment: '$' }}
                helperText="Net income from self-employment or business"
              />
              <TextField
                fullWidth
                type="number"
                label="Business Growth Rate (%)"
                value={inputs.businessGrowthRate || 0}
                onChange={(e) => updateInput('businessGrowthRate', parseFloat(e.target.value) || 0)}
                inputProps={{ min: -10, max: 20, step: 0.5 }}
                helperText="Expected annual growth rate"
                InputProps={{ endAdornment: '%' }}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Kids & Dependents */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon="solar:users-group-rounded-bold-duotone" width={24} color="#FF69B4" />
              <Typography fontWeight={600}>Kids & Dependents</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                fullWidth
                type="number"
                label="Number of Children"
                value={inputs.numChildren || 0}
                onChange={(e) => updateInput('numChildren', parseInt(e.target.value) || 0)}
                inputProps={{ min: 0, max: 10 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Monthly Spending Per Child"
                value={inputs.monthlySpendingPerChild || 0}
                onChange={(e) => updateInput('monthlySpendingPerChild', parseFloat(e.target.value) || 0)}
                InputProps={{ startAdornment: '$' }}
                helperText="Average monthly expenses per child"
              />
              <TextField
                fullWidth
                type="number"
                label="College Savings Goal (per child)"
                value={inputs.collegeSavingsPerChild || 0}
                onChange={(e) => updateInput('collegeSavingsPerChild', parseFloat(e.target.value) || 0)}
                InputProps={{ startAdornment: '$' }}
                helperText="Target amount for college expenses"
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Social Security Benefits */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon="solar:shield-bold-duotone" width={24} color="#8B5CF6" />
              <Typography fontWeight={600}>Social Security Benefits</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box flex={1}>
                  <InputField
                    id="ssStartAge"
                    type="number"
                    label="Your Claiming Age"
                    value={inputs.ssStartAge}
                    onChange={(v) => updateInput('ssStartAge', v)}
                    min={62}
                    max={70}
                    tooltip="Age to start claiming (62-70)"
                  />
                </Box>
                <Box flex={1}>
                  <InputField
                    id="ssEstimatedAmount"
                    type="currency"
                    label="Your Annual Benefit"
                    value={inputs.ssEstimatedAmount}
                    onChange={(v) => updateInput('ssEstimatedAmount', v)}
                    tooltip="Total annual Social Security benefit"
                  />
                </Box>
              </Stack>

              {isMarried && (
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Spouse Claiming Age"
                      value={inputs.spouseSsStartAge || 67}
                      onChange={(e) => updateInput('spouseSsStartAge', parseInt(e.target.value) || 67)}
                      inputProps={{ min: 62, max: 70 }}
                    />
                  </Box>
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Spouse Annual Benefit"
                      value={inputs.spouseSsAmount || 0}
                      onChange={(e) => updateInput('spouseSsAmount', parseFloat(e.target.value) || 0)}
                      InputProps={{ startAdornment: '$' }}
                    />
                  </Box>
                </Stack>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Other Income Sources */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon="solar:hand-money-bold-duotone" width={24} color="#F59E0B" />
              <Typography fontWeight={600}>Other Income (Pension / Passive)</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Box flex={1}>
                <InputField
                  id="pensionIncome"
                  type="currency"
                  label="Annual Pension"
                  value={inputs.pensionIncome}
                  onChange={(v) => updateInput('pensionIncome', v)}
                  tooltip="Expected pension income"
                />
              </Box>
              <Box flex={1}>
                <InputField
                  id="passiveIncome"
                  type="currency"
                  label="Other Passive Income"
                  value={inputs.passiveIncome}
                  onChange={(v) => updateInput('passiveIncome', v)}
                  tooltip="Royalties, dividends, etc."
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Life Insurance */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon="solar:heart-pulse-bold-duotone" width={24} color="#EC4899" />
              <Typography fontWeight={600}>Life Insurance</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Policy Type</FormLabel>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {['none', 'term', 'whole'].map((type) => (
                    <Box
                      key={type}
                      onClick={() => updateInput('lifeInsuranceType', type as any)}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: inputs.lifeInsuranceType === type ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: inputs.lifeInsuranceType === type ? alpha('#EC4899', 0.1) : 'transparent',
                        flex: 1,
                        textAlign: 'center',
                        textTransform: 'capitalize'
                      }}
                    >
                      {type}
                    </Box>
                  ))}
                </Box>
              </FormControl>
              {inputs.lifeInsuranceType !== 'none' && (
                <TextField
                  fullWidth
                  type="number"
                  label="Monthly Premium"
                  value={inputs.lifeInsurancePremium || 0}
                  onChange={(e) => updateInput('lifeInsurancePremium', parseFloat(e.target.value) || 0)}
                  InputProps={{ startAdornment: '$' }}
                />
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Legacy Planning */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon="solar:heart-bold-duotone" width={24} color="#EF4444" />
              <Typography fontWeight={600}>Legacy Planning</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              type="number"
              label="Legacy Goal"
              value={inputs.legacyGoal}
              onChange={(e) => updateInput('legacyGoal', parseFloat(e.target.value) || 0)}
              InputProps={{ startAdornment: '$' }}
              helperText="Target amount to leave behind"
            />
          </AccordionDetails>
        </Accordion>

      </Box>
    </OnboardingStepCard>
  );
}
