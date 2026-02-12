import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Icon } from '@iconify/react';
import { muiTheme } from '@/theme/mui-theme';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { navConfig } from '@/config/navigation';
import { useSimulation } from '@/context/SimulationContext';
import { ResultsTable } from '@/components/simulation/ResultsTable';
import { formatCurrency } from '@/lib/simulation-engine';

export default function ReportsPage() {
    const { result, inputs } = useSimulation();
    const [downloading, setDownloading] = useState(false);

    const handleDownloadCSV = () => {
        if (!result?.years || result.years.length === 0) {
            alert('No simulation data available to download');
            return;
        }

        setDownloading(true);

        try {
            // Prepare CSV data
            const headers = [
                'Age',
                'Year',
                'Net Worth',
                'Pre-Tax Balance',
                'Roth Balance',
                'Taxable Balance',
                'Total Income',
                'Spending',
                'Taxes Paid',
                'Shortfall',
                'Draw Taxable',
                'Draw Deferred',
                'Draw Roth',
            ];

            const rows = result.years.map(year => {
                const gapMagnitude = Math.abs(Math.min(0, year.netSurplusGap));
                const withdrawals = year.drawTaxable + year.drawDeferred + year.drawRoth;
                const unfundedAmount = Math.max(0, gapMagnitude - withdrawals);

                return [
                    year.userAge,
                    year.year,
                    year.totalPortfolio,
                    year.deferredBalance,
                    year.rothBalance,
                    year.taxableBalance,
                    year.grossIncome,
                    year.totalSpend,
                    year.totalTax,
                    unfundedAmount,
                    year.drawTaxable,
                    year.drawDeferred,
                    year.drawRoth,
                ];
            });

            // Convert to CSV
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(',')),
            ].join('\n');

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `retirement-projection-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('✅ CSV downloaded successfully');
        } catch (error) {
            console.error('❌ CSV download failed:', error);
            alert('Failed to download CSV. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadJSON = () => {
        if (!result?.years || result.years.length === 0) {
            alert('No simulation data available to download');
            return;
        }

        try {
            const exportData = {
                metadata: {
                    generated_at: new Date().toISOString(),
                    app_version: '2.0',
                    simulation_type: 'deterministic',
                },
                inputs: {
                    currentAge: inputs.currentAge,
                    retirementAge: inputs.retirementAge,
                    lifeExpectancy: inputs.lifeExpectancy,
                    currentSalary: inputs.currentSalary,
                    currentExpenses: inputs.currentExpenses,
                    taxFilingStatus: inputs.taxFilingStatus,
                    totalSavings: (inputs.taxableSavings || 0) + (inputs.taxDeferredSavings || 0) + (inputs.taxFreeSavings || 0),
                },
                results: {
                    successProbability: result.successProbability,
                    totalLegacy: result.totalLegacy,
                    financialIndependenceAge: result.financialIndependenceAge,
                    yearsData: result.years,
                },
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `retirement-projection-${new Date().toISOString().split('T')[0]}.json`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('✅ JSON downloaded successfully');
        } catch (error) {
            console.error('❌ JSON download failed:', error);
            alert('Failed to download JSON. Please try again.');
        }
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <DashboardLayout navItems={navConfig} title="Reports">
                <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Reports & Data Export
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            View detailed year-by-year projections and download your retirement plan data.
                        </Typography>
                    </Box>

                    {/* No Data State */}
                    {!result && (
                        <Alert 
                            severity="info" 
                            icon={<Icon icon="solar:info-circle-bold-duotone" width={24} />}
                            sx={{ mb: 3 }}
                        >
                            No simulation data available. Please complete the onboarding or run a simulation first.
                        </Alert>
                    )}

                    {/* Download Options */}
                    {result && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            Download Options
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Export your retirement projection data for further analysis or record-keeping.
                                        </Typography>
                                    </Box>

                                    <Stack direction="row" spacing={2} flexWrap="wrap">
                                        <Button
                                            variant="contained"
                                            startIcon={<Icon icon="solar:download-bold" width={20} />}
                                            onClick={handleDownloadCSV}
                                            disabled={downloading}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {downloading ? 'Downloading...' : 'Download CSV'}
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            startIcon={<Icon icon="solar:file-download-bold" width={20} />}
                                            onClick={handleDownloadJSON}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Download JSON
                                        </Button>

                                        <Box sx={{ flexGrow: 1 }} />

                                        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                            {result.years.length} years of data available
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {/* Data Table */}
                    {result && (
                        <ResultsTable result={result} />
                    )}

                    {/* Summary Stats Card */}
                    {result && (
                        <Card sx={{ mt: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Summary Statistics
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mt: 2 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                            Starting Portfolio
                                        </Typography>
                                        <Typography variant="h6" fontWeight={600}>
                                            {formatCurrency(result.years[0]?.totalPortfolio || 0)}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                            Final Portfolio
                                        </Typography>
                                        <Typography variant="h6" fontWeight={600}>
                                            {formatCurrency(result.years[result.years.length - 1]?.totalPortfolio || 0)}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                            Total Years
                                        </Typography>
                                        <Typography variant="h6" fontWeight={600}>
                                            {result.years.length} years
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                            Plan Status
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            fontWeight={600}
                                            color={result.successProbability >= 80 ? 'success.main' : 'warning.main'}
                                        >
                                            {result.successProbability >= 80 ? '✓ On Track' : '⚠ Needs Review'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Container>
            </DashboardLayout>
        </ThemeProvider>
    );
}
