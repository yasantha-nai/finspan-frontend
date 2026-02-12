import { Icon } from '@iconify/react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import { useSimulation } from '@/context/SimulationContext';
import { OnboardingStepCard } from '@/components/onboarding/OnboardingStepCard';
import { TaxFilingStatus, US_STATES } from '@/types/simulation';

const FILING_STATUS_OPTIONS: { value: TaxFilingStatus; label: string; icon: string; description: string }[] = [
  {
    value: 'single',
    label: "I'm Filing Single",
    icon: 'solar:user-bold-duotone',
    description: "For unmarried individuals"
  },
  {
    value: 'married_joint',
    label: "We're Filing Jointly",
    icon: 'solar:users-group-rounded-bold-duotone',
    description: "Best for most married couples"
  },
];

const AGE_PRESETS = [80, 85, 90];

export function Phase1Identity() {
  const { inputs, updateInput } = useSimulation();
  const theme = useTheme();

  return (
    <OnboardingStepCard
      icon={<Icon icon="solar:user-id-bold-duotone" width={32} color="white" />}
      title="Identity & Timeline"
      description="Tell us about yourself and your retirement timeline"
    >
      <Stack spacing={4}>
        {/* Timeline inputs */}
        <Box>
          <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.2}>
            Timeline
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 2 }}>
            <Box flex={1}>
              <TextField
                fullWidth
                type="number"
                label="Current Age"
                value={inputs.currentAge || ''}
                onChange={(e) => updateInput('currentAge', parseInt(e.target.value))}
                inputProps={{ min: 18, max: 100 }}
                helperText="Your current age in years"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box flex={1}>
              <TextField
                fullWidth
                type="number"
                label="Plan Until Age"
                value={inputs.lifeExpectancy || ''}
                onChange={(e) => updateInput('lifeExpectancy', parseInt(e.target.value))}
                inputProps={{ min: Math.max((inputs.currentAge || 18) + 1, 19), max: 110 }}
                helperText="Planning for longevity"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {AGE_PRESETS.map((age) => (
                  <Chip
                    key={age}
                    label={`Age ${age}`}
                    onClick={() => updateInput('lifeExpectancy', age)}
                    color={inputs.lifeExpectancy === age ? "primary" : "default"}
                    variant={inputs.lifeExpectancy === age ? "filled" : "outlined"}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Filing Status */}
        <Box>
          <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.2}>
            Tax Filing Status
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 2 }}>
            {FILING_STATUS_OPTIONS.map((status) => {
              const isSelected = inputs.taxFilingStatus === status.value;

              return (
                <Card
                  key={status.value}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      borderColor: isSelected ? 'primary.main' : 'text.disabled',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                  onClick={() => updateInput('taxFilingStatus', status.value)}
                >
                  {isSelected && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        p: 0.5,
                        display: 'flex',
                        boxShadow: theme.shadows[2]
                      }}
                    >
                      <Icon icon="solar:check-bold" color="white" width={16} />
                    </Box>
                  )}
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : 'action.hover',
                      mb: 2,
                      color: isSelected ? 'primary.main' : 'text.secondary'
                    }}>
                      <Icon
                        icon={status.icon}
                        width={32}
                      />
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={isSelected ? 700 : 500}
                      color={isSelected ? 'text.primary' : 'text.secondary'}
                      display="block"
                    >
                      {status.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {status.description}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* Spouse Information (Married Filing Jointly) */}
        {inputs.taxFilingStatus === 'married_joint' && (
          <Fade in={true}>
            <Box
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.08),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                borderRadius: 2,
                p: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Icon icon="solar:users-group-rounded-bold-duotone" width={24} color={theme.palette.info.main} />
                <Typography variant="subtitle2" color="info.main" fontWeight={700}>
                  Spouse Information
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Box flex={1}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Spouse Current Age"
                    value={inputs.spouseAge || inputs.currentAge || ''}
                    onChange={(e) => updateInput('spouseAge', parseInt(e.target.value))}
                    inputProps={{ min: 18, max: 100 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>

                <Box flex={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', px: 2, gap: 1 }}>
                    <Icon icon="solar:info-circle-bold" color={theme.palette.text.secondary} />
                    <Typography variant="caption" color="text.secondary" lineHeight={1.4}>
                      Life expectancy for spouse defaults to the same planning age set above.
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Fade>
        )}

        {/* State Selection */}
        <Box>
          <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1.2}>
            Location
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="State of Residence"
              value={inputs.stateOfResidence}
              onChange={(e) => updateInput('stateOfResidence', e.target.value)}
              helperText="Determines state income tax calculations"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              {US_STATES.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </Stack>
    </OnboardingStepCard>
  );
}
