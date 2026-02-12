import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

interface OnboardingNavigationProps {
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
    onRunSimulation?: () => void;
    isSimulating?: boolean;
}

// AnimatedButton component with Framer Motion
const MotionButton = motion.create(Button);

export function OnboardingNavigation({
    currentStep,
    totalSteps,
    onBack,
    onNext,
    onRunSimulation,
    isSimulating = false,
}: OnboardingNavigationProps) {
    const isLastStep = currentStep === totalSteps - 1;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                justifyContent: 'space-between',
                gap: 2,
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider',
            }}
        >
            <MotionButton
                variant="outlined"
                startIcon={<ArrowBack />}
                disabled={currentStep === 0}
                onClick={onBack}
                size="large"
                whileHover={currentStep !== 0 ? { scale: 1.02 } : {}}
                whileTap={currentStep !== 0 ? { scale: 0.98 } : {}}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                sx={{
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main',
                    },
                }}
            >
                Back
            </MotionButton>

            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
                {isLastStep ? (
                    <MotionButton
                        variant="contained"
                        color="success"
                        endIcon={isSimulating ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
                        onClick={onRunSimulation}
                        disabled={isSimulating}
                        size="large"
                        whileHover={!isSimulating ? { scale: 1.02 } : {}}
                        whileTap={!isSimulating ? { scale: 0.98 } : {}}
                        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                        sx={{
                            minWidth: { xs: '100%', sm: 180 },
                        }}
                    >
                        {isSimulating ? 'Running...' : 'Run Simulation'}
                    </MotionButton>
                ) : (
                    <MotionButton
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForward />}
                        onClick={onNext}
                        size="large"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    >
                        Continue
                    </MotionButton>
                )}
            </Box>
        </Box>
    );
}
