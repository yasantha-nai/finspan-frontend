import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart, ResponsiveContainer, ComposedChart } from 'recharts';
import { useSimulation } from '@/context/SimulationContext';

interface WealthTrajectoryChartProps {
    showBaseline?: boolean;
}

export function WealthTrajectoryChart({ showBaseline = false }: WealthTrajectoryChartProps) {
    const { result, baselineResult } = useSimulation();

    const dataToDisplay = result;
    const baselineToDisplay = baselineResult;

    if (!dataToDisplay?.years || dataToDisplay.years.length === 0) {
        return <div>No data available</div>;
    }

    // Transform data for chart
    const chartData = dataToDisplay.years.map((year, index) => {
        // Find corresponding baseline year if available
        const baselineYear = showBaseline && baselineToDisplay?.years
            ? baselineToDisplay.years.find(y => y.userAge === year.userAge)
            : null;

        return {
            age: year.userAge,
            taxable: year.taxableBalance || 0,
            taxDeferred: year.deferredBalance || 0,
            roth: year.rothBalance || 0,
            total: year.totalPortfolio || 0,
            // Baseline total for comparison line
            baselineTotal: baselineYear ? (baselineYear.totalPortfolio || 0) : undefined
        };
    });

    return (
        <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData}>
                <defs>
                    <linearGradient id="colorTaxable" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="colorTaxDeferred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="colorRoth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                    dataKey="age"
                    label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                />
                <YAxis
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                    tick={{ fontSize: 12 }}
                />
                <Tooltip
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                    }}
                />
                <Legend
                    wrapperStyle={{ paddingTop: 20 }}
                    iconType="line"
                />
                <Area
                    type="monotone"
                    dataKey="taxable"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="url(#colorTaxable)"
                    name="Taxable"
                />
                <Area
                    type="monotone"
                    dataKey="taxDeferred"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#colorTaxDeferred)"
                    name="Tax-Deferred"
                />
                <Area
                    type="monotone"
                    dataKey="roth"
                    stackId="1"
                    stroke="#06b6d4"
                    fill="url(#colorRoth)"
                    name="Roth"
                />
                {showBaseline && (
                    <Line
                        type="monotone"
                        dataKey="baselineTotal"
                        stroke="#6B7280"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={false}
                        name="Original Plan"
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
