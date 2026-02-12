import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Wallet, AlertTriangle, CheckCircle, Target, Download } from 'lucide-react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSimulation } from '@/context/SimulationContext';
import { formatCurrency, formatPercent } from '@/lib/simulation-engine';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ScenarioManager } from './ScenarioManager';
import { QuickScenarios } from './QuickScenarios';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResultsTable } from './ResultsTable';
import { muiTheme } from '@/theme/mui-theme';
import { ResultsInsightsPanel } from './ResultsInsightsPanel';
import { LifeEventsTimeline } from './LifeEventsTimeline';
import { DebugPanel } from './DebugPanel';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function ResultsDashboard() {
  const { result, inputs, rawBackendResults, savedScenarios, selectedScenarios, updateInput, runSim } = useSimulation();

  // Calculate total savings for validation
  const totalSavings = (inputs.taxDeferredSavings || 0) + (inputs.taxFreeSavings || 0) + (inputs.taxableSavings || 0) + 
                       (inputs.spouseTaxDeferredSavings || 0) + (inputs.spouseTaxFreeSavings || 0) + (inputs.spouseTaxableSavings || 0);

  const handleExport = useCallback(() => {
    if (!rawBackendResults || rawBackendResults.length === 0) return;

    // Convert to CSV
    const headers = Object.keys(rawBackendResults[0]);
    const csvContent = [
      headers.join(','),
      ...rawBackendResults.map(row =>
        headers.map(header => row[header as keyof typeof row] ?? '').join(',')
      )
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'retirement_simulation_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [rawBackendResults]);

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.years.map(y => ({
      year: y.year,
      age: y.userAge,
      portfolio: Math.round(y.totalPortfolio),
      expenses: Math.round(y.totalSpend),
      taxable: Math.round(y.taxableBalance),
      deferred: Math.round(y.deferredBalance),
      roth: Math.round(y.rothBalance),
      income: Math.round(y.grossIncome),
      taxes: Math.round(y.totalTax),
    }));
  }, [result]);

  if (!result) return null;

  const isSuccess = result.successProbability >= 90;
  const hasShortfall = result.shortfallYears.length > 0;
  const peakWealth = Math.max(...result.years.map(y => y.totalPortfolio));
  const retirementYear = result.years.find(y => y.userAge === inputs.retirementAge);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-display font-bold">Wealth Trajectory</h2>
      </div>

      {/* Zero Savings Warning */}
      {totalSavings === 0 && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive" className="border-red-500/50 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900 font-bold">Backend Limitation: Cannot Start with $0</AlertTitle>
            <AlertDescription className="text-red-800">
              <p className="mb-3">
                <strong>⚠️ Current Issue:</strong> The backend simulation engine doesn't support starting with $0 in savings, 
                even if you have positive cash flow (Income &gt; Spending).
              </p>
              <p className="mb-2">
                <strong>Why?</strong> The backend only <em>grows</em> existing balances and handles <em>withdrawals</em>. 
                It doesn't have logic to handle the <strong>accumulation phase</strong> where excess income 
                (${`${((inputs.currentSalary || 0) + (inputs.spouseSalary || 0) - (inputs.currentExpenses || 0)).toLocaleString()}`}/year in your case) 
                automatically gets invested.
              </p>
              <p className="mb-3 font-semibold">
                <strong>Temporary Workaround:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Go back to <strong>Step 3: Savings & Contributions</strong></li>
                <li>Enter <strong>any starting amount</strong> (even $10,000 is fine)</li>
                <li>The simulation will then model growth + your ongoing contributions</li>
                {inputs.taxFilingStatus === 'married_joint' && (
                  <li>Add balances for both you and your spouse</li>
                )}
              </ul>
              <p className="text-xs text-red-700 bg-red-100 p-2 rounded border border-red-300">
                📋 <strong>Note to developer:</strong> The backend needs a contribution/accumulation module that:
                (1) Calculates excess cash flow = income - spending - taxes, and 
                (2) Invests that excess into retirement accounts during working years.
              </p>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* 2. CHART & INSIGHTS PANEL GRID */}
      <ThemeProvider theme={muiTheme}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '66fr 34fr' }, gap: 3 }}>
          {/* Left: Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                {selectedScenarios.size >= 2 && (
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Scenario Comparison</h3>
                    <p className="text-sm text-muted-foreground">
                      Comparing {selectedScenarios.size} scenarios
                    </p>
                  </div>
                )}

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedScenarios.size >= 2 ? (
                      /* Comparison View: Multiple LineCharts */
                      <LineChart>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                          dataKey="age"
                          type="number"
                          domain={['dataMin', 'dataMax']}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px',
                          }}
                          formatter={(value: number) => [formatCurrency(value), '']}
                          labelFormatter={(label) => `Age ${label}`}
                        />
                        <Legend />
                        <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />

                        {/* Current scenario */}
                        {result && (
                          <Line
                            data={result.years.map(y => ({ age: y.userAge, portfolio: y.totalPortfolio }))}
                            type="monotone"
                            dataKey="portfolio"
                            stroke="hsl(var(--primary))"
                            strokeWidth={3}
                            dot={false}
                            name="Current Scenario"
                          />
                        )}

                        {/* Selected saved scenarios */}
                        {Array.from(selectedScenarios).map((scenarioName, index) => {
                          const scenario = savedScenarios.get(scenarioName);
                          if (!scenario) return null;

                          const colors = [
                            'hsl(200, 80%, 50%)',    // Blue
                            'hsl(158, 64%, 42%)',    // Green
                            'hsl(262, 52%, 55%)',    // Purple
                          ];

                          return (
                            <Line
                              key={scenarioName}
                              data={scenario.result.years.map(y => ({ age: y.userAge, portfolio: y.totalPortfolio }))}
                              type="monotone"
                              dataKey="portfolio"
                              stroke={colors[index % colors.length]}
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={false}
                              name={scenarioName}
                            />
                          );
                        })}
                      </LineChart>
                    ) : (
                      /* Single View: Stacked AreaChart */
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="gradientTaxable" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="gradientDeferred" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(262, 52%, 55%)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(262, 52%, 55%)" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="gradientRoth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                          dataKey="age"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(v) => `${v}`}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-lg)'
                          }}
                          formatter={(value: number) => [formatCurrency(value), '']}
                          labelFormatter={(label) => `Age ${label}`}
                        />
                        <Legend />
                        <ReferenceLine
                          x={inputs.retirementAge}
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="5 5"
                          label={{
                            value: 'Retirement',
                            position: 'top',
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12
                          }}
                        />
                        {/* Bankruptcy Warning Line */}
                        {(() => {
                          const bankruptcyYear = result.years.find(y => y.totalPortfolio <= 0);
                          if (bankruptcyYear) {
                            return (
                              <ReferenceLine
                                x={bankruptcyYear.userAge}
                                stroke="hsl(var(--destructive))"
                                strokeWidth={3}
                                label={{
                                  value: `⚠️ Funds Depleted at Age ${bankruptcyYear.userAge}`,
                                  position: 'top',
                                  fill: 'hsl(var(--destructive))',
                                  fontSize: 12,
                                  fontWeight: 'bold',
                                  offset: 10
                                }}
                              />
                            );
                          }
                          return null;
                        })()}

                        {/* Danger Zone - Low Balance Warning */}
                        <ReferenceLine y={100000} stroke="hsl(var(--warning))" strokeDasharray="3 3" />
                        <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeWidth={2} />

                        <Area
                          type="monotone"
                          dataKey="taxable"
                          stackId="1"
                          stroke="hsl(200, 80%, 50%)"
                          fill="url(#gradientTaxable)"
                          name="Taxable"
                        />
                        <Area
                          type="monotone"
                          dataKey="deferred"
                          stackId="1"
                          stroke="hsl(262, 52%, 55%)"
                          fill="url(#gradientDeferred)"
                          name="Tax-Deferred"
                        />
                        <Area
                          type="monotone"
                          dataKey="roth"
                          stackId="1"
                          stroke="hsl(158, 64%, 42%)"
                          fill="url(#gradientRoth)"
                          name="Roth"
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Insights Panel */}
          <Box>
            <ResultsInsightsPanel
              result={result}
              targetAge={inputs.lifeExpectancy || 95}
              onQuickFix={(action) => {
                if (action === 'reduceSpending') {
                  updateInput('currentExpenses', Math.round(inputs.currentExpenses * 0.9));
                } else if (action === 'workLonger') {
                  updateInput('retirementAge', inputs.retirementAge + 2);
                } else if (action === 'saveMore') {
                  updateInput('contribDeferred', inputs.contribDeferred + 500);
                }
                setTimeout(runSim, 100);
              }}
            />
          </Box>
        </Box>

        {/* Life Events Timeline */}
        <Box sx={{ mt: 3 }}>
          <LifeEventsTimeline />
        </Box>
      </ThemeProvider>

      {/* 3. COMPARISON METRICS (Details) */}
      {selectedScenarios.size >= 2 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Scenario Comparison Details</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 sm:p-3 font-semibold">Metric</th>
                      <th className="text-right p-2 sm:p-3 font-semibold">Current</th>
                      {Array.from(selectedScenarios).map(scenarioName => (
                        <th key={scenarioName} className="text-right p-3 font-semibold">
                          {scenarioName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Success Probability Row */}
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-2 sm:p-3 font-medium">Success Probability</td>
                      <td className="p-2 sm:p-3 text-right tabular-nums">
                        {result.successProbability.toFixed(1)}%
                      </td>
                      {Array.from(selectedScenarios).map(scenarioName => {
                        const scenario = savedScenarios.get(scenarioName);
                        if (!scenario) return <td key={scenarioName}>-</td>;
                        const diff = scenario.result.successProbability - result.successProbability;
                        return (
                          <td key={scenarioName} className="p-3 text-right tabular-nums">
                            {scenario.result.successProbability.toFixed(1)}%
                            <span className={cn(
                              "ml-2 text-xs",
                              diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "text-muted-foreground"
                            )}>
                              {diff > 0 ? `+${diff.toFixed(1)}%` : diff < 0 ? `${diff.toFixed(1)}%` : ''}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* At Retirement Row */}
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-3 font-medium">Balance at Retirement</td>
                      <td className="p-3 text-right tabular-nums">
                        {formatCurrency(
                          result.years.find(y => y.userAge === inputs.retirementAge)?.totalPortfolio ?? 0
                        )}
                      </td>
                      {Array.from(selectedScenarios).map(scenarioName => {
                        const scenario = savedScenarios.get(scenarioName);
                        if (!scenario) return <td key={scenarioName}>-</td>;
                        const currentVal = result.years.find(y => y.userAge === inputs.retirementAge)?.totalPortfolio ?? 0;
                        const scenarioVal = scenario.result.years.find(
                          y => y.userAge === scenario.inputs.retirementAge
                        )?.totalPortfolio ?? 0;
                        const diff = scenarioVal - currentVal;
                        return (
                          <td key={scenarioName} className="p-3 text-right tabular-nums">
                            {formatCurrency(scenarioVal)}
                            <span className={cn(
                              "ml-2 text-xs block",
                              diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "text-muted-foreground"
                            )}>
                              {diff !== 0 ? `${diff > 0 ? '+' : ''}${formatCurrency(diff)}` : ''}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Peak Wealth Row */}
                    <tr className="border-b hover:bg-muted/30">
                      <td className="p-3 font-medium">Peak Wealth</td>
                      <td className="p-3 text-right tabular-nums">
                        {formatCurrency(Math.max(...result.years.map(y => y.totalPortfolio)))}
                      </td>
                      {Array.from(selectedScenarios).map(scenarioName => {
                        const scenario = savedScenarios.get(scenarioName);
                        if (!scenario) return <td key={scenarioName}>-</td>;
                        const currentPeak = Math.max(...result.years.map(y => y.totalPortfolio));
                        const scenarioPeak = Math.max(...scenario.result.years.map(y => y.totalPortfolio));
                        const diff = scenarioPeak - currentPeak;
                        return (
                          <td key={scenarioName} className="p-3 text-right tabular-nums">
                            {formatCurrency(scenarioPeak)}
                            <span className={cn(
                              "ml-2 text-xs block",
                              diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "text-muted-foreground"
                            )}>
                              {diff !== 0 ? `${diff > 0 ? '+' : ''}${formatCurrency(diff)}` : ''}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Legacy Value Row */}
                    <tr className="hover:bg-muted/30">
                      <td className="p-3 font-medium">Legacy Value</td>
                      <td className="p-3 text-right tabular-nums">
                        {formatCurrency(result.totalLegacy)}
                      </td>
                      {Array.from(selectedScenarios).map(scenarioName => {
                        const scenario = savedScenarios.get(scenarioName);
                        if (!scenario) return <td key={scenarioName}>-</td>;
                        const diff = scenario.result.totalLegacy - result.totalLegacy;
                        return (
                          <td key={scenarioName} className="p-3 text-right tabular-nums">
                            {formatCurrency(scenario.result.totalLegacy)}
                            <span className={cn(
                              "ml-2 text-xs block",
                              diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "text-muted-foreground"
                            )}>
                              {diff !== 0 ? `${diff > 0 ? '+' : ''}${formatCurrency(diff)}` : ''}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 4. QUICK SCENARIOS - EXPANDED */}
      <motion.div variants={itemVariants}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Try Common "What Ifs"
          </h3>
          <p className="text-sm text-muted-foreground">
            Click any scenario below to see how it would impact your retirement plan. The changes are temporary and will overlay on your current projection.
          </p>
          <QuickScenarios />
        </div>
      </motion.div>

      {/* Shortfall Warning - stays at bottom or moves up if critical */}
      {hasShortfall && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Funds Projected to Run Out</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                {(() => {
                  const bankruptcyYear = result.years.find(y => y.totalPortfolio <= 0);
                  if (bankruptcyYear) {
                    return (
                      <>
                        Your retirement savings are projected to be depleted at age <strong>{bankruptcyYear.userAge}</strong>
                        {` (Year ${bankruptcyYear.year})`}.
                      </>
                    );
                  }
                  return 'Your savings may be depleted during retirement.';
                })()}
              </p>
              <p className="text-sm">
                <strong>Suggestions:</strong>
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                <li>Reduce annual spending by ${((inputs.currentExpenses * 0.1).toLocaleString())} (10%)</li>
                <li>Delay retirement by 2-3 years</li>
                <li>Increase savings contributions before retirement</li>
                <li>Consider part-time work in early retirement</li>
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Hidden for tabs now, can be removed or kept as detailed view */}
      <div className="hidden">
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Detailed Table</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <ResultsTable result={result} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Debug Panel - Only visible in development */}
      <DebugPanel />
    </motion.div>
  );
}
