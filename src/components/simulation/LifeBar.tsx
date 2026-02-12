import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeEvent, LifeEventType, EVENT_CONFIGS, EVENT_CATEGORIES } from '@/types/life-planning';
import { Plus } from 'lucide-react';
import { getEventIcon } from './LifeEventIcons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface LifeBarProps {
  events: LifeEvent[];
  currentAge: number;
  onEventClick: (event: LifeEvent) => void;
  onEventMove: (id: string, newAge: number) => void;
  onAddEvent: (type: LifeEventType, age: number) => void;
  onAgeChange: (age: number) => void;
}

const AGE_MIN = 18;
const AGE_MAX = 95;
const ageToPercent = (age: number): number => ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100;
const percentToAge = (percent: number): number => Math.round(AGE_MIN + (percent / 100) * (AGE_MAX - AGE_MIN));

export function LifeBar({
  events,
  currentAge,
  onEventClick,
  onEventMove,
  onAddEvent,
  onAgeChange
}: LifeBarProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [addMenuAge, setAddMenuAge] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref to track when the menu was last closed to prevent immediate re-opening on the same click
  const lastMenuCloseTime = useRef<number>(0);

  // Group events by row to prevent overlap
  const eventRows: LifeEvent[][] = [];
  const sortedEvents = [...events].sort((a, b) => a.startAge - b.startAge);

  sortedEvents.forEach(event => {
    let placed = false;
    for (const row of eventRows) {
      const lastEvent = row[row.length - 1];
      const lastStart = lastEvent.startAge;
      const lastEndBase = lastEvent.endAge || lastStart;
      const lastDuration = lastEndBase - lastStart;
      const effectiveLastEnd = lastDuration < 3 ? lastStart + 5 : lastEndBase + 1;

      if (event.startAge >= effectiveLastEnd) {
        row.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      eventRows.push([event]);
    }
  });

  const handleDrag = (e: React.MouseEvent | React.TouchEvent, event: LifeEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(event.id);

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      let clientX = 0;
      if ('clientX' in moveEvent) clientX = moveEvent.clientX; // Mouse
      else if ('touches' in moveEvent) clientX = moveEvent.touches[0].clientX; // Touch

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;
      const newAge = percentToAge(Math.max(0, Math.min(100, percent)));

      onEventMove(event.id, newAge);
    };

    const handleEnd = () => {
      setDraggingId(null);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-event-item]')) return;
    if ((e.target as HTMLElement).closest('[data-age-slider]')) return;

    // PREVENT OPENING if we just closed the menu (within 300ms)
    // This handles the "Click outside to dismiss" case where the outside click triggers this handler
    if (Date.now() - lastMenuCloseTime.current < 300) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    const age = percentToAge(percent);
    setAddMenuAge(age);
  };

  const handleAddEvent = (type: LifeEventType) => {
    if (addMenuAge !== null) {
      onAddEvent(type, addMenuAge);
      setAddMenuAge(null);
    }
  };

  return (
    <div className="w-full select-none">
      <div
        ref={containerRef}
        className="relative pt-12 pb-6 min-h-[180px] group cursor-pointer" // Added cursor-pointer for UX
        onClick={handleTimelineClick}
      >
        {/* Main Track Line */}
        <div className="absolute top-[60px] left-0 right-0 h-1.5 bg-gray-100 rounded-full overflow-visible z-0">
          <div
            className="absolute top-0 left-0 h-full bg-primary/20 rounded-full"
            style={{ width: `${ageToPercent(currentAge)}%` }}
          />
          {[20, 30, 40, 50, 60, 70, 80, 90].map(age => {
            const pct = ageToPercent(age);
            if (pct < 0 || pct > 100) return null;
            return (
              <div
                key={age}
                className="absolute top-2 w-px h-3 bg-gray-300 flex flex-col items-center"
                style={{ left: `${pct}%` }}
              >
                <span className="mt-4 text-xs font-semibold text-gray-500 select-none">{age}</span>
              </div>
            );
          })}
        </div>

        {/* Current Age Line */}
        <div
          className="absolute top-[60px] bottom-0 w-0.5 bg-primary/20 z-0 pointer-events-none transition-all duration-300 ease-out"
          style={{ left: `${ageToPercent(currentAge)}%` }}
        />

        {/* Current Age Slider Handle */}
        <div
          data-age-slider
          className="absolute top-[46px] -ml-4 w-8 flex flex-col items-center z-40 cursor-ew-resize group/slider touch-none"
          style={{ left: `${ageToPercent(currentAge)}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const handleMove = (moveH: MouseEvent) => {
              if (!containerRef.current) return;
              const rect = containerRef.current.getBoundingClientRect();
              const x = moveH.clientX - rect.left;
              const p = (x / rect.width) * 100;
              onAgeChange(percentToAge(Math.max(0, Math.min(100, p))));
            };
            const handleUp = () => {
              window.removeEventListener('mousemove', handleMove);
              window.removeEventListener('mouseup', handleUp);
            };
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
          }}
        >
          <div className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-1 shadow-sm">
            {currentAge}
          </div>
          <div className="w-4 h-4 bg-white border-4 border-primary rounded-full shadow-md transition-transform group-hover/slider:scale-125" />
        </div>

        {/* Event Rows */}
        <div className="relative mt-16 space-y-4 z-10 pointer-events-none">
          <AnimatePresence>
            {eventRows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative h-10 pointer-events-auto w-full">
                {row.map(event => {
                  const startPct = ageToPercent(event.startAge);
                  const endAge = event.endAge || event.startAge;
                  const hasDuration = endAge > event.startAge;
                  const endPct = hasDuration ? ageToPercent(endAge) : startPct;
                  const widthPct = Math.max(endPct - startPct, 0);

                  const isDragging = draggingId === event.id;
                  const IconComponent = getEventIcon(event.type);

                  return (
                    <motion.div
                      key={event.id}
                      data-event-item
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{
                        opacity: 1,
                        scale: isDragging ? 1.05 : 1,
                        y: 0,
                        zIndex: isDragging ? 50 : 10
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{
                        left: `${startPct}%`,
                        width: hasDuration ? `${widthPct}%` : 'auto',
                        position: 'absolute',
                      }}
                      className="cursor-move touch-none group/event"
                      onMouseDown={(e) => handleDrag(e, event)}
                      onTouchStart={(e) => handleDrag(e, event)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {hasDuration ? (
                        <div className="relative h-full">
                          <div
                            className={`
                                    absolute left-0 top-0 bottom-0 rounded-full border opacity-80 transition-all
                                    ${isDragging ? 'ring-2 ring-primary ring-offset-2' : ''}
                                `}
                            style={{
                              width: '100%',
                              backgroundColor: 'white',
                              borderColor: event.color,
                              minWidth: '4px'
                            }}
                          >
                            <div className="absolute inset-0 opacity-20 rounded-full" style={{ backgroundColor: event.color }} />
                          </div>
                          <div className="relative flex items-center h-full pl-0 top-1/2 -translate-y-1/2">
                            <div className="flex items-center bg-white rounded-full pr-2.5 py-0.5 border shadow-sm min-w-max" style={{ borderColor: event.color }}>
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 ml-0.5"
                                style={{ backgroundColor: event.color }}
                              >
                                <IconComponent className="w-3 h-3 text-white" />
                              </div>
                              <div className="flex flex-col justify-center ml-2">
                                <span className="text-[11px] font-semibold text-gray-700 leading-none">
                                  {event.name}
                                </span>
                                <span className="text-[9px] text-gray-500 font-medium leading-none mt-0.5">
                                  {event.startAge}-{endAge} ({endAge - event.startAge}y)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`
                            flex items-center gap-2 pl-1 pr-3 py-1 rounded-full shadow-sm border transition-all bg-white relative z-20 min-w-max
                            ${isDragging ? 'shadow-lg ring-2 ring-primary ring-offset-2' : 'hover:shadow-md hover:-translate-y-0.5'}
                          `}
                          style={{
                            borderColor: event.color,
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                            style={{ backgroundColor: event.color }}
                          >
                            <IconComponent className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-gray-700 leading-tight">
                              {event.name}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium leading-tight">
                              Age {event.startAge}
                            </span>
                          </div>
                        </div>
                      )}
                      {!isDragging && (
                        <div className="absolute left-3.5 top-[-10px] w-px h-[10px] bg-gray-300 -z-10" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </AnimatePresence>
        </div>

        {events.length === 0 && (
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-50">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 border border-dashed border-gray-300">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">Tap anywhere on the line to add an event</p>
          </div>
        )}

        {/* Add Menu */}
        <DropdownMenu
          open={addMenuAge !== null}
          onOpenChange={(open) => {
            if (!open) {
              setAddMenuAge(null);
              lastMenuCloseTime.current = Date.now(); // Record close time
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <div
              style={{
                position: 'absolute',
                left: `${ageToPercent(addMenuAge || 30)}%`,
                top: '56px' // Adjusted to be closer to line
              }}
              className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary -translate-x-1/2 cursor-crosshair hover:scale-125 transition-transform"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 max-h-[400px] overflow-y-auto" align="center" sideOffset={10}>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Add event at age <span className="font-bold text-foreground">{addMenuAge}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(EVENT_CATEGORIES).map(([category, types]) => (
              <div key={category} className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {category}
                </div>
                {types.map((type) => {
                  const config = EVENT_CONFIGS[type];
                  const IconComponent = getEventIcon(type);
                  return (
                    <DropdownMenuItem
                      key={type}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddEvent(type);
                      }}
                      className="cursor-pointer py-2 focus:bg-primary/5"
                    >
                      <div
                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 border"
                        style={{ color: config.color }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-700">{config.label}</div>
                        <div className="text-[10px] text-gray-400">{config.description}</div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
