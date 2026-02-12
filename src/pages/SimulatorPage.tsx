import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Fade } from '@mui/material';
import { SimulationProvider, useSimulation } from '@/context/SimulationContext';
import { useAuth } from '@/context/AuthContext';
import {
    Phase1Identity,
    Phase2Income,
    Phase3Contributions,
    Phase4FutureReality,
} from '@/components/simulation/phases';
import { ResultsDashboard } from '@/components/simulation/ResultsDashboard';
import {
    OnboardingLayout,
    OnboardingStepper,
    OnboardingNavigation,
} from '@/components/onboarding';

const PHASES = [Phase1Identity, Phase2Income, Phase3Contributions, Phase4FutureReality];
const STEP_LABELS = ['Personal Info', 'Employment & Income', 'Account Balances', 'Optional Details'];

function SimulatorContent() {
    const { currentPhase, setCurrentPhase, result, runSim, isSimulating } = useSimulation();
    const { completeOnboarding } = useAuth();
    const [completedPhases, setCompletedPhases] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    const handleNext = useCallback(() => {
        if (!completedPhases.includes(currentPhase)) {
            setCompletedPhases((prev) => [...prev, currentPhase]);
        }
        if (currentPhase < PHASES.length - 1) {
            setCurrentPhase(currentPhase + 1);
        }
    }, [currentPhase, completedPhases, setCurrentPhase]);

    const handleBack = useCallback(() => {
        if (currentPhase > 0) {
            setCurrentPhase(currentPhase - 1);
        }
    }, [currentPhase, setCurrentPhase]);

    const handleRunSimulation = useCallback(() => {
        if (!completedPhases.includes(currentPhase)) {
            setCompletedPhases((prev) => [...prev, currentPhase]);
        }
        runSim();
        setShowResults(true);
    }, [currentPhase, completedPhases, runSim]);

    const handleReset = useCallback(() => {
        setShowResults(false);
        setCurrentPhase(0);
    }, [setCurrentPhase]);

    const CurrentPhaseComponent = PHASES[currentPhase];
    const isLastPhase = currentPhase === PHASES.length - 1;

    if (showResults) {
        return (
            <OnboardingLayout currentStep={PHASES.length} totalSteps={PHASES.length}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="outlined" onClick={handleReset}>
                        ← New Simulation
                    </Button>
                    <Button variant="contained" onClick={async () => {
                        await completeOnboarding();
                        navigate('/dashboard');
                    }}>
                        Go to Dashboard →
                    </Button>
                </Box>
                <ResultsDashboard />
            </OnboardingLayout>
        );
    }

    return (
        <OnboardingLayout currentStep={currentPhase} totalSteps={PHASES.length}>
            {/* Stepper */}
            <OnboardingStepper
                steps={STEP_LABELS}
                activeStep={currentPhase}
                completedSteps={completedPhases}
            />

            {/* Current Step Content */}
            <Box sx={{ mt: 5 }}>
                <Fade in={true} key={currentPhase} timeout={400}>
                    <Box>
                        <CurrentPhaseComponent />
                    </Box>
                </Fade>
            </Box>

            {/* Navigation */}
            <OnboardingNavigation
                currentStep={currentPhase}
                totalSteps={PHASES.length}
                onBack={handleBack}
                onNext={handleNext}
                onRunSimulation={handleRunSimulation}
                isSimulating={isSimulating}
            />
        </OnboardingLayout>
    );
}

export default function SimulatorPage() {
    return (
        <SimulationProvider>
            <SimulatorContent />
        </SimulationProvider>
    );
}
