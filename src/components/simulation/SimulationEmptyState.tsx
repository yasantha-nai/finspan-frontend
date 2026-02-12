import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionCard = motion.create(Card);

export function SimulationEmptyState() {
    const navigate = useNavigate();

    return (
        <Box sx={{ py: 8, textAlign: 'center' }}>
            <MotionCard
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    boxShadow: 3,
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 3,
                    }}
                >
                    <Icon icon="solar:calculator-bold-duotone" width={50} color="white" />
                </Box>

                {/* Title */}
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    No Simulation Yet
                </Typography>

                {/* Description */}
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Run your first retirement simulation to see your personalized plan analysis,
                    wealth trajectory, and actionable recommendations.
                </Typography>

                {/* CTA Button */}
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Icon icon="solar:play-bold-duotone" />}
                    onClick={() => navigate('/simulator')}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5558E3 0%, #7C4DE8 100%)',
                        },
                    }}
                >
                    Start Your Simulation
                </Button>

                {/* Info Pills */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
                    {['5 min setup', 'Detailed analysis', 'Actionable tips'].map((text) => (
                        <Box
                            key={text}
                            sx={{
                                px: 2,
                                py: 0.75,
                                borderRadius: 20,
                                bgcolor: 'action.hover',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                            }}
                        >
                            <Icon icon="solar:check-circle-bold" width={16} color="#6366F1" />
                            <Typography variant="caption" fontWeight={600}>
                                {text}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </MotionCard>
        </Box>
    );
}
