import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import { SimulationResult } from '@/types/simulation';

interface ResultsInsightsPanelProps {
    result: SimulationResult;
    targetAge?: number;
    onQuickFix?: (action: 'reduceSpending' | 'workLonger' | 'saveMore') => void;
}

export function ResultsInsightsPanel({ result, targetAge = 95, onQuickFix }: ResultsInsightsPanelProps) {
    // Calculate gap analysis
    let depletionAge = 89;

    if (result?.years && result.years.length > 0) {
        const depletionYear = result.years.find(year => year.totalPortfolio <= 0);
        if (depletionYear) {
            depletionAge = depletionYear.userAge;
        } else {
            const lastYear = result.years[result.years.length - 1];
            depletionAge = lastYear?.userAge || targetAge;
        }
    }

    const gap = Math.max(0, targetAge - depletionAge);
    const needsAdjustment = gap > 0;

    const StatusCard = () => (
        <Card
            sx={{
                p: 2.5,
                mb: 2,
                bgcolor: needsAdjustment ? '#FFF4F2' : '#F2FFFA',
                border: '1px solid',
                borderColor: needsAdjustment ? '#FF5630' : '#00A76F',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}
        >
            <Box sx={{
                width: 48, height: 48, borderRadius: '50%',
                bgcolor: needsAdjustment ? '#FFE9D5' : '#D1FAE5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
            }}>
                <Icon
                    icon={needsAdjustment ? "solar:danger-triangle-bold" : "solar:check-circle-bold"}
                    width={24}
                    color={needsAdjustment ? "#FF5630" : "#00A76F"}
                />
            </Box>
            <Box>
                <Typography variant="subtitle1" fontWeight={700} color={needsAdjustment ? "error.main" : "success.main"}>
                    {needsAdjustment ? "Plan Needs Adjustment" : "Plan On Track"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {needsAdjustment
                        ? `Savings depleted before ${targetAge}`
                        : `Savings last beyond ${targetAge}`}
                </Typography>
            </Box>
        </Card>
    );

    const MetricCard = ({ icon, label, value, subtext, color = 'primary' }: any) => (
        <Card sx={{ p: 2.5, mb: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: `${color}.lighter`,
                color: `${color}.main`,
                display: 'flex'
            }}>
                <Icon icon={icon} width={24} />
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
                <Typography variant="h6" fontWeight={700}>{value}</Typography>
                {subtext && <Typography variant="caption" color="text.secondary">{subtext}</Typography>}
            </Box>
        </Card>
    );

    const QuickActions = () => (
        <Card sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                Quick Fixes
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                    { icon: 'solar:wallet-money-bold-duotone', label: 'Reduce Spending 10%', action: 'reduceSpending' as const },
                    { icon: 'solar:briefcase-bold-duotone', label: 'Work 2 More Years', action: 'workLonger' as const },
                    { icon: 'solar:chart-square-bold-duotone', label: 'Save $500/mo More', action: 'saveMore' as const },
                ].map((fix) => (
                    <Button
                        key={fix.label}
                        variant="outlined"
                        size="small"
                        color="inherit"
                        sx={{ justifyContent: 'flex-start', py: 1, px: 1.5, borderColor: 'divider' }}
                        startIcon={<Icon icon={fix.icon} width={20} />}
                        onClick={() => onQuickFix?.(fix.action)}
                    >
                        {fix.label}
                    </Button>
                ))}
            </Box>
        </Card>
    );

    return (
        <Box>
            <StatusCard />

            <MetricCard
                icon="solar:calendar-mark-bold-duotone"
                label="Money Lasts Until"
                value={`Age ${depletionAge}`}
                subtext={gap > 0 ? `${gap} years short of goal` : "Full coverage"}
                color={needsAdjustment ? "warning" : "success"}
            />

            <MetricCard
                icon={needsAdjustment ? "solar:hand-money-bold-duotone" : "solar:wad-of-money-bold-duotone"}
                label={needsAdjustment ? "Estimated Shortfall" : "Estimated Surplus"}
                value={needsAdjustment ? "$245,000" : "$1.2M"}
                subtext={`At age ${targetAge}`}
                color={needsAdjustment ? "error" : "info"}
            />

            {needsAdjustment && <QuickActions />}
        </Box>
    );
}
