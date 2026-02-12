import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Paper,
    Stack,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { Icon } from '@iconify/react';
import { OnboardingStepCard } from '@/components/onboarding/OnboardingStepCard';
import { StrategyResults, RetirementYearResult } from '@/types/retirement-types';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface SimulationResultsProps {
    scenarios: {
        standard: StrategyResults;
        taxable_first: StrategyResults;
    };
    config?: Record<string, any>;
}


import { useTheme, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const DEFAULT_COLUMNS = ['Year', 'P1_Age', 'Bal_PreTax_P1', 'Bal_Roth_P1', 'Net_Worth'];

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
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

                    {/* Icon Bubble */}
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha((theme.palette[color] as any).lighter || theme.palette[color].light, 0.4),
                            color: theme.palette[color].dark,
                            mb: 1
                        }}
                    >
                        <Icon icon={icon} width={28} />
                    </Box>

                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                            {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
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


export const SimulationResults = ({ scenarios, config }: SimulationResultsProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const [equityTab, setEquityTab] = useState(0); // 0=Primary, 1=Rental, 2=Total, 3=Liability
    const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_COLUMNS);
    const theme = useTheme();

    const currentScenario = activeTab === 0 ? scenarios.standard : scenarios.taxable_first;
    const scenarioName = activeTab === 0 ? 'Standard Strategy' : 'Taxable-First Strategy';

    // Calculate Home Equity Projections (Frontend Logic)
    // We recreate the mortgage amortization and home appreciation here since backend doesn't export annual details yet.
    const equityProjections = useMemo(() => {
        if (!config) return null;

        const years = currentScenario.results.map(r => r.Year);
        const projectionLength = years.length;

        // Primary Home
        const primaryValueStart = Number(config.primary_home_value || 0);
        const primaryGrowth = Number(config.primary_home_growth_rate || 0.03);
        const primaryPrinc = Number(config.primary_home_mortgage_principal || 0);
        const primaryRate = Number(config.primary_home_mortgage_rate || 0) / 100;
        const primaryYears = Number(config.primary_home_mortgage_years || 0);

        // Calculate Monthly Payment for Primary
        let primaryMonthlyPmt = 0;
        if (primaryPrinc > 0 && primaryRate > 0 && primaryYears > 0) {
            const r = primaryRate / 12;
            const n = primaryYears * 12;
            primaryMonthlyPmt = primaryPrinc * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else if (primaryYears > 0) {
            primaryMonthlyPmt = primaryPrinc / (primaryYears * 12);
        }

        // Rental 1 (Extensible later)
        const rentalValueStart = Number(config.rental_1_value || 0);
        const rentalGrowth = Number(config.rental_1_growth_rate || 0.03);
        const rentalPrinc = Number(config.rental_1_mortgage_principal || 0);
        const rentalRate = Number(config.rental_1_mortgage_rate || 0) / 100;
        const rentalYears = Number(config.rental_1_mortgage_years || 0);

        let rentalMonthlyPmt = 0;
        if (rentalPrinc > 0 && rentalRate > 0 && rentalYears > 0) {
            const r = rentalRate / 12;
            const n = rentalYears * 12;
            rentalMonthlyPmt = rentalPrinc * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else if (rentalYears > 0) {
            rentalMonthlyPmt = rentalPrinc / (rentalYears * 12);
        }

        // Project loop
        const data = {
            years,
            primaryValue: [] as number[],
            primaryLiability: [] as number[],
            primaryEquity: [] as number[],
            rentalValue: [] as number[],
            rentalLiability: [] as number[],
            rentalEquity: [] as number[],
            totalEquity: [] as number[],
            totalLiability: [] as number[],
        };

        let currPrimaryVal = primaryValueStart;
        let currPrimaryBal = primaryPrinc;
        let pMonths = primaryYears * 12;

        let currRentalVal = rentalValueStart;
        let currRentalBal = rentalPrinc;
        let rMonths = rentalYears * 12;

        for (let i = 0; i < projectionLength; i++) {
            // End of Year values
            currPrimaryVal *= (1 + primaryGrowth);
            currRentalVal *= (1 + rentalGrowth);

            // Amortize 12 months (simplified)
            for (let m = 0; m < 12; m++) {
                if (currPrimaryBal > 0) {
                    const interest = currPrimaryBal * (primaryRate / 12);
                    const princ = primaryMonthlyPmt - interest;
                    currPrimaryBal -= princ;
                    if (currPrimaryBal < 0) currPrimaryBal = 0;
                }
                if (currRentalBal > 0) {
                    const interest = currRentalBal * (rentalRate / 12);
                    const princ = rentalMonthlyPmt - interest;
                    currRentalBal -= princ;
                    if (currRentalBal < 0) currRentalBal = 0;
                }
            }

            data.primaryValue.push(currPrimaryVal);
            data.primaryLiability.push(currPrimaryBal);
            data.primaryEquity.push(currPrimaryVal - currPrimaryBal);

            data.rentalValue.push(currRentalVal);
            data.rentalLiability.push(currRentalBal);
            data.rentalEquity.push(currRentalVal - currRentalBal);

            data.totalEquity.push((currPrimaryVal - currPrimaryBal) + (currRentalVal - currRentalBal));
            data.totalLiability.push(currPrimaryBal + currRentalBal);
        }

        return data;

    }, [config, currentScenario]);

    // Calculate summary statistics
    const calculateSummary = (data: RetirementYearResult[]) => {
        const lastYear = data[data.length - 1];
        const totalTaxes = data.reduce((sum, year) => sum + (year.Tax_Bill || 0), 0);

        // Use projected equity if available, otherwise 0
        const finalIdx = data.length - 1;
        const pEquity = equityProjections ? equityProjections.primaryEquity[finalIdx] : 0;
        const rEquity = equityProjections ? equityProjections.rentalEquity[finalIdx] : 0;
        const tEquity = equityProjections ? equityProjections.totalEquity[finalIdx] : 0;

        return {
            finalNetWorth: lastYear?.Net_Worth || 0,
            totalPreTax: (lastYear?.Bal_PreTax_P1 || 0) + (lastYear?.Bal_PreTax_P2 || 0),
            totalRoth: (lastYear?.Bal_Roth_P1 || 0) + (lastYear?.Bal_Roth_P2 || 0),
            totalTaxable: lastYear?.Bal_Taxable || 0,
            totalTaxPaid: totalTaxes,
            finalTaxRate: lastYear?.Tax_Bill && lastYear?.Ord_Income
                ? (lastYear.Tax_Bill / lastYear.Ord_Income) * 100
                : 0,
            primaryEquity: pEquity,
            rentalEquity: rEquity,
            totalHomeEquity: tEquity,
        };
    };

    const summary = calculateSummary(currentScenario.results);

    // TEMP DEBUG: Log first and last year to see field names
    if (currentScenario.results.length > 0) {
        console.log("DEBUG: First year data:", currentScenario.results[0]);
        console.log("DEBUG: Last year data:", currentScenario.results[currentScenario.results.length - 1]);
        console.log("DEBUG: Summary calculated:", summary);
    }

    // All available columns from the data
    const allColumns = currentScenario.columns || Object.keys(currentScenario.results[0] || {});

    const handleColumnToggle = (column: string) => {
        setVisibleColumns(prev => {
            if (prev.includes(column)) {
                return prev.filter(c => c !== column);
            } else {
                return [...prev, column];
            }
        });
    };

    const handleDownload = () => {
        const csv = convertToCSV(currentScenario.results, visibleColumns);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${scenarioName.replace(' ', '_')}_results.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const convertToCSV = (data: any[], columns: string[]): string => {
        const headers = columns.join(',');
        const rows = data.map(row =>
            columns.map(col => row[col] ?? '').join(',')
        );
        return [headers, ...rows].join('\n');
    };

    // Prepare chart data
    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: { show: true },
            zoom: { enabled: true },
        },
        stroke: {
            width: visibleColumns.filter(c => c !== 'Year').length > 5 ? 2 : 3,
            curve: 'smooth',
        },
        xaxis: {
            categories: currentScenario.results.map(r => r.Year),
            title: { text: 'Year' },
        },
        yaxis: {
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
            horizontalAlign: 'left',
        },
    };

    const chartSeries = visibleColumns
        .filter(col => col !== 'Year' && col !== 'P1_Age' && col !== 'P2_Age')
        .map(col => ({
            name: col.replace(/_/g, ' '),
            data: currentScenario.results.map(r => (r as any)[col] || 0),
        }));

    // Equity Chart Options
    const equityChartOptions: ApexOptions = {
        chart: {
            type: 'area', // Area looks good for equity
            toolbar: { show: false },
        },
        colors: ['#00A76F', '#FFAB00'], // Green for Equity
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            categories: equityProjections?.years || [],
        },
        yaxis: {
            labels: {
                formatter: (val) => `$${(val / 1000).toFixed(0)}K`,
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `$${val.toLocaleString()}`,
            },
        }
    };

    // Determine series based on Equity Tab
    let equitySeries = [];
    if (equityProjections) {
        if (equityTab === 0) { // Primary
            equitySeries = [{ name: 'Primary Home Equity', data: equityProjections.primaryEquity }];
        } else if (equityTab === 1) { // Rental
            equitySeries = [{ name: 'Rental Equity', data: equityProjections.rentalEquity }];
        } else if (equityTab === 2) { // Total
            equitySeries = [{ name: 'Total Real Estate Equity', data: equityProjections.totalEquity }];
        } else { // Liability
            equitySeries = [{ name: 'Total Mortgage Liability', data: equityProjections.totalLiability, color: '#FF5630' }];
        }
    }


    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Simulation Results
            </Typography>

            {/* Strategy Tabs */}
            <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} sx={{ mb: 3 }}>
                <Tab label="Standard Strategy" />
                <Tab label="Taxable-First Strategy" />
            </Tabs>

            {/* Dashboard Summary Cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                    mb: 4,
                }}
            >
                <ResultCard
                    title="Final Net Worth"
                    value={`$${summary.finalNetWorth.toLocaleString()}`}
                    icon="solar:wallet-money-bold-duotone"
                    color="success"
                    delay={0.1}
                />
                <ResultCard
                    title="Total Pre-Tax Accounts"
                    value={`$${summary.totalPreTax.toLocaleString()}`}
                    icon="solar:chart-2-bold-duotone"
                    color="info"
                    delay={0.2}
                />
                <ResultCard
                    title="Total Roth Accounts"
                    value={`$${summary.totalRoth.toLocaleString()}`}
                    icon="solar:shield-check-bold-duotone"
                    color="secondary"
                    delay={0.3}
                />
                <ResultCard
                    title="Total Taxable Accounts"
                    value={`$${summary.totalTaxable.toLocaleString()}`}
                    icon="solar:card-bold-duotone"
                    color="info"
                    delay={0.4}
                />
                <ResultCard
                    title="Final Year Tax Rate"
                    value={`${summary.finalTaxRate.toFixed(2)}%`}
                    icon="solar:pie-chart-2-bold-duotone"
                    color="warning"
                    delay={0.5}
                />
                <ResultCard
                    title="Total Tax Paid (All Years)"
                    value={`$${summary.totalTaxPaid.toLocaleString()}`}
                    icon="solar:bill-check-bold-duotone"
                    color="error"
                    delay={0.6}
                />
                {summary.totalHomeEquity > 0 && (
                    <>
                        <ResultCard
                            title="Final Home Equity (Primary)"
                            value={`$${summary.primaryEquity.toLocaleString()}`}
                            icon="solar:home-smile-bold-duotone"
                            color="success"
                            delay={0.7}
                        />
                        <ResultCard
                            title="Total Real Estate Equity"
                            value={`$${summary.totalHomeEquity.toLocaleString()}`}
                            icon="solar:city-bold-duotone"
                            color="success"
                            delay={0.8}
                        />
                    </>
                )}
            </Box>

            {/* Home Equity Visualization Section (New) */}
            {equityProjections && (
                <OnboardingStepCard
                    icon={<Icon icon="solar:home-add-bold-duotone" width={32} color="white" />}
                    title="Home Equity Visualization"
                    description="Track your property value and mortgage payoff over time"
                >
                    <Box sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <Icon icon="solar:chart-bold-duotone" width={24} />
                            <Typography variant="h6">Display:</Typography>
                        </Stack>
                        <Tabs
                            value={equityTab}
                            onChange={(_, val) => setEquityTab(val)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ mb: 2 }}
                        >
                            <Tab label="Primary Home Equity" />
                            <Tab label="Rental Equity" />
                            <Tab label="Total Home Equity" />
                            <Tab label="Mortgage Liability" />
                        </Tabs>

                        <Paper sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
                            <Typography variant="subtitle2" align="center" gutterBottom>
                                {equityTab === 0 && "Primary Home Equity Over Time"}
                                {equityTab === 1 && "Rental Property Equity Over Time"}
                                {equityTab === 2 && "Total Real Estate Net Equity"}
                                {equityTab === 3 && "Outstanding Mortgage Balances"}
                            </Typography>
                            <ReactApexChart
                                options={equityChartOptions}
                                series={equitySeries}
                                type="area"
                                height={350}
                            />
                        </Paper>
                    </Box>
                </OnboardingStepCard>
            )}

            {/* Custom Analysis & Data Selector */}
            <OnboardingStepCard
                icon={<Icon icon="solar:chart-square-bold-duotone" width={32} color="white" />}
                title="Custom Analysis & Data Selector"
                description="Select columns below to visualize them over time and show them in the table."
            >

                <FormGroup row>
                    {allColumns.map(column => (
                        <FormControlLabel
                            key={column}
                            control={
                                <Checkbox
                                    checked={visibleColumns.includes(column)}
                                    onChange={() => handleColumnToggle(column)}
                                    size="small"
                                />
                            }
                            label={<Typography variant="body2">{column.replace(/_/g, ' ')}</Typography>}
                            sx={{ minWidth: 200 }}
                        />
                    ))}
                </FormGroup>
            </OnboardingStepCard>

            {/* Chart */}
            {chartSeries.length > 0 && (
                <OnboardingStepCard
                    icon={<Icon icon="solar:graph-new-up-bold-duotone" width={32} color="white" />}
                    title="Projection Chart"
                    description="Visualizing selected metrics over time"
                >
                    <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="line"
                        height={400}
                    />
                </OnboardingStepCard>
            )}

            {/* Data Table */}
            <Paper sx={{ p: 3, mb: 3, overflow: 'auto' }}>
                <Box sx={{ minWidth: 650 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {visibleColumns.map(col => (
                                    <th key={col} style={{
                                        padding: '12px',
                                        textAlign: 'left',
                                        borderBottom: '2px solid #e0e0e0',
                                        fontWeight: 600,
                                    }}>
                                        {col.replace(/_/g, ' ')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentScenario.results.map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    {visibleColumns.map(col => {
                                        const value = (row as any)[col];
                                        const isNumber = typeof value === 'number';
                                        return (
                                            <td key={col} style={{
                                                padding: '12px',
                                                textAlign: isNumber ? 'right' : 'left',
                                            }}>
                                                {isNumber ? value.toLocaleString() : value}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Paper>

            {/* Download Button */}
            <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                sx={{
                    mb: 4,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #FFAB00 0%, #B76E00 100%)', // Warning/Orange gradient for download/action
                    boxShadow: '0 8px 16px 0 rgba(255, 171, 0, 0.24)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 20px 0 rgba(255, 171, 0, 0.32)',
                        background: 'linear-gradient(135deg, #FFAB00 0%, #B76E00 100%)',
                    }
                }}
            >
                Download {scenarioName} Results
            </Button>
        </Box>
    );
};
