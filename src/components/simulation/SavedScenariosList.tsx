import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useSimulation } from '@/context/SimulationContext';

const MotionButton = motion.create(Button);

export function SavedScenariosList() {
    const { savedScenarios, saveScenario, deleteScenario, result, updateInputs, runSim, setBaseline, clearBaseline } = useSimulation();

    const handleSnapshot = () => {
        if (!result) return;
        const timestamp = new Date();
        const name = `Scenario ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        saveScenario(name);
    };

    const handleDelete = (scenarioName: string) => {
        deleteScenario(scenarioName);
    };

    const handleLoad = async (scenario: any) => {
        updateInputs(scenario.inputs);
        await runSim(); // This will update 'result'
        clearBaseline(); // Clear any comparison
    };

    const handleCompare = (scenario: any) => {
        // Set current result as baseline
        if (result) {
            setBaseline();
        }

        // Then load the saved one
        updateInputs(scenario.inputs);
        runSim();
    };

    const scenarioArray = Array.from(savedScenarios.entries());

    return (
        <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon icon="solar:bookmark-bold-duotone" width={24} />
                    <Typography variant="h6" fontWeight={600}>
                        Your Saved Scenarios
                    </Typography>
                    {scenarioArray.length > 0 && (
                        <Chip label={scenarioArray.length} size="small" color="primary" />
                    )}
                </Box>
            </Box>

            {/* Saved Scenarios List */}
            {scenarioArray.length > 0 ? (
                <Box sx={{ mb: 2, maxHeight: 200, overflowY: 'auto' }}>
                    {scenarioArray.map(([scenarioName, scenario]) => (
                        <Box
                            key={scenarioName}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                p: 1.5,
                                mb: 1,
                                borderRadius: 1,
                                bgcolor: 'action.hover',
                                '&:hover': {
                                    bgcolor: 'action.selected',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <Icon icon="solar:bookmark-bold" width={20} color="#8B5CF6" style={{ marginTop: 2 }} />
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        {scenario.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ bgcolor: 'background.paper', px: 0.5, borderRadius: 0.5, border: 1, borderColor: 'divider' }}>
                                            Retire: {scenario.inputs.retirementAge}
                                        </Typography>
                                        <Typography variant="caption" sx={{ bgcolor: 'background.paper', px: 0.5, borderRadius: 0.5, border: 1, borderColor: 'divider' }}>
                                            Spend: ${scenario.inputs.currentExpenses.toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                        {scenario.timestamp.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleLoad(scenario)}
                                    startIcon={<Icon icon="solar:upload-square-bold-duotone" />}
                                    sx={{
                                        color: 'text.secondary',
                                        borderColor: 'divider',
                                        '&:hover': { color: 'primary.main', borderColor: 'primary.main' }
                                    }}
                                >
                                    Load
                                </Button>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleCompare(scenario)}
                                    startIcon={<Icon icon="solar:git-fork-bold" />}
                                    sx={{
                                        color: 'text.secondary',
                                        borderColor: 'divider',
                                        '&:hover': { color: 'secondary.main', borderColor: 'secondary.main' }
                                    }}
                                >
                                    Compare
                                </Button>

                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(scenarioName)}
                                    sx={{ color: 'text.secondary' }}
                                    title="Delete Scenario"
                                >
                                    <Icon icon="solar:trash-bin-trash-bold" width={18} />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                    No saved scenarios yet. Save your current plan to compare later.
                </Typography>
            )}

            {/* Snapshot Button */}
            <MotionButton
                fullWidth
                variant="contained"
                startIcon={<Icon icon="solar:diskette-bold-duotone" />}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSnapshot}
                disabled={!result}
                sx={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #7C4DE8 0%, #5558E3 100%)',
                    },
                }}
            >
                Save Current Plan
            </MotionButton>
        </Card>
    );
}
