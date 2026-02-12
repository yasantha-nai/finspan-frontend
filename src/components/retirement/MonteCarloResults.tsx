import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography, // Removed Paper
    Stack,
    Select,
    MenuItem,
    Button, // Kept just in case though currently unused in this file
    FormControl,
    InputLabel,
    Chip,
    Alert,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { OnboardingStepCard } from '@/components/onboarding/OnboardingStepCard';
import { MonteCarloResults as MonteCarloResultsType } from '@/types/retirement-types';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ResultCardProps {
    title: string;
    value: string;
    icon: string;
    color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
    delay?: number;
}

function ResultCard({ title, value, icon, color = 'primary', delay = 0 }: ResultCardProps) {
    const theme = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card
                sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'visible',
                    borderRadius: 2,
                    boxShadow: theme.shadows[2], // Slightly lifted
                    border: '1px solid',
                    borderColor: alpha(theme.palette[color].main, 0.12),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                        borderColor: alpha(theme.palette[color].main, 0.24),
                    },
                }}
            >
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', textAlign: 'center' }}>

                    {/* Icon Bubble */}
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette[color].lighter || theme.palette[color].light, 0.4),
                            color: theme.palette[color].dark,
                            mb: 1
                        }}
                    >
                        <Icon icon={icon} width={36} />
                    </Box>

                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: theme.palette[color].main }}>
                            {value}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {title}
                        </Typography>
                    </Box>

                    {/* Decorative Background Blob */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0)} 100%)`,
                            zIndex: 0,
                        }}
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}

interface MonteCarloResultsProps {
    results: MonteCarloResultsType;
}

export const MonteCarloResults = ({ results }: MonteCarloResultsProps) => {
    const [selectedRunId, setSelectedRunId] = useState<number | null>(null);

    const successRate = results.success_rate;
    const successColor = successRate >= 90 ? 'success' : successRate >= 75 ? 'warning' : 'error';

    // Sort runs by final net worth
    const sortedRuns = [...results.all_runs].sort((a, b) => a.final_nw - b.final_nw);
    const worstRun = sortedRuns[0];
    const medianRun = sortedRuns[Math.floor(sortedRuns.length / 2)];
    const bestRun = sortedRuns[sortedRuns.length - 1];

    // Net Worth Trajectory Chart
    const netWorthChartOptions: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: { show: true },
            animations: { enabled: true },
        },
        stroke: {
            width: [3, 3, 3, 4],
            curve: 'smooth',
        },
        colors: ['#f43f5e', '#6366f1', '#10b981', '#f59e0b'],
        xaxis: {
            categories: results.stats.map(s => s.Year),
            title: { text: 'Year' },
        },
        yaxis: {
            title: { text: 'Net Worth' },
            labels: {
                formatter: (val) => `$${(val / 1000).toFixed(0)}K`,
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `$${val.toLocaleString()}`,
            },
        },
        legend: {
            position: 'top',
        },
    };

    const netWorthSeries = [
        {
            name: '10th Percentile (Unlucky)',
            data: results.stats.map(s => s.Net_Worth_P10),
        },
        {
            name: 'Median (Expected)',
            data: results.stats.map(s => s.Net_Worth_median),
        },
        {
            name: '90th Percentile (Lucky)',
            data: results.stats.map(s => s.Net_Worth_P90),
        },
    ];

    // Add selected run overlay if one is selected
    if (selectedRunId !== null) {
        const selectedRun = results.all_runs.find(r => r.run_id === selectedRunId);
        if (selectedRun) {
            netWorthSeries.push({
                name: 'Selected Run',
                data: selectedRun.data.map(d => d.Net_Worth),
            });
        }
    }

    // Account Balances Chart (Median)
    const balancesChartOptions: ApexOptions = {
        chart: {
            type: 'area',
            stacked: true,
            toolbar: { show: true },
        },
        colors: ['#f59e0b', '#3b82f6', '#a855f7'],
        xaxis: {
            categories: results.stats.map(s => s.Year),
            title: { text: 'Year' },
        },
        yaxis: {
            title: { text: 'Balance' },
            labels: {
                formatter: (val) => `$${(val / 1000).toFixed(0)}K`,
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `$${val.toLocaleString()}`,
            },
        },
        legend: {
            position: 'top',
        },
    };

    const balancesSeries = [
        {
            name: 'Taxable',
            data: results.stats.map(s => s.Bal_Taxable_median),
        },
        {
            name: 'Pre-Tax (Traditional)',
            data: results.stats.map(s => s.Bal_PreTax_Total_median),
        },
        {
            name: 'Roth',
            data: results.stats.map(s => s.Bal_Roth_Total_median),
        },
    ];

    // Annual Returns Chart (for selected run)
    const selectedRun = selectedRunId !== null
        ? results.all_runs.find(r => r.run_id === selectedRunId)
        : null;

    const returnsChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: true },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                distributed: true,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            },
        },
        dataLabels: {
            enabled: false, // Too crowded for 30+ years
        },
        colors: selectedRun?.data.map(d =>
            (d.Market_Return || 0) < 0 ? '#f43f5e' : '#10b981'
        ),
        xaxis: {
            categories: selectedRun?.data.map(d => d.Year) || [],
            title: { text: 'Year' },
        },
        yaxis: {
            title: { text: 'Return (%)' },
            labels: {
                formatter: (val) => `${val.toFixed(1)}%`,
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `${val.toFixed(2)}%`,
            },
        },
        legend: { show: false },
    };

    const returnsSeries = [{
        name: 'Annual Market Return',
        data: selectedRun?.data.map(d => (d.Market_Return || 0) * 100) || [],
    }];

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                🎲 Monte Carlo Analysis
            </Typography>

            {/* Dashboard Summary Cards */}
            <Box sx={{ mb: 4 }}>
                <ResultCard
                    title="Probability of Success"
                    value={`${successRate.toFixed(1)}%`}
                    icon={successRate >= 90 ? "solar:shield-check-bold-duotone" : successRate >= 75 ? "solar:shield-warning-bold-duotone" : "solar:shield-cross-bold-duotone"}
                    color={successColor as any}
                    delay={0.1}
                />
            </Box>

            {/* Net Worth Trajectory */}
            <OnboardingStepCard
                icon={<Icon icon="solar:graph-new-up-bold-duotone" width={32} color="white" />}
                title="Projected Net Worth Trajectory"
                description={`Visualizing ${results.num_simulations} scenarios with ${(results.volatility * 100).toFixed(1)}% volatility`}
            >
                <ReactApexChart
                    options={netWorthChartOptions}
                    series={netWorthSeries}
                    type="line"
                    height={400}
                />
            </OnboardingStepCard>

            {/* Account Balance Trajectories */}
            <OnboardingStepCard
                icon={<Icon icon="solar:chart-2-bold-duotone" width={32} color="white" />}
                title="Account Balance Trajectories (Median)"
                description="Breakdown of taxable, pre-tax, and Roth balances over time"
            >
                <ReactApexChart
                    options={balancesChartOptions}
                    series={balancesSeries}
                    type="area"
                    height={400}
                />
            </OnboardingStepCard>

            {/* Run Inspector */}
            <OnboardingStepCard
                icon={<Icon icon="solar:magnifer-zoom-in-bold-duotone" width={32} color="white" />}
                title="Run Inspector (Drill Down)"
                description="Select a specific random simulation run to view its full details"
            >

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" sx={{ mb: 4 }}>
                    <FormControl sx={{ width: '100%', maxWidth: 400 }}>
                        <InputLabel>Select Run</InputLabel>
                        <Select
                            value={selectedRunId ?? ''}
                            label="Select Run"
                            onChange={(e) => setSelectedRunId(e.target.value as number || null)}
                        >
                            <MenuItem value="">-- Select a run to view details --</MenuItem>

                            {/* Quick access options */}
                            <MenuItem value={worstRun.run_id}>
                                ⚠️ Worst Case (Final NW: ${Math.round(worstRun.final_nw).toLocaleString()})
                            </MenuItem>
                            <MenuItem value={medianRun.run_id}>
                                📊 Median Case (Final NW: ${Math.round(medianRun.final_nw).toLocaleString()})
                            </MenuItem>
                            <MenuItem value={bestRun.run_id}>
                                🚀 Best Case (Final NW: ${Math.round(bestRun.final_nw).toLocaleString()})
                            </MenuItem>

                            <MenuItem disabled>────────────────</MenuItem>

                            {/* All runs */}
                            {sortedRuns.map(run => (
                                <MenuItem key={run.run_id} value={run.run_id}>
                                    Run #{run.run_id + 1} (Final NW: ${Math.round(run.final_nw).toLocaleString()})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedRunId !== null && (
                        <Chip
                            label={`Viewing Run #${selectedRunId + 1}`}
                            color="primary"
                            onDelete={() => setSelectedRunId(null)}
                        />
                    )}
                </Stack>

                {/* Annual Returns Chart for Selected Run */}
                {selectedRun && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Annual Returns (Sequence Risk)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Red bars indicate negative return years.
                        </Typography>
                        <ReactApexChart
                            options={returnsChartOptions}
                            series={returnsSeries}
                            type="bar"
                            height={300}
                        />
                    </Box>
                )}
            </OnboardingStepCard>

            {selectedRun && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    The selected run is now overlaid on the Net Worth Trajectory chart above (orange line).
                </Alert>
            )}
        </Box>
    );
};
