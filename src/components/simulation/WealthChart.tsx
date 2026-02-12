import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { WealthDataPoint } from '@/types/life-planning';

interface WealthChartProps {
  data: WealthDataPoint[];
  currentAge: number;
  onAgeChange: (age: number) => void;
}

const formatMoney = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as WealthDataPoint;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border"
      >
        <p className="font-serif text-lg font-medium mb-2">Age {label}</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-wealth-taxable" />
            <span className="text-muted-foreground">Taxable:</span>
            <span className="font-medium">{formatMoney(data.taxable)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-wealth-deferred" />
            <span className="text-muted-foreground">Tax-Deferred:</span>
            <span className="font-medium">{formatMoney(data.taxDeferred)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-wealth-roth" />
            <span className="text-muted-foreground">Roth:</span>
            <span className="font-medium">{formatMoney(data.roth)}</span>
          </div>
          <div className="border-t border-border pt-1.5 mt-2">
            <div className="flex items-center gap-2 font-medium">
              <span>Total:</span>
              <span className="text-lg">{formatMoney(data.total)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

export function WealthChart({ data, currentAge, onAgeChange }: WealthChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const age = Math.round(18 + percentage * (95 - 18));
    onAgeChange(Math.max(18, Math.min(95, age)));
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const age = Math.round(18 + percentage * (95 - 18));
    onAgeChange(Math.max(18, Math.min(95, age)));
  };

  // Calculate gradient stops for risk zones
  const riskGradient = useMemo(() => {
    return data.map((point, index) => {
      const percentage = ((point.age - 18) / (95 - 18)) * 100;
      let color = 'rgba(76, 175, 80, 0.08)'; // safe
      if (point.riskLevel === 'caution') {
        color = 'rgba(255, 193, 7, 0.08)';
      } else if (point.riskLevel === 'aware') {
        color = 'rgba(239, 83, 80, 0.08)';
      }
      return { offset: `${percentage}%`, color };
    });
  }, [data]);

  const cursorPosition = useMemo(() => {
    return ((currentAge - 18) / (95 - 18)) * 100;
  }, [currentAge]);

  return (
    <motion.div 
      className="relative w-full h-[400px] md:h-[450px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Risk zone background */}
      <div 
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${riskGradient.map(g => `${g.color} ${g.offset}`).join(', ')})`
        }}
      />

      {/* Age cursor */}
      <motion.div
        className="age-cursor z-10"
        style={{ left: `${cursorPosition}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg whitespace-nowrap"
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          Age {currentAge}
        </motion.div>
      </motion.div>

      {/* Chart container */}
      <div 
        ref={chartRef}
        className="relative w-full h-full cursor-crosshair"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 40, right: 20, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="taxableGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(170, 45%, 55%)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(170, 45%, 55%)" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="deferredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(35, 70%, 60%)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(35, 70%, 60%)" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="rothGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(280, 35%, 65%)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(280, 35%, 65%)" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="age" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(30, 10%, 50%)', fontSize: 12 }}
              tickFormatter={(value) => value % 10 === 0 ? `${value}` : ''}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(30, 10%, 50%)', fontSize: 12 }}
              tickFormatter={formatMoney}
              width={60}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine 
              x={currentAge} 
              stroke="hsl(30, 15%, 25%)" 
              strokeWidth={2}
              strokeDasharray="4 4"
            />
            
            <Area
              type="monotone"
              dataKey="roth"
              stackId="1"
              stroke="hsl(280, 35%, 65%)"
              strokeWidth={0}
              fill="url(#rothGradient)"
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="taxDeferred"
              stackId="1"
              stroke="hsl(35, 70%, 60%)"
              strokeWidth={0}
              fill="url(#deferredGradient)"
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="taxable"
              stackId="1"
              stroke="hsl(170, 45%, 55%)"
              strokeWidth={2}
              fill="url(#taxableGradient)"
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-wealth-taxable" />
          <span className="text-muted-foreground">Taxable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-wealth-deferred" />
          <span className="text-muted-foreground">Tax-Deferred</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-wealth-roth" />
          <span className="text-muted-foreground">Roth</span>
        </div>
      </div>
    </motion.div>
  );
}
