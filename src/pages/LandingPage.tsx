import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks from '@/components/landing/HowItWorks';
import LandingSolution from '@/components/landing/LandingSolution';
import LandingFeatures from '@/components/landing/LandingFeatures';
import SocialProof from '@/components/landing/SocialProof';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import LandingFooter from '@/components/landing/LandingFooter';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '@/theme/mui-theme';

const LandingPage = () => {
    return (
        <ThemeProvider theme={muiTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <LandingHeader />
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <LandingHero />
                    <ProblemSection />
                    <HowItWorks />
                    <LandingSolution />
                    <LandingFeatures />
                    <SocialProof />
                    <FAQSection />
                    <FinalCTA />
                </Box>
                <LandingFooter />
            </Box>
        </ThemeProvider>
    );
};

export default LandingPage;
