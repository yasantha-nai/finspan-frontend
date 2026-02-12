import { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import Chart from 'react-apexcharts';
import { fNumber } from '@/lib/format-number';
import { useSimulation } from '@/context/SimulationContext';
import { retirementService } from '@/services/retirement.service';
import { mapFrontendToBackend } from '@/services/simulation.service';
import { MonteCarloResults, MonteCarloRun } from '@/types/retirement-types';

interface MonteCarloSectionProps {
    baselineData: {
        categories: string[];
        data: number[];
    };
    onMonteCarloChange?: (data: MonteCarloResults | null, selectedRun: MonteCarloRun | null, luckPercentile: number) => void;
}

export function MonteCarloSection({ baselineData, onMonteCarloChange }: MonteCarloSectionProps) {
    const theme = useTheme();
    const { inputs } = useSimulation();
    
    const [enableMonteCarlo, setEnableMonteCarlo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [monteCarloData, setMonteCarloData] = useState<MonteCarloResults | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [luckPercentile, setLuckPercentile] = useState(50); // 50th percentile = median

    const runMonteCarlo = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const backendParams = mapFrontendToBackend(inputs);
            const mcParams = {
                ...backendParams,
                volatility: 0.15, // 15% volatility (standard market volatility)
                num_simulations: 100, // 100 Monte Carlo runs
            };

            console.log('🎲 Running Monte Carlo simulation with 100 runs...');
            const result = await retirementService.runMonteCarlo(mcParams);
            
            if (result.success) {
                setMonteCarloData(result);
                console.log('✅ Monte Carlo completed:', {
                    success_rate: result.success_rate,
                    num_runs: result.num_simulations,
                    total_data_points: result.stats?.length || 0,
                });
            } else {
                setError(result.error || 'Monte Carlo simulation failed');
            }
        } catch (err) {
            console.error('❌ Monte Carlo error:', err);
            setError(err instanceof Error ? err.message : 'Failed to run Monte Carlo simulation');
        } finally {
            setIsLoading(false);
        }
    };

    // Get the selected run based on luck percentile
    const selectedRun = useMemo(() => {
        if (!monteCarloData?.all_runs || monteCarloData.all_runs.length === 0) {
            return null;
        }

        // Sort runs by final net worth
        const sortedRuns = [...monteCarloData.all_runs].sort((a, b) => a.final_nw - b.final_nw);
        
        // Map percentile (0-100) to run index
        const index = Math.floor((luckPercentile / 100) * (sortedRuns.length - 1));
        return sortedRuns[index];
    }, [monteCarloData, luckPercentile]);

    // Run Monte Carlo when enabled
    useEffect(() => {
        if (enableMonteCarlo && !monteCarloData && !isLoading) {
            runMonteCarlo();
        }
    }, [enableMonteCarlo]);

    // Notify parent of Monte Carlo state changes
    useEffect(() => {
        if (onMonteCarloChange) {
            onMonteCarloChange(
                enableMonteCarlo ? monteCarloData : null,
                enableMonteCarlo ? selectedRun : null,
                luckPercentile
            );
        }
    }, [enableMonteCarlo, monteCarloData, selectedRun, luckPercentile, onMonteCarloChange]);

    // Prepare chart data for wealth trajectory with Monte Carlo
    const wealthTrajectoryChart = useMemo(() => {
        const series: any[] = [];

        if (enableMonteCarlo && monteCarloData?.stats && monteCarloData.stats.length > 0) {
            // Monte Carlo data
            const stats = monteCarloData.stats;
            const categories = stats.map(s => `Age ${Math.floor(s.Year)}`);

            // Add percentile bands (10th and 90th)
            series.push({
                name: '90th Percentile (Lucky)',
                data: stats.map(s => s.Net_Worth_P90),
                type: 'line',
                color: theme.palette.success.main,
            });

            series.push({
                name: '50th Percentile (Median)',
                data: stats.map(s => s.Net_Worth_median),
                type: 'line',
                color: theme.palette.primary.main,
            });

            series.push({
                name: '10th Percentile (Unlucky)',
                data: stats.map(s => s.Net_Worth_P10),
                type: 'line',
                color: theme.palette.error.main,
            });

            // Add selected run based on luck slider
            if (selectedRun?.data) {
                series.push({
                    name: `Your Scenario (${luckPercentile}th percentile)`,
                    data: selectedRun.data.map(d => d.Net_Worth),
                    type: 'line',
                    color: theme.palette.warning.main,
                    strokeWidth: 3,
                });
            }

            return { categories, series };
        } else {
            // Baseline data (deterministic)
            return {
                categories: baselineData.categories,
                series: [{
                    name: 'Deterministic Projection',
                    data: baselineData.data,
                    type: 'line',
                    color: theme.palette.primary.main,
                }],
            };
        }
    }, [enableMonteCarlo, monteCarloData, selectedRun, luckPercentile, baselineData, theme]);

    // Monte Carlo statistics chart (distribution of final outcomes)
    const distributionChart = useMemo(() => {
        if (!monteCarloData?.all_runs || monteCarloData.all_runs.length === 0) {
            return null;
        }

        // Create histogram bins
        const finalNetWorths = monteCarloData.all_runs.map(r => r.final_nw);
        const min = Math.min(...finalNetWorths);
        const max = Math.max(...finalNetWorths);
        const numBins = 20;
        const binSize = (max - min) / numBins;

        const bins: number[] = Array(numBins).fill(0);
        const binLabels: string[] = [];

        for (let i = 0; i < numBins; i++) {
            const binStart = min + i * binSize;
            const binEnd = binStart + binSize;
            binLabels.push(`${fNumber(binStart)}`);
            
            // Count how many runs fall in this bin
            bins[i] = finalNetWorths.filter(nw => nw >= binStart && nw < binEnd).length;
        }

        return {
            categories: binLabels,
            series: [{
                name: 'Number of Scenarios',
                data: bins,
            }],
        };
    }, [monteCarloData]);

    // Market returns chart for selected run (green/red bars)
    const marketReturnsChart = useMemo(() => {
        if (!selectedRun?.data || selectedRun.data.length === 0) {
            return null;
        }

        // Extract market returns year by year from the selected run
        // Backend now stores Market_Return as percentage (e.g., 7.5 for 7.5%)
        const returns = selectedRun.data.map(yearData => {
            return yearData.Market_Return || 0;
        });

        const categories = selectedRun.data.map(d => `${Math.floor(d.P1_Age)}`);

        console.log('📊 Market Returns for selected run:', {
            percentile: luckPercentile,
            sample_returns: returns.slice(0, 10).map(r => r.toFixed(2) + '%'),
            min: Math.min(...returns).toFixed(2) + '%',
            max: Math.max(...returns).toFixed(2) + '%',
            avg: (returns.reduce((a, b) => a + b, 0) / returns.length).toFixed(2) + '%',
        });

        return {
            categories,
            series: [{
                name: 'Market Return',
                data: returns,
            }],
        };
    }, [selectedRun, luckPercentile]);

    // Luck description
    const getLuckDescription = (percentile: number) => {
        if (percentile >= 90) return { text: 'Very Lucky', color: 'success', emoji: '🍀' };
        if (percentile >= 75) return { text: 'Lucky', color: 'success', emoji: '😊' };
        if (percentile >= 60) return { text: 'Above Average', color: 'info', emoji: '👍' };
        if (percentile >= 40) return { text: 'Average', color: 'default', emoji: '😐' };
        if (percentile >= 25) return { text: 'Below Average', color: 'warning', emoji: '😕' };
        if (percentile >= 10) return { text: 'Unlucky', color: 'error', emoji: '😞' };
        return { text: 'Very Unlucky', color: 'error', emoji: '😰' };
    };

    const luckInfo = getLuckDescription(luckPercentile);

    return (
        <Box>
            {/* Monte Carlo Toggle and Controls - Compact */}
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ pb: 2 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Icon icon="solar:chart-2-bold-duotone" width={24} color={theme.palette.primary.main} />
                            <Typography variant="h6">
                                Monte Carlo Analysis
                            </Typography>
                            {monteCarloData && (
                                <Chip 
                                    label={`${monteCarloData.success_rate.toFixed(1)}% Success`}
                                    color={monteCarloData.success_rate >= 90 ? 'success' : monteCarloData.success_rate >= 70 ? 'warning' : 'error'}
                                    size="small"
                                />
                            )}
                        </Stack>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={enableMonteCarlo}
                                    onChange={(e) => setEnableMonteCarlo(e.target.checked)}
                                    disabled={isLoading}
                                />
                            }
                            label="Enable"
                        />
                    </Stack>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading && (
                <Card>
                    <CardContent>
                        <Stack alignItems="center" spacing={2} py={4}>
                            <CircularProgress size={60} />
                            <Typography variant="h6">Running 100 Monte Carlo Simulations...</Typography>
                            <Typography variant="body2" color="text.secondary">
                                This may take 10-20 seconds
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* Compact Luck Slider - Only show when Monte Carlo is enabled and loaded */}
            {enableMonteCarlo && monteCarloData && !isLoading && (
                <Card sx={{ mb: 3 }}>
                    <CardContent sx={{ py: 2 }}>
                        <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Luck Slider
                                </Typography>
                                <Chip 
                                    label={`${luckInfo.emoji} ${luckInfo.text}`}
                                    color={luckInfo.color as any}
                                    size="small"
                                />
                            </Stack>

                            <Box sx={{ px: 2 }}>
                                <Slider
                                    value={luckPercentile}
                                    onChange={(_, value) => setLuckPercentile(value as number)}
                                    min={0}
                                    max={100}
                                    step={5}
                                    marks={[
                                        { value: 0, label: '0%' },
                                        { value: 50, label: '50%' },
                                        { value: 100, label: '100%' },
                                    ]}
                                    valueLabelDisplay="on"
                                    valueLabelFormat={(value) => `${value}th`}
                                    sx={{
                                        '& .MuiSlider-markLabel': {
                                            fontSize: '0.75rem',
                                        },
                                    }}
                                />
                            </Box>

                            {selectedRun && (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                    <strong>{luckPercentile}th percentile:</strong> Final portfolio <strong>${fNumber(selectedRun.final_nw)}</strong>
                                </Typography>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* Side-by-side: Distribution Chart + Market Returns */}
            {enableMonteCarlo && distributionChart && marketReturnsChart && !isLoading && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {/* Outcome Distribution */}
                    <Card>
                        <CardHeader 
                            title="Outcome Distribution" 
                            subheader="100 simulations"
                            sx={{ pb: 1 }}
                        />
                        <Box sx={{ p: 2, pt: 0 }}>
                            <Chart
                                type="bar"
                                series={distributionChart.series}
                                options={{
                                    chart: {
                                        toolbar: { show: false },
                                    },
                                    colors: [theme.palette.primary.main],
                                    plotOptions: {
                                        bar: {
                                            borderRadius: 4,
                                            columnWidth: '85%',
                                        },
                                    },
                                    xaxis: {
                                        categories: distributionChart.categories,
                                        labels: {
                                            rotate: -45,
                                            style: {
                                                fontSize: '9px',
                                            },
                                        },
                                    },
                                    yaxis: {
                                        labels: {
                                            formatter: (value: number) => Math.round(value).toString(),
                                        },
                                    },
                                    tooltip: {
                                        y: {
                                            formatter: (value: number) => `${value} scenarios`,
                                        },
                                    },
                                    dataLabels: {
                                        enabled: false,
                                    },
                                    grid: {
                                        strokeDashArray: 3,
                                    },
                                }}
                                height={280}
                            />
                            
                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1, flexWrap: 'wrap' }}>
                                {monteCarloData && (
                                    <>
                                        <Chip 
                                            label={`${monteCarloData.success_rate.toFixed(1)}%`}
                                            color={monteCarloData.success_rate >= 90 ? 'success' : monteCarloData.success_rate >= 70 ? 'warning' : 'error'}
                                            size="small"
                                        />
                                        <Chip 
                                            label={`${monteCarloData.num_simulations} runs`}
                                            variant="outlined"
                                            size="small"
                                        />
                                        <Chip 
                                            label={`${(monteCarloData.volatility * 100).toFixed(0)}% vol`}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </>
                                )}
                            </Stack>
                        </Box>
                    </Card>

                    {/* Market Returns (Green/Red) */}
                    <Card>
                        <CardHeader 
                            title="Market Returns" 
                            subheader={`${luckPercentile}th percentile scenario`}
                            sx={{ pb: 1 }}
                        />
                        <Box sx={{ p: 2, pt: 0 }}>
                            <Chart
                                type="bar"
                                series={marketReturnsChart.series}
                                options={{
                                    chart: {
                                        toolbar: { show: false },
                                    },
                                    colors: [theme.palette.primary.main],
                                    plotOptions: {
                                        bar: {
                                            borderRadius: 2,
                                            columnWidth: '75%',
                                            colors: {
                                                ranges: [
                                                    {
                                                        from: -100,
                                                        to: 0,
                                                        color: theme.palette.error.main,
                                                    },
                                                    {
                                                        from: 0,
                                                        to: 100,
                                                        color: theme.palette.success.main,
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                    xaxis: {
                                        categories: marketReturnsChart.categories,
                                        title: {
                                            text: 'Age',
                                            style: {
                                                fontSize: '11px',
                                            },
                                        },
                                        labels: {
                                            rotate: -45,
                                            style: {
                                                fontSize: '9px',
                                            },
                                            // Show every 5th label
                                            formatter: (value, index) => {
                                                if (typeof index === 'number' && index % 5 === 0) {
                                                    return value;
                                                }
                                                return '';
                                            },
                                        },
                                    },
                                    yaxis: {
                                        title: {
                                            text: 'Return %',
                                            style: {
                                                fontSize: '11px',
                                            },
                                        },
                                        labels: {
                                            formatter: (value: number) => `${value.toFixed(0)}%`,
                                        },
                                    },
                                    tooltip: {
                                        y: {
                                            formatter: (value: number) => `${value.toFixed(2)}%`,
                                        },
                                    },
                                    dataLabels: {
                                        enabled: false,
                                    },
                                    grid: {
                                        strokeDashArray: 3,
                                    },
                                }}
                                height={280}
                            />
                            
                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                                <Chip 
                                    icon={<Icon icon="solar:arrow-up-bold" />}
                                    label="Positive"
                                    size="small"
                                    sx={{ bgcolor: theme.palette.success.lighter }}
                                />
                                <Chip 
                                    icon={<Icon icon="solar:arrow-down-bold" />}
                                    label="Negative"
                                    size="small"
                                    sx={{ bgcolor: theme.palette.error.lighter }}
                                />
                            </Stack>
                        </Box>
                    </Card>
                </Box>
            )}
        </Box>
    );
}
