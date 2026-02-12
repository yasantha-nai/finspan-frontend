import { Icon } from '@iconify/react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { alpha, useTheme } from '@mui/material/styles';
import { useSimulation } from '@/context/SimulationContext';
import { OnboardingStepCard } from '@/components/onboarding/OnboardingStepCard';
import { RothStrategy, TAX_BRACKETS } from '@/types/simulation';

const ROTH_STRATEGY_OPTIONS: { value: RothStrategy; label: string; description: string }[] = [
  {
    value: 'none',
    label: 'No Conversion',
    description: 'Standard approach - no Roth conversions',
  },
  {
    value: 'fill_bracket',
    label: 'Fill Tax Bracket',
    description: 'Convert up to top of target tax bracket each year',
  },
  {
    value: 'fixed_amount',
    label: 'Fixed Amount',
    description: 'Convert a specific amount annually',
  },
];

export function Phase5Strategy() {
  const { inputs, updateInput } = useSimulation();
  const theme = useTheme();

  return (
    <OnboardingStepCard
      icon={<Icon icon="solar:lightbulb-bolt-bold-duotone" width={32} color="white" />}
      title="Advanced Strategies"
      description="Fine-tune your tax optimization and legacy planning"
    >
      <Stack spacing={3}>
        {/* Roth Conversion Strategy */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Roth Conversion Strategy
          </Typography>
        </Box>

        <Box>
          <FormControl fullWidth>
            <RadioGroup
              value={inputs.rothStrategy}
              onChange={(e) => updateInput('rothStrategy', e.target.value as RothStrategy)}
            >
              {ROTH_STRATEGY_OPTIONS.map((option) => (
                <Card
                  key={option.value}
                  sx={{
                    mb: 1.5,
                    cursor: 'pointer',
                    border: `2px solid ${inputs.rothStrategy === option.value
                      ? theme.palette.primary.main
                      : alpha(theme.palette.grey[500], 0.12)
                      }`,
                    bgcolor:
                      inputs.rothStrategy === option.value
                        ? alpha(theme.palette.primary.main, 0.08)
                        : 'transparent',
                  }}
                  onClick={() => updateInput('rothStrategy', option.value)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {option.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {inputs.rothStrategy === 'fill_bracket' && (
          <Box
            sx={{
              pl: 4,
              borderLeft: `3px solid ${theme.palette.primary.main}`,
            }}
          >
            <TextField
              fullWidth
              select
              label="Target Tax Bracket"
              value={inputs.taxTargetBracket}
              onChange={(e) => updateInput('taxTargetBracket', e.target.value)}
              helperText="Convert up to the top of this tax bracket"
            >
              {TAX_BRACKETS.map((bracket) => (
                <MenuItem key={bracket} value={bracket}>
                  {bracket}%
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {inputs.rothStrategy === 'fixed_amount' && (
          <Box
            sx={{
              pl: 4,
              borderLeft: `3px solid ${theme.palette.primary.main}`,
            }}
          >
            <TextField
              fullWidth
              type="number"
              label="Annual Conversion Amount"
              value={inputs.rothConversionAmount ?? 0}
              onChange={(e) => updateInput('rothConversionAmount', parseFloat(e.target.value) || 0)}
              InputProps={{ startAdornment: '$' }}
              helperText="Fixed amount to convert from Traditional to Roth each year"
            />
          </Box>
        )}

        {/* Legacy Planning */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Legacy Planning
          </Typography>
        </Box>

        <Box width={{ xs: '100%', sm: '50%' }}>
          <TextField
            fullWidth
            type="number"
            label="Legacy Goal"
            value={inputs.legacyGoal}
            onChange={(e) => updateInput('legacyGoal', parseFloat(e.target.value) || 0)}
            InputProps={{ startAdornment: '$' }}
            helperText="Target amount to leave behind"
          />
        </Box>

        <Box>
          <Box
            sx={{
              bgcolor: alpha(theme.palette.info.main, 0.08),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              💡 <strong>Tip:</strong> Setting a legacy goal changes the success metric from "$0 at death" to
              maintaining a minimum estate value throughout retirement.
            </Typography>
          </Box>
        </Box>
      </Stack>
    </OnboardingStepCard>
  );
}
