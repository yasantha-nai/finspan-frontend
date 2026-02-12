import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WealthChart } from '@/components/simulation/WealthChart';
import { LifeBar } from '@/components/simulation/LifeBar';
import { InsightCards } from '@/components/simulation/InsightCards';
import { EventPopup } from '@/components/simulation/EventPopup';
import { useLifePlanning } from '@/hooks/useLifePlanning';
import { LifeEvent } from '@/types/life-planning';
import { Sparkles, RotateCcw, Undo2 } from 'lucide-react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export function SimulatorLifeWeaver() {
    const {
        currentAge,
        setCurrentAge,
        events,
        wealthData,
        insights,
        addEvent,
        updateEvent,
        removeEvent,
        moveEvent,
        undo,
        reset,
        canUndo,
    } = useLifePlanning();

    const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(null);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 6 } }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 20,
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    fontSize: '0.875rem',
                                    mb: 2,
                                }}
                            >
                                <Sparkles style={{ width: 16, height: 16 }} />
                                Life Simulator
                            </Box>
                        </motion.div>

                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontFamily: 'serif',
                                fontWeight: 600,
                                mb: 1,
                                fontSize: { xs: '1.75rem', md: '2.5rem' },
                            }}
                        >
                            Move your life.
                            <br />
                            <Typography
                                component="span"
                                variant="inherit"
                                color="text.secondary"
                            >
                                See what changes.
                            </Typography>
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ maxWidth: 600, mx: 'auto', mb: 2, fontSize: { xs: '0.875rem', md: '1rem' } }}
                        >
                            This is just a simulation. Drag events, adjust timing, and watch how your future might unfold. Nothing breaks.
                        </Typography>

                        {/* Undo/Reset controls */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <AnimatePresence>
                                {canUndo && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={undo}
                                            startIcon={<Undo2 style={{ width: 16, height: 16 }} />}
                                        >
                                            Undo
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Button
                                variant="text"
                                size="small"
                                onClick={reset}
                                startIcon={<RotateCcw style={{ width: 16, height: 16 }} />}
                                sx={{ color: 'text.secondary' }}
                            >
                                Start Fresh
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </motion.div>

            {/* Main content */}
            <Container maxWidth="lg" sx={{ pb: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Wealth Chart */}
                    <Box>
                        <WealthChart
                            data={wealthData}
                            currentAge={currentAge}
                            onAgeChange={setCurrentAge}
                        />
                    </Box>

                    {/* Insight Cards */}
                    <Box>
                        <InsightCards insights={insights} currentAge={currentAge} />
                    </Box>

                    {/* Life Bar */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'serif', fontWeight: 500 }}>
                                Your Life Timeline
                            </Typography>
                            <Box
                                sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    bgcolor: 'action.hover',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 20,
                                }}
                            >
                                {events.length} {events.length === 1 ? 'event' : 'events'}
                            </Box>
                        </Box>
                        <LifeBar
                            events={events}
                            currentAge={currentAge}
                            onEventClick={setSelectedEvent}
                            onEventMove={moveEvent}
                            onAddEvent={addEvent}
                            onAgeChange={setCurrentAge}
                        />
                    </Box>

                    {/* Hint section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 3,
                                borderTop: 1,
                                borderColor: 'divider',
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                                💡 <strong>Try this:</strong> What if you retired 5 years earlier?
                                Drag the 🌴 Retirement event to see how your money changes.
                            </Typography>
                        </Box>
                    </motion.div>
                </Box>
            </Container>

            {/* Event Popup */}
            <AnimatePresence>
                {selectedEvent && (
                    <EventPopup
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                        onUpdate={updateEvent}
                        onDelete={(id) => {
                            removeEvent(id);
                            setSelectedEvent(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </Box>
    );
}
