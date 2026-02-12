import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SCENARIO_TEMPLATES, applyTemplate } from '@/lib/scenario-templates';

export function QuickScenarios() {
    const {
        inputs,
        updateInputs,
        runSim,
        result,
        saveScenario,
        toggleScenarioSelection,
        clearScenarioSelection
    } = useSimulation();

    const handleApplyTemplate = async (templateId: string) => {
        const template = SCENARIO_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        // Clear any existing selections first for a clean comparison
        clearScenarioSelection();

        let beforeName = '';

        // Step 1: Save current state as "Before" if we have results
        if (result) {
            beforeName = `Before: ${template.name}`;
            saveScenario(beforeName);

            // Auto-select it for comparison
            setTimeout(() => toggleScenarioSelection(beforeName), 150);
        }

        // Step 2: Apply the template
        const newInputs = applyTemplate(template, inputs);
        updateInputs(newInputs);

        // Step 3: Run simulation after 300ms
        setTimeout(async () => {
            await runSim();

            // Step 4: Ensure "Before" is selected for comparison against the new "Current"
            if (beforeName) {
                toggleScenarioSelection(beforeName);
            }
        }, 300);
    };

    const categories = [
        { key: 'retirement_age' as const, title: '🎯 Retirement Age', color: 'from-blue-500/10 to-blue-500/5' },
        { key: 'spending' as const, title: '💰 Spending Level', color: 'from-green-500/10 to-green-500/5' },
        { key: 'savings' as const, title: '📈 Savings Rate', color: 'from-orange-500/10 to-orange-500/5' },
    ];

    return (
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Quick "What If" Scenarios</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    Click any button to see instant before/after comparison
                </p>

                {categories.map((category) => {
                    const templates = SCENARIO_TEMPLATES.filter(t => t.category === category.key);
                    if (templates.length === 0) return null;

                    return (
                        <div key={category.key} className="space-y-3">
                            <h4 className="text-sm font-semibold text-foreground">{category.title}</h4>
                            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                                {templates.map((template) => (
                                    <motion.div
                                        key={template.id}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full justify-start gap-2 h-auto py-3 px-4 text-left hover:bg-primary/10 hover:border-primary transition-all"
                                            onClick={() => handleApplyTemplate(template.id)}
                                        >
                                            <span className="text-xl">{template.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm leading-tight">{template.name}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {template.description}
                                                    {template.modifier(inputs).retirementAge &&
                                                        ` ${template.modifier(inputs).retirementAge}`}
                                                </div>
                                            </div>
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <div className="border-t pt-4 space-y-2">
                    <p className="text-xs font-medium text-primary">
                        ⚡ Auto-Comparison Mode
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Each button automatically:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                        <li>• Saves your current plan as "Before"</li>
                        <li>• Applies the change to your active plan</li>
                        <li>• Compares "Before" vs New "Current" plan</li>
                    </ul>
                    <p className="text-xs text-primary/80 font-medium mt-2">
                        💡 Scroll down to see the before/after chart!
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
