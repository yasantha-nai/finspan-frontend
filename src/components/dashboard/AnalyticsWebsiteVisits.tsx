import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import { fNumber } from '@/lib/format-number';

type Props = {
    title: string;
    subheader?: string;
    chart: {
        categories: string[];
        series: Array<{
            name: string;
            data: number[];
        }>;
    };
};

export function AnalyticsWebsiteVisits({ title, subheader, chart }: Props) {
    const theme = useTheme();

    const chartOptions = {
        chart: {
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        colors: [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.warning.main,
        ],
        stroke: {
            width: 3,
            curve: 'smooth' as const,
        },
        xaxis: {
            categories: chart.categories,
        },
        yaxis: {
            labels: {
                formatter: (value: number) => fNumber(value),
            },
        },
        tooltip: {
            y: {
                formatter: (value: number) => fNumber(value),
            },
        },
        legend: {
            position: 'top' as const,
            horizontalAlign: 'right' as const,
        },
        grid: {
            strokeDashArray: 3,
        },
    };

    return (
        <Card>
            <CardHeader title={title} subheader={subheader} />
            <Box sx={{ p: 3, pb: 1 }}>
                <Chart
                    type="line"
                    series={chart.series}
                    options={chartOptions}
                    height={364}
                />
            </Box>
        </Card>
    );
}
