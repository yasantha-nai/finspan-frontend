import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { SimulationResult, SimulationInputs } from '@/types/simulation';

interface ScenarioComparisonProps {
    baseline: SimulationResult;
    current: SimulationResult;
    inputs: SimulationInputs;
    onReset: () => void;
    onSave: () => void;
    onUpdate: (changes: Partial<SimulationInputs>) => void;
}

export function ScenarioComparison({ baseline, current, inputs, onReset, onSave, onUpdate }: ScenarioComparisonProps) {
    // Local state for custom purchase input
    const [selectedType, setSelectedType] = useState<{ label: string, icon: string, defaultCost: number, color: string } | null>(null);
    const [customCost, setCustomCost] = useState<string>('');

    const handleAddExpense = () => {
        if (!selectedType || !customCost) return;
        const cost = parseInt(customCost.replace(/,/g, ''), 10);
        if (isNaN(cost)) return;

        const newExpense = {
            id: Date.now().toString(),
            year: inputs.currentAge, // Immediate
            amount: cost,
            description: selectedType.label
        };
        onUpdate({ oneTimeExpenses: [...(inputs.oneTimeExpenses || []), newExpense] });
        setSelectedType(null);
        setCustomCost('');
    };

    // Helper to calculate metrics
    const getMetrics = (res: SimulationResult) => {
        const targetAge = 95;
        let depletionAge = 89;

        if (res.years && res.years.length > 0) {
            const depletionYear = res.years.find(year => year.totalPortfolio <= 0);
            if (depletionYear) {
                depletionAge = depletionYear.userAge;
            } else {
                const lastYear = res.years[res.years.length - 1];
                depletionAge = lastYear?.userAge || targetAge;
            }
        }

        const lastYear = res.years[res.years.length - 1];
        const finalWealth = lastYear?.totalPortfolio || 0;

        return { depletionAge, finalWealth };
    };

    const baseMetrics = getMetrics(baseline);
    const currMetrics = getMetrics(current);

    const ageDiff = currMetrics.depletionAge - baseMetrics.depletionAge;
    const wealthDiff = currMetrics.finalWealth - baseMetrics.finalWealth;

    return (
        <Card sx={{ p: 0, mb: 3, border: '2px solid #8B5CF6', overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{
                bgcolor: '#8B5CF6',
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon icon="solar:git-fork-bold" width={24} />
                    <Typography variant="h6" fontWeight={700}>
                        Scenario Comparison
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={onSave}
                        sx={{ bgcolor: 'white', color: '#8B5CF6', '&:hover': { bgcolor: '#f3f4f6' } }}
                        startIcon={<Icon icon="solar:bookmark-bold" />}
                    >
                        Save New Plan
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        onClick={onReset}
                        sx={{ color: 'white' }}
                        startIcon={<Icon icon="solar:restart-bold" />}
                    >
                        Reset to Baseline
                    </Button>
                </Box>
            </Box>

            {/* Metrics Comparison */}
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Baseline */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            ORIGINAL PLAN
                        </Typography>
                        <Typography variant="h4" fontWeight={600} color="text.secondary">
                            Age {baseMetrics.depletionAge}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Money runs out
                        </Typography>
                    </Grid>

                    {/* Arrow */}
                    <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon icon="solar:arrow-right-linear" width={32} color="#9CA3AF" />
                    </Grid>

                    {/* New Scenario */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="subtitle2" color="primary.main" gutterBottom fontWeight={600}>
                            NEW SCENARIO
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography variant="h4" fontWeight={700} color={ageDiff >= 0 ? 'success.main' : 'error.main'}>
                                Age {currMetrics.depletionAge}
                            </Typography>
                            {ageDiff !== 0 && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: ageDiff > 0 ? 'success.lighter' : 'error.lighter',
                                    color: ageDiff > 0 ? 'success.dark' : 'error.dark',
                                    px: 1, py: 0.5, borderRadius: 1
                                }}>
                                    <Icon icon={ageDiff > 0 ? "solar:arrow-up-linear" : "solar:arrow-down-linear"} width={16} />
                                    <Typography variant="caption" fontWeight={700}>
                                        {Math.abs(ageDiff)} Years
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Typography variant="body2" color="text.primary">
                            Money runs out
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Est. Final Wealth (Age 95)</Typography>
                        <Typography variant="h6">${(currMetrics.finalWealth / 1000000).toFixed(2)}M</Typography>
                        <Typography variant="caption" color={wealthDiff >= 0 ? "success.main" : "error.main"}>
                            {wealthDiff >= 0 ? '+' : ''}${(wealthDiff / 1000000).toFixed(2)}M vs baseline
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        {/* More metrics can go here */}
                    </Grid>
                </Grid>
            </Box>

            <Divider />

            {/* Quick Adjustments */}
            <Box sx={{ p: 3, bgcolor: 'background.neutral' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon icon="solar:tuning-bold-duotone" /> Refine Scenario
                </Typography>

                <Grid container spacing={3}>
                    {/* Retirement Age */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>Retirement Age</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 40, height: 40, borderRadius: 1 }}
                                onClick={() => onUpdate({ retirementAge: Math.max(50, inputs.retirementAge - 1) })}
                            ><Icon icon="solar:minus-circle-bold" width={20} /></Button>

                            <Box sx={{ flex: 1, textAlign: 'center', bgcolor: 'background.paper', py: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h6" fontWeight={700} color="primary.main">
                                    {inputs.retirementAge}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Years Old</Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 40, height: 40, borderRadius: 1 }}
                                onClick={() => onUpdate({ retirementAge: inputs.retirementAge + 1 })}
                            ><Icon icon="solar:add-circle-bold" width={20} /></Button>
                        </Box>
                    </Grid>

                    {/* Annual Spending */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>Annual Spending</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 40, height: 40, borderRadius: 1 }}
                                onClick={() => onUpdate({ currentExpenses: Math.max(0, inputs.currentExpenses - 1000) })}
                            ><Icon icon="solar:minus-circle-bold" width={20} /></Button>

                            <Box sx={{ flex: 1, textAlign: 'center', bgcolor: 'background.paper', py: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h6" fontWeight={700} color="primary.main">
                                    ${(inputs.currentExpenses / 1000).toFixed(1)}k
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Per Year</Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 40, height: 40, borderRadius: 1 }}
                                onClick={() => onUpdate({ currentExpenses: inputs.currentExpenses + 1000 })}
                            ><Icon icon="solar:add-circle-bold" width={20} /></Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Major Purchases */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" gutterBottom>Add Major Purchase (Tap to customize)</Typography>

                    {/* Selection Grid */}
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        {[
                            { label: 'Buy Car', defaultCost: 35000, icon: 'solar:wheel-bold-duotone', color: '#3B82F6' },
                            { label: 'Home Downpayment', defaultCost: 80000, icon: 'solar:home-bold-duotone', color: '#8B5CF6' },
                            { label: 'Renovation', defaultCost: 25000, icon: 'solar:hammer-bold-duotone', color: '#F59E0B' },
                            { label: 'Wedding', defaultCost: 30000, icon: 'solar:heart-bold-duotone', color: '#EC4899' },
                        ].map((item) => {
                            const isSelected = selectedType?.label === item.label;
                            return (
                                <Grid size={{ xs: 6, sm: 3 }} key={item.label}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedType(null); // Deselect
                                            } else {
                                                setSelectedType({ ...item, color: item.color });
                                                setCustomCost(item.defaultCost.toString());
                                            }
                                        }}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1,
                                            p: 2,
                                            borderRadius: 2,
                                            borderColor: isSelected ? item.color : 'divider',
                                            bgcolor: isSelected ? `${item.color}08` : 'background.paper',
                                            color: isSelected ? item.color : 'text.primary',
                                            textTransform: 'none',
                                            borderWidth: isSelected ? 2 : 1,
                                            '&:hover': {
                                                borderColor: item.color,
                                                bgcolor: `${item.color}08`
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            p: 1,
                                            borderRadius: '50%',
                                            bgcolor: isSelected ? 'transparent' : `${item.color}15`,
                                            color: item.color,
                                            mb: 0.5
                                        }}>
                                            <Icon icon={item.icon} width={24} />
                                        </Box>
                                        <Typography variant="body2" fontWeight={600} display="block">
                                            {item.label}
                                        </Typography>
                                    </Button>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* Custom Input Area (Visible when type selected) */}
                    {selectedType && (
                        <Box sx={{
                            mt: 3,
                            p: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            border: '1px dashed',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            animation: 'fadeIn 0.3s ease-in-out',
                            '@keyframes fadeIn': {
                                '0%': { opacity: 0, transform: 'translateY(-10px)' },
                                '100%': { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}>
                            <TextField
                                label={`Cost for ${selectedType.label}`}
                                value={customCost}
                                onChange={(e) => setCustomCost(e.target.value)}
                                size="small"
                                fullWidth
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                autoFocus
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddExpense}
                                sx={{ whiteSpace: 'nowrap', minWidth: 120, height: 40 }}
                                disabled={!customCost}
                            >
                                Add Expense
                            </Button>
                        </Box>
                    )}

                    {/* Active Expenses List */}
                    {inputs.oneTimeExpenses && inputs.oneTimeExpenses.length > 0 && (
                        <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {inputs.oneTimeExpenses.map((exp) => (
                                <Chip
                                    key={exp.id}
                                    label={`${exp.description}: $${(exp.amount / 1000).toFixed(0)}k`}
                                    onDelete={() => {
                                        const filtered = inputs.oneTimeExpenses.filter(e => e.id !== exp.id);
                                        onUpdate({ oneTimeExpenses: filtered });
                                    }}
                                    size="small"
                                    color="error"
                                    variant="filled"
                                    sx={{ fontWeight: 600 }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
        </Card>
    );
}
