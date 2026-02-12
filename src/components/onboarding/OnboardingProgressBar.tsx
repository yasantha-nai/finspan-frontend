import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

interface OnboardingProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBarContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    height: 4,
    backgroundColor: theme.palette.grey[200],
}));

const ProgressBarFill = styled(motion.div)(() => ({
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #00A76F 100%)',
    transformOrigin: 'left',
}));

export function OnboardingProgressBar({ currentStep, totalSteps }: OnboardingProgressBarProps) {
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <ProgressBarContainer>
            <ProgressBarFill
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                }}
            />
        </ProgressBarContainer>
    );
}
