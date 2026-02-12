import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart from 'react-apexcharts';
import { Icon } from '@iconify/react';
import { useSimulation } from '@/context/SimulationContext';
import { fCurrency, fNumber } from '@/lib/format-number';
import { AnalyticsWidgetSummary } from '@/components/dashboard/AnalyticsWidgetSummary';
import { AnalyticsCurrentVisits } from '@/components/dashboard/AnalyticsCurrentVisits';
import { MonteCarloSection } from '@/components/dashboard/MonteCarloSection';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardAlertCard } from '@/components/dashboard/DashboardAlertCard';
import { navConfig } from '@/config/navigation';
import RetirementPlannerPage from './RetirementPlannerPage';

export default function Dashboard() {
    const { inputs, result } = useSimulation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showAlert, setShowAlert] = useState(false);
    const [currentTab, setCurrentTab] = useState<'overview' | 'simulator'>('overview');
    const navigate = useNavigate();

    // Monte Carlo state
    const [monteCarloData, setMonteCarloData] = useState<any>(null);
    const [selectedRun, setSelectedRun] = useState<any>(null);
    const [luckPercentile, setLuckPercentile] = useState(50);

    // Handle Monte Carlo state changes
    const handleMonteCarloChange = (mcData: any, run: any, percentile: number) => {
        setMonteCarloData(mcData);
        setSelectedRun(run);
        setLuckPercentile(percentile);
    };

    // Check if coming from simulation
    const fromSim = searchParams.get('fromSim') === 'true';

    // Use actual simulation results only (no mock data fallback)
    const displayResult = result;

    // Calculate depletion age from result
    const targetAge = 95;
    let depletionAge = targetAge; // Assume success by default
    if (displayResult?.years && displayResult.years.length > 0) {
        const depletionYear = displayResult.years.find(year => year.totalPortfolio <= 0);
        if (depletionYear) {
            depletionAge = depletionYear.userAge;
        } else {
            const lastYear = displayResult.years[displayResult.years.length - 1];
            depletionAge = lastYear?.userAge || targetAge;
        }
    }
    const needsAdjustment = depletionAge < targetAge;

    useEffect(() => {
        if (fromSim && result) {
            setShowAlert(true);
            // Remove query param from URL without page reload
            setSearchParams({}, { replace: true });
        }
    }, [fromSim, result, setSearchParams]);

    // Calculate dashboard metrics
    const dashboardData = useMemo(() => {
        const currentAge = inputs?.currentAge || 35;
        const retirementAge = inputs?.retirementAge || 65;
        const yearsToRetirement = Math.max(0, retirementAge - currentAge);

        const currentSavings =
            (inputs?.taxableSavings || 0) +
            (inputs?.taxDeferredSavings || 0) +
            (inputs?.taxFreeSavings || 0) +
            (inputs?.spouseTaxDeferredSavings || 0) +
            (inputs?.spouseTaxFreeSavings || 0);

        const annualContribution =
            (inputs?.contribTaxable || 0) +
            (inputs?.contribDeferred || 0) +
            (inputs?.contribRoth || 0);

        // Calculate projected value in 10 years from actual simulation data
        let projectedValue10Years = currentSavings * Math.pow(1 + (inputs?.preRetirementReturn || 7) / 100, 10);
        if (displayResult?.years && displayResult.years.length > 0) {
            // Find the year that is 10 years from now
            const currentYear = new Date().getFullYear();
            const targetYear = currentYear + 10;
            const year10Data = displayResult.years.find(y => y.year === targetYear);
            
            if (year10Data) {
                projectedValue10Years = year10Data.totalPortfolio;
            } else if (displayResult.years.length >= 10) {
                // If exact year not found, use 10th year in the simulation
                projectedValue10Years = displayResult.years[Math.min(9, displayResult.years.length - 1)].totalPortfolio;
            }
        }

        const percentChange = currentSavings > 0
            ? ((projectedValue10Years - currentSavings) / currentSavings) * 100
            : 100;

        return {
            currentSavings,
            annualContribution,
            projectedValue10Years,
            yearsToRetirement,
            percentChange,
        };
    }, [inputs, displayResult]);

    // Wealth trajectory chart - Real data only (SMOOTH - all years included)
    const savingsGrowthChart = useMemo(() => {
        if (displayResult?.years && displayResult.years.length > 0) {
            // Use ALL years for smooth curve (no sampling)
            return {
                categories: displayResult.years.map(r => `Age ${r.userAge}`),
                data: displayResult.years.map(r => r.totalPortfolio),
            };
        }

        // No data yet - show placeholder
        return {
            categories: ['No Data'],
            data: [0],
        };
    }, [displayResult]);

    // Portfolio allocation
    const portfolioAllocation = useMemo(() => {
        const items = [
            { label: 'Taxable', value: inputs?.taxableSavings || 0 },
            { label: 'Tax-Deferred', value: inputs?.taxDeferredSavings || 0 },
            { label: 'Tax-Free (Roth)', value: inputs?.taxFreeSavings || 0 },
        ].filter(item => item.value > 0);

        return items.length > 0 ? items : [
            { label: 'Taxable', value: 50000 },
            { label: 'Tax-Deferred', value: 150000 },
            { label: 'Roth', value: 30000 },
        ];
    }, [inputs]);

    return (
        <DashboardLayout navItems={navConfig} title="FinSpan Dashboard">
            <Container maxWidth="xl">
                {/* Tab Navigation */}
                <Tabs
                    value={currentTab}
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        mb: 3,
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            minHeight: 64,
                        }
                    }}
                >
                    <Tab
                        label="Overview"
                        value="overview"
                        icon={<Icon icon="solar:pie-chart-2-bold-duotone" width={24} />}
                        iconPosition="start"
                    />
                    <Tab
                        label="Advanced Simulator"
                        value="simulator"
                        icon={<Icon icon="solar:calculator-minimalistic-bold-duotone" width={24} />}
                        iconPosition="start"
                    />
                </Tabs>

                {/* Overview Tab Content - Existing Dashboard */}
                {currentTab === 'overview' && (
                    <>
                        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                            Hi, Welcome back 👋
                        </Typography>

                        {/* First Simulation Alert - Only shown when redirected from simulation */}
                        {showAlert && result && needsAdjustment && (
                            <DashboardAlertCard
                                severity="warning"
                                title="🎯 First Simulation Results"
                                message={`Your retirement plan covers until age ${depletionAge}. Let's optimize it to reach your target age of ${targetAge}.`}
                                runwayAge={depletionAge}
                                targetAge={targetAge}
                                onAdjustPlan={() => navigate('/simulation-results')}
                                onViewOptions={() => {
                                    // Scroll to charts section
                                    document.getElementById('wealth-chart')?.scrollIntoView({ behavior: 'smooth' });
                                    setShowAlert(false);
                                }}
                                onDismiss={() => setShowAlert(false)}
                            />
                        )}

                        {showAlert && result && !needsAdjustment && (
                            <DashboardAlertCard
                                severity="success"
                                title="✅ Great News!"
                                message="Your retirement plan is on track! Your savings should last through your target age."
                                onDismiss={() => setShowAlert(false)}
                            />
                        )}

                        {/* Summary Widgets - 4 columns using CSS Grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
                            <AnalyticsWidgetSummary
                                title="Current Savings"
                                total={dashboardData.currentSavings}
                                percent={5.2}
                                color="primary"
                                icon={<Icon icon="solar:wallet-bold-duotone" width={48} />}
                                chart={{
                                    categories: savingsGrowthChart.categories.slice(0, 8),
                                    series: savingsGrowthChart.data.slice(0, 8).map(v => Math.max(1, v / 1000)),
                                }}
                            />

                            <AnalyticsWidgetSummary
                                title="Projected Value In 10 Years"
                                total={dashboardData.projectedValue10Years}
                                percent={dashboardData.percentChange}
                                color="secondary"
                                icon={<Icon icon="solar:graph-up-bold-duotone" width={48} />}
                                chart={{
                                    categories: savingsGrowthChart.categories.slice(0, 8),
                                    series: savingsGrowthChart.data.slice(0, 8).map(v => Math.max(1, v / 1000)),
                                }}
                            />

                            <AnalyticsWidgetSummary
                                title="Annual Contribution"
                                total={dashboardData.annualContribution}
                                percent={2.8}
                                color="warning"
                                icon={<Icon icon="solar:dollar-bold-duotone" width={48} />}
                                chart={{
                                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                                    series: Array(8).fill(Math.max(1, dashboardData.annualContribution / 12)),
                                }}
                            />

                            <AnalyticsWidgetSummary
                                title="Years to Retirement"
                                total={`${dashboardData.yearsToRetirement} years`}
                                percent={-0.5}
                                color="error"
                                icon={<Icon icon="solar:calendar-bold-duotone" width={48} />}
                                chart={{
                                    categories: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7', 'Y8'],
                                    series: Array.from({ length: 8 }, (_, i) => Math.max(0, dashboardData.yearsToRetirement - i)),
                                }}
                            />
                        </Box>

                        {/* Charts - Portfolio (33%) + Savings Growth (67%) with Monte Carlo overlay */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 2fr' }, gap: 3, mb: 3 }}>
                            <AnalyticsCurrentVisits
                                title="Portfolio Allocation"
                                chart={{ series: portfolioAllocation }}
                            />

                            <Card>
                                <CardHeader 
                                    title="Wealth Trajectory" 
                                    subheader={
                                        monteCarloData 
                                            ? 'With Monte Carlo overlay (100 scenarios)' 
                                            : displayResult ? 'Based on your simulation results' : 'Complete onboarding to see your projection'
                                    }
                                />
                                <Box sx={{ p: 3, pb: 1 }}>
                                    <Chart
                                        type="line"
                                        series={(() => {
                                            const series: any[] = [];
                                            
                                            // Add baseline (deterministic)
                                            series.push({
                                                name: 'Your Plan',
                                                data: savingsGrowthChart.data,
                                                type: 'line',
                                                color: '#6366F1',
                                            });

                                            // Add Monte Carlo bands if enabled
                                            if (monteCarloData?.stats && monteCarloData.stats.length > 0) {
                                                const stats = monteCarloData.stats;
                                                
                                                // 90th Percentile - thin dotted line
                                                series.push({
                                                    name: '90th Percentile',
                                                    data: stats.map((s: any) => s.Net_Worth_P90),
                                                    type: 'line',
                                                    color: '#10b981',
                                                });

                                                // Median - thin dotted line
                                                series.push({
                                                    name: 'Median',
                                                    data: stats.map((s: any) => s.Net_Worth_median),
                                                    type: 'line',
                                                    color: '#8b5cf6',
                                                });

                                                // 10th Percentile - thin dotted line
                                                series.push({
                                                    name: '10th Percentile',
                                                    data: stats.map((s: any) => s.Net_Worth_P10),
                                                    type: 'line',
                                                    color: '#ef4444',
                                                });

                                                // Add selected run - solid line
                                                if (selectedRun?.data) {
                                                    series.push({
                                                        name: `${luckPercentile}th Percentile`,
                                                        data: selectedRun.data.map((d: any) => d.Net_Worth),
                                                        type: 'line',
                                                        color: '#f59e0b',
                                                    });
                                                }
                                            }

                                            return series;
                                        })()}
                                        options={{
                                            chart: {
                                                toolbar: { show: false },
                                                zoom: { 
                                                    enabled: false  // Disable scroll zoom
                                                },
                                            },
                                            stroke: {
                                                curve: 'smooth',
                                                width: monteCarloData?.stats ? [3, 1, 1, 1, 2] : [3],
                                                dashArray: monteCarloData?.stats ? [0, 4, 4, 4, 0] : [0],
                                            },
                                            xaxis: {
                                                categories: savingsGrowthChart.categories,
                                                labels: {
                                                    rotate: -45,
                                                    rotateAlways: false,
                                                    hideOverlappingLabels: true,
                                                    trim: true,
                                                    style: {
                                                        fontSize: '11px',
                                                    },
                                                },
                                                tickAmount: Math.min(10, Math.floor(savingsGrowthChart.categories.length / 5)),
                                            },
                                            yaxis: {
                                                labels: {
                                                    formatter: (value: number) => fNumber(value),
                                                },
                                            },
                                            tooltip: {
                                                y: {
                                                    formatter: (value: number) => `$${fNumber(value)}`,
                                                },
                                            },
                                            legend: {
                                                position: 'top',
                                                horizontalAlign: 'right',
                                            },
                                            grid: {
                                                strokeDashArray: 3,
                                            },
                                        }}
                                        height={364}
                                    />
                                </Box>
                            </Card>
                        </Box>

                        {/* Monte Carlo Analysis Section - Compact version */}
                        <MonteCarloSection 
                            baselineData={savingsGrowthChart}
                            onMonteCarloChange={handleMonteCarloChange}
                        />
                    </>
                )}

                {/* Advanced Simulator Tab Content - Embedded Retirement Planner */}
                {currentTab === 'simulator' && (
                    <Box sx={{ mt: -3, mx: -3 }}>
                        <RetirementPlannerPage />
                    </Box>
                )}
            </Container>
        </DashboardLayout>
    );
}
