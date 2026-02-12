import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useSimulation } from '@/context/SimulationContext';

const MotionButton = motion.create(Button);

export function SimulationInputForm() {
    const { inputs, updateInput, runSim, isSimulating } = useSimulation();
    const [expanded, setExpanded] = useState(false);

    const handleRunSimulation = () => {
        runSim();
    };

    return (
        <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        <Icon icon="solar:settings-bold-duotone" width={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                        Adjust Your Plan
                    </Typography>
                    <IconButton onClick={() => setExpanded(!expanded)} size="small">
                        <Icon icon={expanded ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'} width={20} />
                    </IconButton>
                </Box>

                <Collapse in={expanded}>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, mb: 3 }}>
                        {/* Current Age */}
                        <TextField
                            label="Current Age"
                            type="number"
                            value={inputs.currentAge}
                            onChange={(e) => updateInput('currentAge', Number(e.target.value))}
                            size="small"
                            InputProps={{
                                endAdornment: <Typography variant="caption" color="text.secondary">years</Typography>,
                            }}
                        />

                        {/* Retirement Age */}
                        <TextField
                            label="Retirement Age"
                            type="number"
                            value={inputs.retirementAge}
                            onChange={(e) => updateInput('retirementAge', Number(e.target.value))}
                            size="small"
                            InputProps={{
                                endAdornment: <Typography variant="caption" color="text.secondary">years</Typography>,
                            }}
                        />

                        {/* Life Expectancy */}
                        <TextField
                            label="Life Expectancy"
                            type="number"
                            value={inputs.lifeExpectancy}
                            onChange={(e) => updateInput('lifeExpectancy', Number(e.target.value))}
                            size="small"
                            InputProps={{
                                endAdornment: <Typography variant="caption" color="text.secondary">years</Typography>,
                            }}
                        />

                        {/* Current Salary */}
                        <TextField
                            label="Annual Salary"
                            type="number"
                            value={inputs.currentSalary}
                            onChange={(e) => updateInput('currentSalary', Number(e.target.value))}
                            size="small"
                            InputProps={{
                                startAdornment: <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>$</Typography>,
                            }}
                        />

                        {/* Current Expenses */}
                        <TextField
                            label="Annual Expenses"
                            type="number"
                            value={inputs.currentExpenses}
                            onChange={(e) => updateInput('currentExpenses', Number(e.target.value))}
                            size="small"
                            InputProps={{
                                startAdornment: <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>$</Typography>,
                            }}
                        />

                        {/* Tax-Deferred Savings */}
                        <TextField
                            label="Current Savings (401k/IRA)"
                            type="number"
                            value={inputs.taxDeferredSavings}
                            onChange={(e) => updateInput('taxDeferredSavings', Number(e.target.value))}
                            size="small"
                            InputProps={{
                                startAdornment: <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>$</Typography>,
                            }}
                        />
                    </Box>
                </Collapse>

                {/* Run Simulation Button */}
                <MotionButton
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    whileHover={{ scale: expanded ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    startIcon={
                        isSimulating ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <Icon icon="solar:play-bold-duotone" width={20} />
                        )
                    }
                    sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5558E3 0%, #7C4DE8 100%)',
                        },
                        '&:disabled': {
                            background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
                        },
                    }}
                >
                    {isSimulating ? 'Running Simulation...' : expanded ? 'Run Simulation' : 'Quick Adjust & Run'}
                </MotionButton>
            </CardContent>
        </Card>
    );
}
