import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useSimulation } from '@/context/SimulationContext';
import { WealthTrajectoryChart } from '@/components/charts/WealthTrajectoryChart';
import { WhatIfScenarios } from '@/components/simulation/WhatIfScenarios';
import { SavedScenariosList } from '@/components/simulation/SavedScenariosList';
import { ScenarioComparison } from '@/components/simulation/ScenarioComparison';
import { ResultsInsightsPanel } from '@/components/simulation/ResultsInsightsPanel';
import { LifeEventsTimeline } from '@/components/simulation/LifeEventsTimeline';

const MotionButton = motion.create(Button);

export function SimulationResultsCard() {
    const { result, baselineResult, clearBaseline, saveScenario, inputs, updateInputs, runSim } = useSimulation();
    const isComparing = !!baselineResult && !!result;

    const handleReset = () => {
        clearBaseline();
    };

    const handleSaveNewPlan = () => {
        const timestamp = new Date();
        const name = `Plan Adjustment ${timestamp.toLocaleDateString()} `;
        saveScenario(name);
        clearBaseline();
    };

    const handleQuickFix = (action: 'reduceSpending' | 'workLonger' | 'saveMore') => {
        if (action === 'reduceSpending') {
            updateInputs({ currentExpenses: Math.round(inputs.currentExpenses * 0.9) });
        } else if (action === 'workLonger') {
            updateInputs({ retirementAge: inputs.retirementAge + 2 });
        } else if (action === 'saveMore') {
            updateInputs({ contribDeferred: (inputs.contribDeferred || 0) + 500 });
        }
        setTimeout(() => runSim(), 0);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    Simulation Results
                </Typography>
                <Button variant="outlined" startIcon={<Icon icon="solar:export-bold" />}>
                    Export CSV
                </Button>
            </Box>

            {/* Comparison View (Full Width if active) */}
            {isComparing && (
                <Box sx={{ mb: 4 }}>
                    <ScenarioComparison
                        baseline={baselineResult}
                        current={result!}
                        inputs={inputs}
                        onReset={handleReset}
                        onSave={handleSaveNewPlan}
                        onUpdate={async (changes) => {
                            updateInputs(changes);
                            setTimeout(() => runSim(), 0);
                        }}
                    />
                </Box>
            )}

            {/* Main Grid Layout */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' }, gap: 3 }}>

                {/* Left Column: Chart */}
                <Box>
                    <Card sx={{ height: '100%', p: 3, minHeight: 400 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Wealth Trajectory
                        </Typography>
                        <WealthTrajectoryChart showBaseline={isComparing} />
                    </Card>
                </Box>

                {/* Right Column: Insights & Metrics */}
                <Box>
                    <ResultsInsightsPanel
                        result={result!}
                        targetAge={95}
                        onQuickFix={handleQuickFix}
                    />
                </Box>

                {/* Bottom Row: Life Bar (Full Width) */}
                <Box sx={{ gridColumn: { xs: '1 / -1', lg: '1 / -1' } }}>
                    <LifeEventsTimeline />
                </Box>

                {/* Bottom Row: Scenarios (Full Width) */}
                <Box sx={{ gridColumn: { xs: '1 / -1', lg: '1 / -1' } }}>
                    <Box sx={{ mt: 2, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
                        <WhatIfScenarios />
                        <SavedScenariosList />
                    </Box>
                </Box>

            </Box>
        </Box >
    );
}
