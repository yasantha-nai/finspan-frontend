import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { LifeBar } from '@/components/simulation/LifeBar';
import { EventPopup } from '@/components/simulation/EventPopup';
import { useLifePlanning } from '@/hooks/useLifePlanning';
import { LifeEvent } from '@/types/life-planning';

export function LifeEventsTimeline() {
    const {
        events,
        currentAge,
        updateEvent,
        addEvent,
        removeEvent,
        setCurrentAge,
    } = useLifePlanning();

    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const handleEventClick = (event: LifeEvent) => {
        setSelectedEventId(event.id);
    };

    const handleEventMove = (id: string, newAge: number) => {
        updateEvent(id, { startAge: newAge });
    };

    return (
        <>
            <Card sx={{ p: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={600}>
                        Life Events Timeline
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Drag events to see how they impact your plan
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <LifeBar
                    events={events}
                    currentAge={currentAge}
                    onEventClick={handleEventClick}
                    onEventMove={handleEventMove}
                    onAddEvent={addEvent}
                    onAgeChange={setCurrentAge}
                />
            </Card>

            <EventPopup
                event={selectedEventId ? events.find(e => e.id === selectedEventId) || null : null}
                onClose={() => setSelectedEventId(null)}
                onUpdate={updateEvent}
                onDelete={(id) => {
                    removeEvent(id);
                    setSelectedEventId(null);
                }}
            />
        </>
    );
}
