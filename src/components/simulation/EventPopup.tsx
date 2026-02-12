import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeEvent, EVENT_CONFIGS } from '@/types/life-planning';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getEventIcon } from './LifeEventIcons';
import { Trash2, X } from 'lucide-react';

interface EventPopupProps {
  event: LifeEvent | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<LifeEvent>) => void;
  onDelete: (id: string) => void;
}

export function EventPopup({ event, onClose, onUpdate, onDelete }: EventPopupProps) {
  const [params, setParams] = useState<Record<string, number | string | boolean>>({});

  useEffect(() => {
    if (event) {
      setParams({ ...event.params });
    }
  }, [event]);

  if (!event) return null;

  const handleParamChange = (key: string, value: number | string | boolean) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onUpdate(event.id, { params: newParams });
  };

  const handleAgeChange = (value: number[]) => {
    onUpdate(event.id, { startAge: value[0] });
  };

  const config = EVENT_CONFIGS[event.type];
  const IconComponent = getEventIcon(event.type);

  // Helper to get numeric param
  const p = (key: string, fallback: number) => {
    const val = params[key];
    return typeof val === 'number' ? val : fallback;
  };

  // Format helpers
  const fmt = {
    dollar: (v: number) => `$${v.toLocaleString()}`,
    percent: (v: number) => `${v}%`,
    years: (v: number) => `${v} yr${v !== 1 ? 's' : ''}`,
    months: (v: number) => `${v} mo`,
  };

  // Render parameter controls based on event type
  const renderControls = () => {
    switch (event.type) {
      case 'job':
        return (
          <>
            <ParamSlider
              label="Annual Salary"
              value={p('salary', 55000)}
              min={20000}
              max={300000}
              step={5000}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('salary', v)}
            />
            <ParamSlider
              label="Annual Raise"
              value={p('annualRaise', 3)}
              min={0}
              max={10}
              step={0.5}
              format={fmt.percent}
              onChange={(v) => handleParamChange('annualRaise', v)}
            />
          </>
        );

      case 'job-change':
        return (
          <ParamSlider
            label="New Salary"
            value={p('newSalary', 75000)}
            min={20000}
            max={400000}
            step={5000}
            format={fmt.dollar}
            onChange={(v) => handleParamChange('newSalary', v)}
          />
        );

      case 'side-hustle':
        return (
          <ParamSlider
            label="Monthly Income"
            value={p('monthlyIncome', 1000)}
            min={100}
            max={10000}
            step={100}
            format={fmt.dollar}
            onChange={(v) => handleParamChange('monthlyIncome', v)}
          />
        );

      case 'education':
        return (
          <>
            <ParamSlider
              label="Total Tuition"
              value={p('tuition', 40000)}
              min={5000}
              max={300000}
              step={5000}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('tuition', v)}
            />
            <ParamSlider
              label="Duration"
              value={p('durationYears', 4)}
              min={1}
              max={8}
              step={1}
              format={fmt.years}
              onChange={(v) => handleParamChange('durationYears', v)}
            />
          </>
        );

      case 'rent':
        return (
          <ParamSlider
            label="Monthly Rent"
            value={p('monthlyRent', 2000)}
            min={500}
            max={8000}
            step={100}
            format={fmt.dollar}
            onChange={(v) => handleParamChange('monthlyRent', v)}
          />
        );

      case 'home':
        return (
          <>
            <ParamSlider
              label="Home Price"
              value={p('homePrice', 400000)}
              min={100000}
              max={2000000}
              step={25000}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('homePrice', v)}
            />
            <ParamSlider
              label="Down Payment"
              value={p('downPaymentPercent', 20)}
              min={0}
              max={50}
              step={5}
              format={fmt.percent}
              onChange={(v) => handleParamChange('downPaymentPercent', v)}
            />
          </>
        );

      case 'marriage':
        return (
          <>
            <ParamSlider
              label="Wedding Cost"
              value={p('weddingCost', 25000)}
              min={0}
              max={150000}
              step={5000}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('weddingCost', v)}
            />
            <ParamSlider
              label="Partner Income"
              value={p('partnerIncome', 55000)}
              min={0}
              max={300000}
              step={5000}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('partnerIncome', v)}
            />
          </>
        );

      case 'children':
        return (
          <>
            <ParamSlider
              label="Number of Kids"
              value={p('numKids', 1)}
              min={1}
              max={5}
              step={1}
              format={(v) => `${v}`}
              onChange={(v) => handleParamChange('numKids', v)}
            />
            <ParamSlider
              label="Annual Cost per Child"
              value={p('annualCostPerKid', 15000)}
              min={5000}
              max={40000}
              step={1000}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('annualCostPerKid', v)}
            />
          </>
        );

      case 'business':
        return (
          <>
            <ParamSlider
              label="Startup Cost"
              value={p('startupCost', 50000)}
              min={5000}
              max={500000}
              step={5000}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('startupCost', v)}
            />
            <ParamSlider
              label="Expected Revenue"
              value={p('expectedRevenue', 80000)}
              min={20000}
              max={500000}
              step={10000}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('expectedRevenue', v)}
            />
          </>
        );

      case 'retirement':
        return (
          <ParamSlider
            label="Monthly Spending"
            value={p('monthlySpending', 4000)}
            min={1500}
            max={15000}
            step={500}
            format={fmt.dollar}
            onChange={(v) => handleParamChange('monthlySpending', v)}
          />
        );

      case 'health':
        return (
          <ParamSlider
            label="Medical Cost"
            value={p('medicalCost', 25000)}
            min={1000}
            max={300000}
            step={5000}
            format={fmt.dollar}
            onChange={(v) => handleParamChange('medicalCost', v)}
          />
        );

      case 'move':
        return (
          <ParamSlider
            label="Moving Cost"
            value={p('movingCost', 5000)}
            min={1000}
            max={50000}
            step={1000}
            format={fmt.dollar}
            onChange={(v) => handleParamChange('movingCost', v)}
          />
        );

      case 'family-support':
        return (
          <>
            <ParamSlider
              label="Monthly Amount"
              value={p('monthlyAmount', 500)}
              min={100}
              max={5000}
              step={100}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('monthlyAmount', v)}
            />
            <ParamSlider
              label="Duration"
              value={p('supportYears', 5)}
              min={1}
              max={25}
              step={1}
              format={fmt.years}
              onChange={(v) => handleParamChange('supportYears', v)}
            />
          </>
        );

      case 'car':
        return (
          <ParamSlider
            label="Car Price"
            value={p('carPrice', 30000)}
            min={5000}
            max={150000}
            step={5000}
            format={fmt.dollar}
            onChange={(v) => handleParamChange('carPrice', v)}
          />
        );

      case 'vacation':
        return (
          <ParamSlider
            label="Trip Cost"
            value={p('tripCost', 5000)}
            min={500}
            max={50000}
            step={500}
            format={fmt.dollar}
            onChange={(v) => handleParamChange('tripCost', v)}
          />
        );

      case 'one-time-expense':
        return (
          <ParamSlider
            label="Amount"
            value={p('amount', 15000)}
            min={1000}
            max={200000}
            step={1000}
            format={fmt.dollar}
            onChange={(v) => handleParamChange('amount', v)}
          />
        );

      case 'insurance':
        return (
          <>
            <ParamSlider
              label="Monthly Premium"
              value={p('monthlyPremium', 100)}
              min={10}
              max={2000}
              step={10}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('monthlyPremium', v)}
            />
            <ParamSlider
              label="Coverage Amount"
              value={p('coverageAmount', 500000)}
              min={10000}
              max={5000000}
              step={10000}
              format={fmt.dollar}
              onChange={(v) => handleParamChange('coverageAmount', v)}
            />
            <ParamSlider
              label="Term Length"
              value={p('termLength', 20)}
              min={1}
              max={40}
              step={1}
              format={fmt.years}
              onChange={(v) => handleParamChange('termLength', v)}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Popup */}
        <motion.div
          className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div
            className="p-5 pb-3"
            style={{ backgroundColor: event.color + '15' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconComponent className="w-7 h-7" style={{ color: event.color }} />
                <div>
                  <h2 className="text-lg font-bold">{config.label}</h2>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 pt-3 overflow-y-auto flex-1">
            {/* Age adjustment */}
            <div className="pb-4 border-b border-border/30">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Starting Age</p>
                <span className="text-lg font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg">
                  {event.startAge}
                </span>
              </div>
              <Slider
                value={[event.startAge]}
                min={18}
                max={90}
                step={1}
                onValueChange={handleAgeChange}
              />

              {/* Duration Slider (Optional, for creating long bars) */}
              <div className="mt-4 pt-2 border-t border-dashed">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {event.endAge ? `${event.endAge - event.startAge} yrs` : '1 yr'}
                  </span>
                </div>
                <Slider
                  value={[event.endAge ? event.endAge - event.startAge : 1]}
                  min={1}
                  max={50} // Up to 50 years duration
                  step={1}
                  onValueChange={(val) => {
                    const duration = val[0];
                    // If duration is 1, we can clear endAge to make it a "point" event again, 
                    // OR we just set endAge = startAge + 1
                    onUpdate(event.id, { endAge: event.startAge + duration });
                  }}
                />
              </div>
            </div>

            {/* Event-specific controls */}
            <div className="pt-4 space-y-4">
              {renderControls()}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/30 bg-muted/20">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(event.id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
              <p className="text-xs text-muted-foreground italic">
                Auto-saving
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Simple slider component for parameters
function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">{label}</p>
        <span className="text-sm font-bold text-primary tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}
