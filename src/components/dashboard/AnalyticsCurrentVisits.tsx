import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';

type Props = {
    title: string;
    chart: {
        series: Array<{
            label: string;
            value: number;
        }>;
    };
};

export function AnalyticsCurrentVisits({ title, chart }: Props) {
    const theme = useTheme();

    const chartOptions = {
        chart: {
            toolbar: { show: false },
        },
        colors: [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.warning.main,
            theme.palette.error.main,
        ],
        labels: chart.series.map((s) => s.label),
        legend: {
            position: 'bottom' as const,
            horizontalAlign: 'center' as const,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                },
            },
        },
        dataLabels: {
            enabled: true,
            dropShadow: { enabled: false },
        },
    };

    return (
        <Card>
            <CardHeader title={title} />
            <Box sx={{ p: 3 }}>
                <Chart
                    type="donut"
                    series={chart.series.map((s) => s.value)}
                    options={chartOptions}
                    height={350}
                />
            </Box>
        </Card>
    );
}
