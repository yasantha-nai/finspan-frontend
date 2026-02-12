import { motion, AnimatePresence } from 'framer-motion';
import { LifeInsights } from '@/types/life-planning';
import { TrendingUp, ArrowRightLeft, Heart, Compass } from 'lucide-react';

interface InsightCardsProps {
  insights: LifeInsights;
  currentAge: number;
}

const formatMoney = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }
  if (value < 0) {
    return `-$${Math.abs(value).toLocaleString()}`;
  }
  return `$${value.toLocaleString()}`;
};

const getStressEmoji = (level: number): string => {
  if (level < 35) return '😌';
  if (level < 55) return '🙂';
  if (level < 75) return '😐';
  return '😟';
};

const getStressLabel = (level: number): string => {
  if (level < 35) return 'Low';
  if (level < 55) return 'Manageable';
  if (level < 75) return 'Elevated';
  return 'High';
};

const getStatusLabel = (level: LifeInsights['riskLevel']): { label: string; emoji: string } => {
  switch (level) {
    case 'safe': return { label: 'On Track', emoji: '✓' };
    case 'caution': return { label: 'Tight', emoji: '⚡' };
    case 'aware': return { label: 'Needs Attention', emoji: '👀' };
  }
};

export function InsightCards({ insights, currentAge }: InsightCardsProps) {
  const status = getStatusLabel(insights.riskLevel);
  
  const cards = [
    {
      id: 'networth',
      icon: TrendingUp,
      label: 'Net Worth',
      sublabel: `at age ${currentAge}`,
      value: formatMoney(insights.netWorth),
      color: 'text-[hsl(var(--wealth-taxable))]',
      bgClass: 'bg-[hsl(var(--wealth-taxable-light))]',
    },
    {
      id: 'cashflow',
      icon: ArrowRightLeft,
      label: 'Monthly Cash Flow',
      sublabel: insights.monthlyCashFlow >= 0 ? 'surplus' : 'spending more',
      value: formatMoney(insights.monthlyCashFlow),
      color: insights.monthlyCashFlow >= 0 ? 'text-[hsl(var(--status-safe))]' : 'text-[hsl(var(--status-caution))]',
      bgClass: insights.monthlyCashFlow >= 0 ? 'bg-[hsl(var(--status-safe-bg))]' : 'bg-[hsl(var(--status-caution-bg))]',
    },
    {
      id: 'stress',
      icon: Heart,
      label: 'Life Stress',
      sublabel: getStressLabel(insights.stressLevel),
      value: getStressEmoji(insights.stressLevel),
      color: insights.stressLevel < 55 ? 'text-[hsl(var(--status-safe))]' : insights.stressLevel < 75 ? 'text-[hsl(var(--status-caution))]' : 'text-[hsl(var(--status-aware))]',
      bgClass: insights.stressLevel < 55 ? 'bg-[hsl(var(--status-safe-bg))]' : insights.stressLevel < 75 ? 'bg-[hsl(var(--status-caution-bg))]' : 'bg-[hsl(var(--status-aware-bg))]',
    },
    {
      id: 'status',
      icon: Compass,
      label: 'Status',
      sublabel: `retiring at ${insights.retirementAge}`,
      value: `${status.emoji} ${status.label}`,
      color: insights.riskLevel === 'safe' ? 'text-[hsl(var(--status-safe))]' : insights.riskLevel === 'caution' ? 'text-[hsl(var(--status-caution))]' : 'text-[hsl(var(--status-aware))]',
      bgClass: `status-${insights.riskLevel}`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="insight-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-xl ${card.bgClass}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            
            <motion.div 
              className="text-xl font-serif font-semibold mb-0.5"
              key={card.value}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {card.value}
            </motion.div>
            
            <div className="text-sm font-medium text-foreground">{card.label}</div>
            <div className="text-xs text-muted-foreground">{card.sublabel}</div>
          </motion.div>
        ))}
      </div>
      
      {/* Explanation strip */}
      <AnimatePresence mode="wait">
        {insights.explanation && (
          <motion.div
            key={insights.explanation}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center py-3 px-4 rounded-xl bg-accent/50 text-sm text-accent-foreground"
          >
            {insights.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
