import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/simulation-engine';
import { cn } from '@/lib/utils';

interface AssetBucketsProps {
  taxable: number;
  deferred: number;
  roth: number;
  className?: string;
}

const BUCKET_CONFIG = [
  { 
    key: 'taxable', 
    label: 'Taxable', 
    sublabel: 'Brokerage',
    colorClass: 'bg-bucket-taxable',
    borderClass: 'border-bucket-taxable/30',
  },
  { 
    key: 'deferred', 
    label: 'Tax-Deferred', 
    sublabel: '401k/IRA',
    colorClass: 'bg-bucket-deferred',
    borderClass: 'border-bucket-deferred/30',
  },
  { 
    key: 'roth', 
    label: 'Tax-Free', 
    sublabel: 'Roth',
    colorClass: 'bg-bucket-roth',
    borderClass: 'border-bucket-roth/30',
  },
];

export function AssetBuckets({ taxable, deferred, roth, className }: AssetBucketsProps) {
  const values = { taxable, deferred, roth };
  const total = taxable + deferred + roth;
  const maxValue = Math.max(taxable, deferred, roth, 1);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground font-display">Asset Buckets</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          Total: {formatCurrency(total)}
        </span>
      </div>

      <div className="flex items-end gap-3 h-32">
        {BUCKET_CONFIG.map((bucket, index) => {
          const value = values[bucket.key as keyof typeof values];
          const heightPercent = (value / maxValue) * 100;
          
          return (
            <motion.div 
              key={bucket.key}
              className="flex-1 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={cn(
                'w-full rounded-t-lg border-2 border-b-0 relative overflow-hidden',
                bucket.borderClass
              )}
                style={{ height: '80px' }}
              >
                <motion.div
                  className={cn(
                    'absolute bottom-0 left-0 right-0 rounded-t-md',
                    bucket.colorClass
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.15,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                />
                
                {/* Liquid surface effect */}
                <motion.div
                  className={cn(
                    'absolute left-0 right-0 h-1 opacity-50',
                    bucket.colorClass
                  )}
                  style={{ 
                    bottom: `${heightPercent}%`,
                    filter: 'brightness(1.3)'
                  }}
                  animate={{ 
                    scaleY: [1, 1.5, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              </div>
              
              <div className="text-center">
                <div className="text-xs font-medium text-foreground">{bucket.label}</div>
                <div className="text-[10px] text-muted-foreground">{bucket.sublabel}</div>
                <div className="text-xs font-semibold tabular-nums mt-1">
                  {formatCurrency(value)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
