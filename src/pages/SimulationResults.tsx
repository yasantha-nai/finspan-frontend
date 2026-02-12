import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { muiTheme } from '@/theme/mui-theme';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { navConfig } from '@/config/navigation';
import { SimulationResultsCard } from '@/components/simulation/SimulationResultsCard';
import { SimulationEmptyState } from '@/components/simulation/SimulationEmptyState';
import { ResultsDashboard } from '@/components/simulation/ResultsDashboard';
import { useSimulation } from '@/context/SimulationContext';

export default function SimulationResults() {
    const { result, runSim } = useSimulation();

    // Auto-run simulation (falls back to mock data) if no result exists
    useEffect(() => {
        if (!result) {
            runSim();
        }
    }, [result, runSim]);

    return (
        <ThemeProvider theme={muiTheme}>
            <DashboardLayout navItems={navConfig} title="Simulation">
                <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
                    {/* Show empty state if no simulation data, otherwise show results */}
                    {!result ? <SimulationEmptyState /> : <ResultsDashboard />}
                </Container>
            </DashboardLayout>
        </ThemeProvider>
    );
}
