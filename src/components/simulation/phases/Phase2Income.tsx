import { Icon } from '@iconify/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { alpha, useTheme } from '@mui/material/styles';
import { useSimulation } from '@/context/SimulationContext';
import { OnboardingStepCard } from '@/components/onboarding/OnboardingStepCard';
import { TAX_BRACKETS } from '@/types/simulation';
import { InputField } from '../InputField';
import { motion } from 'framer-motion';
import { useEffect, useMemo, forwardRef } from 'react';

// 2024 Federal Tax Brackets (Married Filing Jointly)
const TAX_BRACKETS_2024_MFJ = [
  { rate: 10, max: 22000 },
  { rate: 12, max: 89075 },
  { rate: 22, max: 190750 },
  { rate: 24, max: 364200 },
  { rate: 32, max: 462500 },
  { rate: 35, max: 693750 },
  { rate: 37, max: Infinity }
];

// 2024 Federal Tax Brackets (Single)
const TAX_BRACKETS_2024_SINGLE = [
  { rate: 10, max: 11000 },
  { rate: 12, max: 44725 },
  { rate: 22, max: 95375 },
  { rate: 24, max: 182100 },
  { rate: 32, max: 231250 },
  { rate: 35, max: 578125 },
  { rate: 37, max: Infinity }
];

export function Phase2Income() {
  const { inputs, updateInput } = useSimulation();
  const theme = useTheme();

  // Live Calculations for Summary Header
  const isMarried = inputs.taxFilingStatus === 'married_joint';
  const totalAnnualIncome = (inputs.currentSalary || 0) + (isMarried ? (inputs.spouseSalary || 0) : 0);
  
  // Auto-calculate spending goal as 75% of total salary
  const defaultSpendingGoal = useMemo(() => Math.round(totalAnnualIncome * 0.75), [totalAnnualIncome]);
  
  // Auto-calculate tax bracket based on taxable income
  const calculatedTaxBracket = useMemo(() => {
    const standardDeduction = isMarried ? 29200 : 14600; // 2024 values
    const taxableIncome = Math.max(0, totalAnnualIncome - standardDeduction - (inputs.currentExpenses || defaultSpendingGoal));
    
    const brackets = isMarried ? TAX_BRACKETS_2024_MFJ : TAX_BRACKETS_2024_SINGLE;
    for (const bracket of brackets) {
      if (taxableIncome <= bracket.max) {
        return bracket.rate.toString();
      }
    }
    return '37';
  }, [totalAnnualIncome, inputs.currentExpenses, isMarried, defaultSpendingGoal]);
  
  // Auto-update spending goal when income changes (set to 75% of total household income)
  useEffect(() => {
    updateInput('currentExpenses', defaultSpendingGoal);
  }, [defaultSpendingGoal]);
  
  // Auto-update tax bracket when income/expenses change
  useEffect(() => {
    updateInput('taxTargetBracket', calculatedTaxBracket);
  }, [calculatedTaxBracket]);

  const SectionCard = forwardRef<HTMLDivElement, { title: string, icon: string, color: string, children: React.ReactNode }>(
    ({ title, icon, color, children }, ref) => (
      <Card
        ref={ref}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.02)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0px 8px 30px ${color}15`,
            borderColor: `${color}50`
          }
        }}
      >
        {/* Accent Bar */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          bgcolor: color
        }} />

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: '12px',
            bgcolor: `${color}10`,
            color: color,
            display: 'flex',
            boxShadow: `0 2px 8px ${color}20`
          }}>
            <Icon icon={icon} width={24} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            {title}
          </Typography>
        </Box>
        <Stack spacing={3}>
          {children}
        </Stack>
      </Card>
    )
  );
  
  SectionCard.displayName = 'SectionCard';

  return (
    <OnboardingStepCard
      icon={<Icon icon="solar:briefcase-bold-duotone" width={32} color="white" />}
      title="Employment & Income"
      description="Your employment details and income sources"
    >
      {/* Live Summary Dashboard */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px dashed',
        borderColor: 'divider',
        alignItems: 'center'
      }}>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, display: 'block' }}>
            {isMarried ? 'Total Household Income' : 'Annual Salary'}
          </Typography>
          <Typography variant="h4" fontWeight={800} color="primary.main">
            ${totalAnnualIncome.toLocaleString()}
          </Typography>
          {isMarried && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Your: ${(inputs.currentSalary || 0).toLocaleString()} + Spouse: ${(inputs.spouseSalary || 0).toLocaleString()}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 1 }}>
        {/* Employment */}
        <SectionCard title="Your Employment" icon="solar:user-circle-bold-duotone" color="#3B82F6">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box flex={1}>
              <InputField
                id="currentSalary"
                type="currency"
                label="Annual Salary"
                value={inputs.currentSalary}
                onChange={(v) => updateInput('currentSalary', v)}
                tooltip="Your annual employment/W2 income (salary/wages)"
              />
            </Box>
            <Box flex={1}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>Work Until Age</FormLabel>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={inputs.retirementAge || 65}
                    onChange={(_, value) => updateInput('retirementAge', value as number)}
                    min={Math.max((inputs.currentAge || 30) + 1, 31)}
                    max={80}
                    marks
                    valueLabelDisplay="auto"
                    valueLabelFormat={(v) => `Age ${v}`}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Retire at age {inputs.retirementAge || 65}
                </Typography>
              </FormControl>
            </Box>
          </Stack>
        </SectionCard>

        {/* Spouse Employment (Married Filing Jointly) */}
        {isMarried && (
          <Fade in={true}>
            <SectionCard title="Spouse Employment" icon="solar:users-group-rounded-bold-duotone" color="#8B5CF6">
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box flex={1}>
                  <InputField
                    id="spouseSalary"
                    type="currency"
                    label="Annual Salary"
                    value={inputs.spouseSalary || 0}
                    onChange={(v) => updateInput('spouseSalary', v)}
                    tooltip="Spouse's annual employment/W2 income (salary/wages)"
                  />
                </Box>
                <Box flex={1}>
                  <FormControl fullWidth>
                    <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>Work Until Age</FormLabel>
                    <Box sx={{ px: 1 }}>
                      <Slider
                        value={inputs.spouseRetirementAge || inputs.retirementAge || 65}
                        onChange={(_, value) => updateInput('spouseRetirementAge', value as number)}
                        min={Math.max((inputs.spouseAge || inputs.currentAge || 30) + 1, 30)}
                        max={80}
                        marks
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `Age ${v}`}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Retire at age {inputs.spouseRetirementAge || inputs.retirementAge || 65}
                    </Typography>
                  </FormControl>
                </Box>
              </Stack>
            </SectionCard>
          </Fade>
        )}

        {/* Spending Goals */}
        <SectionCard title="Spending Goals" icon="solar:target-bold-duotone" color="#10B981">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box flex={1}>
              <InputField
                id="currentExpenses"
                type="currency"
                label="Annual Spending Goal"
                value={inputs.currentExpenses}
                onChange={(v) => updateInput('currentExpenses', v)}
                tooltip="Your planned annual spending (defaults to 75% of household income)"
              />
            </Box>
            <Box flex={1}>
              <InputField
                id="generalInflation"
                type="percent"
                label="Expected Inflation Rate"
                value={inputs.generalInflation}
                onChange={(v) => updateInput('generalInflation', v)}
                tooltip="Typically 2-3% (0.03 = 3%)"
                max={10}
                step={0.1}
              />
            </Box>
          </Stack>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
              Tax Strategy
            </Typography>
            <TextField
              fullWidth
              select
              label="Target Tax Bracket Rate"
              value={inputs.taxTargetBracket}
              onChange={(e) => updateInput('taxTargetBracket', e.target.value)}
              helperText={`Auto-calculated based on your income and spending. Current bracket: ${calculatedTaxBracket}%`}
            >
              {TAX_BRACKETS.map((bracket) => (
                <MenuItem key={bracket} value={bracket}>
                  {bracket}%
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: alpha(theme.palette.info.main, 0.08),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              borderRadius: 2 
            }}>
              <Typography variant="caption" color="text.secondary">
                💡 <strong>How it's calculated:</strong> Based on your taxable income (total income - expenses - standard deduction) using 2024 federal tax brackets. This helps optimize retirement withdrawal strategies.
              </Typography>
            </Box>
          </Box>
        </SectionCard>

      </Box>
    </OnboardingStepCard>
  );
}
