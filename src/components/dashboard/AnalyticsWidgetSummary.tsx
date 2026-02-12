import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import { fCurrency } from '@/lib/format-number';

type Props = {
    title: string;
    total: number | string;
    percent: number;
    color?: 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success';
    icon: React.ReactElement;
    chart: {
        categories: string[];
        series: number[];
    };
};

export function AnalyticsWidgetSummary({
    title,
    total,
    percent,
    color = 'primary',
    icon,
    chart,
}: Props) {
    const theme = useTheme();
    const colorValue = theme.palette[color].main;

    const chartOptions = {
        chart: {
            type: 'area' as const,
            toolbar: { show: false },
            sparkline: { enabled: true },
        },
        stroke: {
            width: 2,
            curve: 'smooth' as const,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 100],
            },
        },
        colors: [colorValue],
        xaxis: {
            categories: chart.categories,
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { labels: { show: false } },
        grid: { show: false },
        tooltip: {
            x: { show: true },
            y: {
                formatter: (value: number) => fCurrency(value * 1000), // Multiply back since we divided in Dashboard
            },
        },
    };

    const renderPercent = () => {
        const isPositive = percent >= 0;
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: isPositive ? 'success.main' : 'error.main',
                }}
            >
                <Box component="span" sx={{ fontSize: '1rem' }}>
                    {isPositive ? '↑' : '↓'}
                </Box>
                <Typography variant="caption" fontWeight={600}>
                    {Math.abs(percent)}%
                </Typography>
            </Box>
        );
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                            {typeof total === 'number' ? fCurrency(total) : total}
                        </Typography>
                        {renderPercent()}
                    </Box>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            bgcolor: alpha(colorValue, 0.12),
                            color: colorValue,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>

                {/* Mini Chart */}
                <Box sx={{ mt: 2, mx: -1 }}>
                    <Chart
                        type="area"
                        series={[{ name: title, data: chart.series }]}
                        options={chartOptions}
                        height={60}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}
