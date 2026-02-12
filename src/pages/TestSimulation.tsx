import { useState } from "react";
import { simulationService, SimulationParams } from "@/services/simulation.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TestSimulation() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // minimal default params for testing
    const [formData, setFormData] = useState<SimulationParams>({
        p1_start_age: 60,
        p2_start_age: 58,
        end_simulation_age: 95,
        inflation_rate: 2.5,
        annual_spend_goal: 100000,
        p1_employment_income: 150000,
        p1_employment_until_age: 65,
        p2_employment_income: 80000,
        p2_employment_until_age: 62,
        p1_ss_amount: 30000,
        p1_ss_start_age: 70,
        p2_ss_amount: 20000,
        p2_ss_start_age: 67,
        p1_pension: 0,
        p1_pension_start_age: 65,
        p2_pension: 0,
        p2_pension_start_age: 65,
        bal_taxable: 500000,
        bal_pretax_p1: 1000000,
        bal_pretax_p2: 800000,
        bal_roth_p1: 100000,
        bal_roth_p2: 50000,
        growth_rate_taxable: 6.0,
        growth_rate_pretax_p1: 7.0,
        growth_rate_pretax_p2: 7.0,
        growth_rate_roth_p1: 7.5,
        growth_rate_roth_p2: 7.5,
        taxable_basis_ratio: 0.8,
        target_tax_bracket_rate: 24.0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleRun = async () => {
        setLoading(true);
        try {
            const res = await simulationService.runSimulation(formData);
            setResult(res);
            toast.success("Simulation ran successfully!");
        } catch (err) {
            toast.error("Simulation failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>API Connection Test: Run Simulation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">P1 Start Age</label>
                            <Input name="p1_start_age" type="number" value={formData.p1_start_age} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Annual Spend Goal</label>
                            <Input name="annual_spend_goal" type="number" value={formData.annual_spend_goal} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">P1 Pre-Tax Balance</label>
                            <Input name="bal_pretax_p1" type="number" value={formData.bal_pretax_p1} onChange={handleChange} />
                        </div>
                    </div>

                    <Button onClick={handleRun} disabled={loading}>
                        {loading ? "Running..." : "Test API Connection"}
                    </Button>
                </CardContent>
            </Card>

            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Results (First 3 Years)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[400px] text-xs">
                            {JSON.stringify(result.results.slice(0, 3), null, 2)}
                        </pre>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Total Rows: {result.results.length} | Net Worth Year 1: {result.results[0]?.Net_Worth}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
