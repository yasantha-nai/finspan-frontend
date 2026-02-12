import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/simulation-engine";
import { SimulationResult } from "@/types/simulation";

interface ResultsTableProps {
    result: SimulationResult;
}

export function ResultsTable({ result }: ResultsTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detailed Projection Data</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="networth" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="networth">Net Worth & Balances</TabsTrigger>
                        <TabsTrigger value="income">Income & Spending</TabsTrigger>
                    </TabsList>

                    <TabsContent value="networth">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead className="text-right">Net Worth</TableHead>
                                        <TableHead className="text-right">Pre-Tax (401k/IRA)</TableHead>
                                        <TableHead className="text-right">Roth</TableHead>
                                        <TableHead className="text-right">Taxable</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {result.years.map((year) => (
                                        <TableRow key={year.year}>
                                            <TableCell>{year.userAge}</TableCell>
                                            <TableCell>{year.year}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(year.totalPortfolio)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(year.deferredBalance)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(year.rothBalance)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(year.taxableBalance)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="income">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead className="text-right">Total Income</TableHead>
                                        <TableHead className="text-right">Spending Goal</TableHead>
                                        <TableHead className="text-right">Taxes Paid</TableHead>
                                        <TableHead className="text-right">Shortfall</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {result.years.map((year) => {
                                        const gapMagnitude = Math.abs(Math.min(0, year.netSurplusGap));
                                        const withdrawals = year.drawTaxable + year.drawDeferred + year.drawRoth;
                                        const unfundedAmount = Math.max(0, gapMagnitude - withdrawals);
                                        const isShortfall = unfundedAmount > 1; // Allow for rounding errors

                                        return (
                                            <TableRow key={year.year}>
                                                <TableCell>{year.userAge}</TableCell>
                                                <TableCell>{year.year}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(year.grossIncome)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(year.totalSpend)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(year.totalTax)}
                                                </TableCell>
                                                <TableCell className={`text-right ${isShortfall ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                                                    {isShortfall ? formatCurrency(unfundedAmount) : '-'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
