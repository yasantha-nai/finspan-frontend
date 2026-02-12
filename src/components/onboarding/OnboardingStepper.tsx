import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import CheckCircle from '@mui/icons-material/CheckCircle';
import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import { Icon } from '@iconify/react';

interface OnboardingStepperProps {
    steps: string[];
    activeStep: number;
    completedSteps: number[];
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            background: 'linear-gradient(90deg, #5BE49B 0%, #00A76F 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.divider,
        borderRadius: 1,
    },
}));

const StepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
    color: theme.palette.divider,
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: theme.palette.primary.main,
    }),
    '& .StepIcon-completedIcon': {
        color: theme.palette.success.main,
        zIndex: 1,
        fontSize: 32,
    },
    '& .StepIcon-circle': {
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));

function CustomStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
        <StepIconRoot ownerState={{ completed, active }} className={className}>
            {completed ? (
                <CheckCircle className="StepIcon-completedIcon" />
            ) : active ? (
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.7 },
                        },
                    }}
                >
                    <Icon icon="solar:play-circle-bold" width={20} color="white" />
                </Box>
            ) : (
                <RadioButtonUnchecked sx={{ fontSize: 24 }} />
            )}
        </StepIconRoot>
    );
}

export function OnboardingStepper({ steps, activeStep, completedSteps }: OnboardingStepperProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            <Stepper
                orientation={isMobile ? 'vertical' : 'horizontal'}
                alternativeLabel={!isMobile}
                activeStep={activeStep}
                connector={<ColorlibConnector />}
                sx={{
                    '& .MuiStepLabel-label': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        fontWeight: 500,
                    },
                }}
            >
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    if (completedSteps.includes(index)) {
                        stepProps.completed = true;
                    }

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel StepIconComponent={CustomStepIcon}>
                                {label}
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}
