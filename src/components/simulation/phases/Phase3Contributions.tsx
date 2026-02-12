import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, useTheme } from '@mui/material/styles';
import { useSimulation } from '@/context/SimulationContext';
import { OnboardingStepCard } from '@/components/onboarding/OnboardingStepCard';

export function Phase3Contributions() {
  const { inputs, updateInput } = useSimulation();
  const theme = useTheme();

  const isMarried = inputs.taxFilingStatus === 'married_joint';

  // Consolidated balances - simple mode mappings
  const [showDetailedBalances, setShowDetailedBalances] = useState(false);

  // 2026 401k Limits
  const baseLimit401k = 24500;
  const catchUp401k = 8000;
  const isCatchUp = inputs.currentAge >= 50;
  const limit401k = isCatchUp ? baseLimit401k + catchUp401k : baseLimit401k;

  // Summary calculations - robust, no undefined vars
  const totalAnnualContribution = (inputs.contribDeferred || 0) + (inputs.contribRoth || 0);

  return (
    <OnboardingStepCard
      icon={<Icon icon="solar:safe-square-bold-duotone" width={32} color="white" />}
      title="Savings & Contributions"
      description="Your current savings and annual contributions"
    >
      <Stack spacing={3}>
        {/* SECTION 1: Current Savings */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Current Balances (Estimate is fine)
          </Typography>
        </Box>

        <Stack spacing={2}>
          {/* 1. Your Total Savings (Always visible) */}
          <TextField
            fullWidth
            type="number"
            label="Your Total Savings"
            value={(inputs.taxDeferredSavings || 0) + (inputs.taxableSavings || 0) + (inputs.taxFreeSavings || 0)}
            disabled={showDetailedBalances}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              // Simple mode: Put it all in taxDeferred
              updateInput('taxDeferredSavings', val);
              updateInput('taxableSavings', 0);
              updateInput('taxFreeSavings', 0);
            }}
            InputProps={{
              startAdornment: '$',
              readOnly: showDetailedBalances
            }}
            helperText={showDetailedBalances ? "Sum of your accounts below" : "All your retirement accounts combined"}
          />

          {/* 2. Spouse Total Savings (if married) */}
          {isMarried && (
            <TextField
              fullWidth
              type="number"
              label="Spouse Total Savings"
              value={showDetailedBalances ? (inputs.spouseTaxDeferredSavings || 0) + (inputs.spouseTaxFreeSavings || 0) + (inputs.spouseTaxableSavings || 0) : (inputs.spouseTaxDeferredSavings || '')}
              disabled={showDetailedBalances}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                // Simple mode: Put it all in spouse taxDeferred
                updateInput('spouseTaxDeferredSavings', val);
                updateInput('spouseTaxFreeSavings', 0);
                updateInput('spouseTaxableSavings', 0);
              }}
              InputProps={{
                startAdornment: '$',
                readOnly: showDetailedBalances
              }}
              helperText={showDetailedBalances ? "Sum of spouse accounts below" : "All spouse's retirement accounts combined"}
            />
          )}

          {/* 2. Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={showDetailedBalances}
                onChange={(e) => setShowDetailedBalances(e.target.checked)}
              />
            }
            label="I want to specify individual account balances (401k, Roth IRA, etc.)"
            sx={{ mb: 2, color: 'text.secondary', display: 'block' }}
          />

          {/* 3. Detailed Breakdown (Conditional) */}
          {showDetailedBalances && (
            <Stack spacing={3} sx={{ bgcolor: alpha(theme.palette.background.default, 0.5), p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              {/* Your Accounts */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                  Your Accounts
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="401(k) / Traditional IRA"
                    value={inputs.taxDeferredSavings || ''}
                    onChange={(e) => updateInput('taxDeferredSavings', parseFloat(e.target.value) || 0)}
                    InputProps={{ startAdornment: '$' }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Roth IRA / Roth 401(k)"
                    value={inputs.taxFreeSavings || ''}
                    onChange={(e) => updateInput('taxFreeSavings', parseFloat(e.target.value) || 0)}
                    InputProps={{ startAdornment: '$' }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Taxable/Brokerage Account"
                    value={inputs.taxableSavings || ''}
                    onChange={(e) => updateInput('taxableSavings', parseFloat(e.target.value) || 0)}
                    InputProps={{ startAdornment: '$' }}
                    sx={{ gridColumn: { sm: 'span 2' } }}
                  />
                </Box>
              </Box>

              {/* Spouse Accounts (if married) */}
              {isMarried && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon icon="solar:users-group-rounded-bold-duotone" width={20} />
                    Spouse Accounts
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Spouse 401(k) / Traditional IRA"
                      value={inputs.spouseTaxDeferredSavings || ''}
                      onChange={(e) => updateInput('spouseTaxDeferredSavings', parseFloat(e.target.value) || 0)}
                      InputProps={{ startAdornment: '$' }}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      label="Spouse Roth IRA / Roth 401(k)"
                      value={inputs.spouseTaxFreeSavings || ''}
                      onChange={(e) => updateInput('spouseTaxFreeSavings', parseFloat(e.target.value) || 0)}
                      InputProps={{ startAdornment: '$' }}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      label="Spouse Taxable/Brokerage Account"
                      value={inputs.spouseTaxableSavings || ''}
                      onChange={(e) => updateInput('spouseTaxableSavings', parseFloat(e.target.value) || 0)}
                      InputProps={{ startAdornment: '$' }}
                      sx={{ gridColumn: { sm: 'span 2' } }}
                    />
                  </Box>
                </Box>
              )}
            </Stack>
          )}
        </Stack>

        {/* SECTION 2: Annual Contributions */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Annual Contributions
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {/* Primary: 401k */}
          <Box flex={1}>
            <TextField
              fullWidth
              type="number"
              label="Your 401(k) Contribution"
              value={inputs.contribDeferred || ''}
              onChange={(e) => updateInput('contribDeferred', parseFloat(e.target.value) || 0)}
              InputProps={{ startAdornment: '$' }}
            />
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(((inputs.contribDeferred || 0) / limit401k) * 100, 100)}
                sx={{ height: 6, borderRadius: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {Math.round(((inputs.contribDeferred || 0) / limit401k) * 100)}% of limit
                </Typography>
                {(inputs.contribDeferred || 0) < limit401k ? (
                  <Typography
                    variant="caption"
                    color="primary"
                    sx={{ cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => updateInput('contribDeferred', limit401k)}
                  >
                    Max Out (${limit401k.toLocaleString()})
                  </Typography>
                ) : (
                  <Chip label="Maxed! 🎉" size="small" color="success" />
                )}
              </Box>
            </Box>
          </Box>

          {/* Secondary: Roth IRA */}
          <Box flex={1}>
            <TextField
              fullWidth
              type="number"
              label="Your Roth IRA Contribution"
              value={inputs.contribRoth || ''}
              onChange={(e) => updateInput('contribRoth', parseFloat(e.target.value) || 0)}
              InputProps={{ startAdornment: '$' }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Annual contribution amount
            </Typography>
          </Box>
        </Stack>

        {/* SECTION 3: Investment & Employer */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Investment Returns
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: alpha(theme.palette.info.main, 0.08),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            borderRadius: 2,
            p: 2,
            mb: 3
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            📊 Historical Annual Returns (Long-term Average)
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, fontSize: '0.875rem' }}>
            <Box sx={{ color: 'text.secondary' }}>Stocks (S&P 500): <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>~10%</Box></Box>
            <Box sx={{ color: 'text.secondary' }}>Bonds: <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>~5-6%</Box></Box>
            <Box sx={{ color: 'text.secondary' }}>60/40 Portfolio: <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>~8%</Box></Box>
            <Box sx={{ color: 'text.secondary' }}>Conservative (40/60): <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>~6-7%</Box></Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            💡 <strong>Tip:</strong> Use 7% for balanced approach, 6% for conservative, 8-9% for aggressive.
          </Typography>
        </Box>

        <Box>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>Expected Annual Return</FormLabel>
            <Select
              value={inputs.preRetirementReturn}
              onChange={(e) => updateInput('preRetirementReturn', e.target.value as number)}
            >
              <MenuItem value={5}>Conservative (5%)</MenuItem>
              <MenuItem value={6}>Moderate Conservative (6%)</MenuItem>
              <MenuItem value={7}>Balanced (7%) - Recommended</MenuItem>
              <MenuItem value={8}>Moderate Growth (8%)</MenuItem>
              <MenuItem value={9}>Growth (9%)</MenuItem>
              <MenuItem value={10}>Aggressive (10%)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* SECTION 4: Annual Contributions Summary */}
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.08),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="solar:dollar-minimalistic-bold-duotone" width={20} />
              Annual Contribution Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  401(k) Contribution
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  ${(inputs.contribDeferred || 0).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Roth IRA
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  ${(inputs.contribRoth || 0).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1.5, gridColumn: { sm: 'span 2' } }}>
                <Typography variant="caption" color="text.secondary">
                  Total Annual Savings
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  ${totalAnnualContribution.toLocaleString()}/year
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Savings rate: {inputs.currentSalary > 0 ? ((totalAnnualContribution / inputs.currentSalary) * 100).toFixed(1) : '0'}% of salary
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </OnboardingStepCard>
  );
}
