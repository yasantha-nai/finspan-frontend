import { motion } from 'framer-motion';
import { Check, User, Wallet, PiggyBank, TrendingUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const PHASES = [
  { id: 0, name: 'Identity', icon: User, description: 'Basic info & timeline' },
  { id: 1, name: 'Income', icon: Wallet, description: 'Current assets & income' },
  { id: 2, name: 'Savings', icon: PiggyBank, description: 'Contributions & matching' },
  { id: 3, name: 'Future', icon: TrendingUp, description: 'Expenses & returns' },
  { id: 4, name: 'Strategy', icon: Settings, description: 'Advanced options' },
];

interface WizardProgressProps {
  currentPhase: number;
  onPhaseClick: (phase: number) => void;
  completedPhases: number[];
}

export function WizardProgress({ currentPhase, onPhaseClick, completedPhases }: WizardProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4">
        {/* Progress line background */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-border" />
        
        {/* Progress line filled */}
        <motion.div 
          className="absolute top-5 left-8 h-0.5 bg-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${(currentPhase / (PHASES.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ maxWidth: 'calc(100% - 4rem)' }}
        />

        {PHASES.map((phase) => {
          const isCompleted = completedPhases.includes(phase.id);
          const isCurrent = currentPhase === phase.id;
          const Icon = phase.icon;

          return (
            <button
              key={phase.id}
              onClick={() => onPhaseClick(phase.id)}
              className="relative z-10 flex flex-col items-center gap-2 group"
            >
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isCompleted && 'bg-secondary border-secondary',
                  isCurrent && !isCompleted && 'bg-primary border-primary',
                  !isCurrent && !isCompleted && 'bg-card border-border group-hover:border-muted-foreground'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-secondary-foreground" />
                ) : (
                  <Icon className={cn(
                    'w-5 h-5',
                    isCurrent ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                )}
              </motion.div>
              
              <div className="flex flex-col items-center">
                <span className={cn(
                  'text-xs font-medium transition-colors',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {phase.name}
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:block">
                  {phase.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
