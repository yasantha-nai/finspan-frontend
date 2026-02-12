import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Icon } from '@iconify/react';
import { alpha } from '@mui/material/styles';
import { muiTheme } from '@/theme/mui-theme';
import { OnboardingProgressBar } from './OnboardingProgressBar';

interface OnboardingLayoutProps {
    children: ReactNode;
    currentStep: number;
    totalSteps: number;
}

export function OnboardingLayout({ children, currentStep, totalSteps }: OnboardingLayoutProps) {
    return (
        <ThemeProvider theme={muiTheme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
                {/* Progress Bar */}
                <OnboardingProgressBar currentStep={currentStep} totalSteps={totalSteps} />

                {/* AppBar */}
                <AppBar
                    position="sticky"
                    sx={{
                        bgcolor: 'transparent',
                        boxShadow: 'none',
                        color: 'text.primary',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            bgcolor: alpha('#FFFFFF', 0.8),
                            zIndex: -1,
                        },
                    }}
                >
                    <Toolbar sx={{ height: { xs: 64, md: 72 } }}>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                            <Box
                                sx={{
                                    width: { xs: 36, md: 40 },
                                    height: { xs: 36, md: 40 },
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #5BE49B 0%, #00A76F 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon icon="solar:shield-check-bold-duotone" width={24} color="white" />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                    FinSpan
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    Setup Wizard
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* Step Counter */}
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            Step {currentStep + 1} of {totalSteps}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Main Content */}
                <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 6 } }}>
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>{children}</Container>
                </Box>

                {/* Footer */}
                <Box
                    component="footer"
                    sx={{
                        borderTop: 1,
                        borderColor: 'divider',
                        py: 3,
                        mt: 'auto',
                    }}
                >
                    <Container maxWidth="lg">
                        <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                            This simulation is for educational purposes only. Consult a financial advisor for personalized advice.
                        </Typography>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
