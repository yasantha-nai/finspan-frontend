import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useSimulation } from '@/context/SimulationContext';
import type { SimulationInputs } from '@/types/simulation';

const MotionButton = motion.create(Button);

interface WhatIfScenario {
    id: string;
    icon: string;
    title: string;
    description: string;
    color: string;
    apply: (inputs: SimulationInputs) => Partial<SimulationInputs>;
}

const scenarios: WhatIfScenario[] = [
    {
        id: 'reduce-spending',
        icon: '💰',
        title: 'Reduce Spending 10%',
        description: 'Cut annual spending by 10%',
        color: '#00A76F',
        apply: (inputs) => ({
            currentExpenses: Math.round(inputs.currentExpenses * 0.9),
        }),
    },
    {
        id: 'increase-spending',
        icon: '💸',
        title: 'Increase Spending 10%',
        description: 'Simulate lifestyle inflation',
        color: '#FF5630',
        apply: (inputs) => ({
            currentExpenses: Math.round(inputs.currentExpenses * 1.1),
        }),
    },
    {
        id: 'work-longer',
        icon: '💼',
        title: 'Work 2 More Years',
        description: 'Delay retirement by 2 years',
        color: '#6366F1',
        apply: (inputs) => ({
            retirementAge: inputs.retirementAge + 2,
        }),
    },
    {
        id: 'retire-early',
        icon: '🏖️',
        title: 'Retire 2 Years Early',
        description: 'Stop working sooner',
        color: '#FFAB00',
        apply: (inputs) => ({
            retirementAge: Math.max(50, inputs.retirementAge - 2),
        }),
    },
    {
        id: 'save-more',
        icon: '📈',
        title: 'Save $500/mo More',
        description: 'Boost monthly savings',
        color: '#8B5CF6',
        apply: (inputs) => ({
            contribDeferred: inputs.contribDeferred + 6000,
        }),
    },
];

export function WhatIfScenarios() {
    const { inputs, updateInputs, runSim, isSimulating } = useSimulation();
    const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

    const handleScenarioClick = async (scenario: WhatIfScenario) => {
        setSelectedScenario(scenario.id);

        // Apply scenario changes
        const changes = scenario.apply(inputs);
        updateInputs(changes);

        // Run simulation with new inputs
        await runSim();

        // Reset selection after simulation
        setTimeout(() => setSelectedScenario(null), 2000);
    };

    return (
        <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Icon icon="solar:lightbulb-bold-duotone" width={24} />
                <Typography variant="h6" fontWeight={600}>
                    Try Common "What Ifs"
                </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                💡 Quick "What If" Scenarios - Click any button to see instant before/after comparison
            </Typography>

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                {scenarios.map((scenario) => (
                    <MotionButton
                        key={scenario.id}
                        variant={selectedScenario === scenario.id ? 'contained' : 'outlined'}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleScenarioClick(scenario)}
                        disabled={isSimulating}
                        sx={{
                            height: '100%',
                            minHeight: 100,
                            borderColor: 'divider',
                            borderWidth: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2,
                            bgcolor: selectedScenario === scenario.id ? scenario.color : 'transparent',
                            color: selectedScenario === scenario.id ? 'white' : 'text.primary',
                            '&:hover': {
                                borderColor: scenario.color,
                                bgcolor: selectedScenario === scenario.id ? scenario.color : `${scenario.color}08`,
                            },
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            {scenario.icon}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                            {scenario.title}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: selectedScenario === scenario.id ? 'white' : 'text.secondary',
                            }}
                        >
                            {scenario.description}
                        </Typography>
                        {isSimulating && selectedScenario === scenario.id && (
                            <Typography variant="caption" fontWeight={600} sx={{ mt: 1, color: 'white' }}>
                                Running...
                            </Typography>
                        )}
                    </MotionButton>
                ))}
            </Box>
        </Card>
    );
}
