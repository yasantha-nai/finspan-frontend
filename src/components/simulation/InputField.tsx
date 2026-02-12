import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
  id: string;
  label: string;
  tooltip?: string;
  className?: string;
}

interface CurrencyFieldProps extends BaseFieldProps {
  type: 'currency';
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
}

interface PercentFieldProps extends BaseFieldProps {
  type: 'percent';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

interface NumberFieldProps extends BaseFieldProps {
  type: 'number';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

interface SliderFieldProps extends BaseFieldProps {
  type: 'slider';
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

interface ToggleFieldProps extends BaseFieldProps {
  type: 'toggle';
  value: boolean;
  onChange: (value: boolean) => void;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

type InputFieldProps =
  | CurrencyFieldProps
  | PercentFieldProps
  | NumberFieldProps
  | SliderFieldProps
  | ToggleFieldProps
  | SelectFieldProps;

export function InputField(props: InputFieldProps) {
  const { id, label, tooltip, className } = props;

  const renderTooltip = () => {
    if (!tooltip) return null;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  };

  const renderField = () => {
    switch (props.type) {
      case 'currency': {
        const [localValue, setLocalValue] = useState(props.value.toLocaleString());

        // Sync local value when external prop changes (e.g. from Auto-Calculate)
        useEffect(() => {
          setLocalValue(props.value.toLocaleString());
        }, [props.value]);

        const handleBlur = () => {
          const parsed = parseFloat(localValue.replace(/[^0-9.-]/g, ''));
          if (!isNaN(parsed)) {
            let finalValue = parsed;
            if (props.min !== undefined && finalValue < props.min) {
              finalValue = props.min;
            }
            props.onChange(finalValue);
            setLocalValue(finalValue.toLocaleString());
          }
        };

        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id={id}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleBlur}
              className="pl-7 tabular-nums text-right"
              placeholder={props.placeholder}
            />
          </div>
        );
      }

      case 'percent': {
        return (
          <div className="relative">
            <Input
              id={id}
              type="number"
              value={props.value}
              onChange={(e) => props.onChange(parseFloat(e.target.value) || 0)}
              min={props.min ?? 0}
              max={props.max ?? 100}
              step={props.step ?? 0.1}
              className="pr-8 tabular-nums text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
        );
      }

      case 'number': {
        return (
          <Input
            id={id}
            type="number"
            value={props.value}
            onChange={(e) => props.onChange(parseInt(e.target.value) || 0)}
            min={props.min}
            max={props.max}
            step={props.step}
            className="tabular-nums text-right"
          />
        );
      }

      case 'slider': {
        const formatVal = props.formatValue ?? ((v: number) => v.toString());
        return (
          <div className="space-y-2">
            <Slider
              value={[props.value]}
              onValueChange={([val]) => props.onChange(val)}
              min={props.min}
              max={props.max}
              step={props.step ?? 1}
              className="py-2"
            />
            {props.showValue !== false && (
              <div className="text-center text-sm font-medium tabular-nums">
                {formatVal(props.value)}
              </div>
            )}
          </div>
        );
      }

      case 'toggle': {
        return (
          <Switch
            id={id}
            checked={props.value}
            onCheckedChange={props.onChange}
          />
        );
      }

      case 'select': {
        return (
          <Select value={props.value} onValueChange={props.onChange}>
            <SelectTrigger id={id}>
              <SelectValue placeholder={props.placeholder ?? 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
    }
  };

  const isToggle = props.type === 'toggle';

  return (
    <motion.div
      className={cn('space-y-2', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn(
        'flex items-center gap-2',
        isToggle && 'justify-between'
      )}>
        <Label htmlFor={id} className="text-sm font-medium flex items-center gap-1.5">
          {label}
          {renderTooltip()}
        </Label>
        {isToggle && renderField()}
      </div>
      {!isToggle && renderField()}
    </motion.div>
  );
}
