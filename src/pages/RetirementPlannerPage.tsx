import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '@/theme/mui-theme';
import { Icon } from '@iconify/react';
import { RetirementInputForm } from '@/components/retirement/RetirementInputForm';
import { OnboardingStepCard } from '@/components/onboarding/OnboardingStepCard';
import { SimulationResults } from '@/components/retirement/SimulationResults';
import { MonteCarloResults } from '@/components/retirement/MonteCarloResults';
import { retirementService } from '@/services/retirement.service';
import {
    SimulationResponse,
    MonteCarloResults as MonteCarloResultsType
} from '@/types/retirement-types';

export default function RetirementPlannerPage() {
    const [simulationResults, setSimulationResults] = useState<SimulationResponse | null>(null);
    const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResultsType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSimulationComplete = (results: SimulationResponse) => {
        setSimulationResults(results);
        setMonteCarloResults(null); // Clear Monte Carlo when running new simulation
        setError(null);
    };

    const handleMonteCarloComplete = (results: MonteCarloResultsType) => {
        setMonteCarloResults(results);
        // Also set the baseline scenarios
        if (results.baselines) {
            setSimulationResults({
                success: true,
                scenarios: results.baselines,
            });
        }
        setError(null);
    };

    const handleRunMonteCarlo = async () => {
        if (!simulationResults?.config) {
            setError('Please run a simulation first before running Monte Carlo analysis');
            return;
        }

        const volatility = parseFloat((document.getElementById('volatility-input') as HTMLInputElement)?.value || '0.18');
        const numSimulations = parseInt((document.getElementById('num-sims-input') as HTMLInputElement)?.value || '100');

        setIsLoading(true);
        setError(null);

        try {
            const results = await retirementService.runMonteCarlo({
                ...(simulationResults.config as any),
                volatility,
                num_simulations: numSimulations,
            });
            handleMonteCarloComplete(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Monte Carlo simulation failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: { xs: 3, md: 5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Icon icon="solar:money-bag-bold-duotone" width={48} color={muiTheme.palette.primary.main} />
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Advanced Retirement Planner
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 8 }}>
                        Comprehensive tax-optimized retirement withdrawal strategy simulator
                    </Typography>
                </Box>

                {/* Input Form */}
                <RetirementInputForm onSimulationComplete={handleSimulationComplete} />

                {/* Loading Spinner */}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Error Message */}
                {error && (
                    <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Results Section */}
                {simulationResults && simulationResults.scenarios && (
                    <Box id="results-section" sx={{ mt: 6 }}>
                        <SimulationResults
                            scenarios={simulationResults.scenarios}
                            config={simulationResults.config}
                        />

                        {/* Monte Carlo Section */}
                        <OnboardingStepCard
                            icon={<Icon icon="solar:dice-bold-duotone" width={32} color="white" />}
                            title="Monte Carlo Simulation"
                            description="Run probabilistic analysis with market volatility to see a range of possible outcomes"
                        >
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                <Box sx={{ minWidth: 200 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>Market Volatility (σ)</Typography>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="1"
                                        defaultValue="0.18"
                                        id="volatility-input"
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            width: '100%',
                                            fontSize: '16px',
                                        }}
                                    />
                                </Box>
                                <Box sx={{ minWidth: 200 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>Number of Simulations</Typography>
                                    <input
                                        type="number"
                                        min="10"
                                        max="1000"
                                        defaultValue="100"
                                        id="num-sims-input"
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            width: '100%',
                                            fontSize: '16px',
                                        }}
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleRunMonteCarlo}
                                    disabled={isLoading}
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        background: 'linear-gradient(135deg, #8E33FF 0%, #5119B7 100%)', // Secondary Purple Gradient
                                        boxShadow: '0 8px 16px 0 rgba(142, 51, 255, 0.24)',
                                        transition: 'all 0.3s ease',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '16px',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 20px 0 rgba(142, 51, 255, 0.32)',
                                            background: 'linear-gradient(135deg, #8E33FF 0%, #5119B7 100%)',
                                        }
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Run Monte Carlo (100 Runs) 🎲'}
                                </Button>
                            </Box>
                        </OnboardingStepCard>
                    </Box>
                )}

                {/* Monte Carlo Results */}
                {monteCarloResults && (
                    <MonteCarloResults results={monteCarloResults} />
                )}
            </Container>
        </ThemeProvider >
    );
}
