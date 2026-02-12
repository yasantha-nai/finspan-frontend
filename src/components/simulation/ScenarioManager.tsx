import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, CheckCircle2, Camera } from 'lucide-react';
import { useSimulation } from '@/context/SimulationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/simulation-engine';
import { cn } from '@/lib/utils';

export function ScenarioManager() {
    const {
        savedScenarios,
        selectedScenarios,
        saveScenario,
        deleteScenario,
        toggleScenarioSelection,
        result,
        inputs,
    } = useSimulation();



    const handleSave = () => {
        if (!result) return;

        // Auto-generate name: "Age 65 | $85k/yr"
        const baseName = `Age ${inputs.retirementAge} | $${(inputs.currentExpenses / 1000).toFixed(0)}k/yr`;
        let finalName = baseName;
        let counter = 2;

        // Ensure uniqueness
        while (savedScenarios.has(finalName)) {
            finalName = `${baseName} (${counter})`;
            counter++;
        }

        const success = saveScenario(finalName);
        if (success) {
            // Optional: Auto-select it
            setTimeout(() => toggleScenarioSelection(finalName), 100);
        } else {
            // ideally show toast, for now alert is fine as fallback
            alert('Limit reached: Maximum 5 scenarios allowed. Please delete one first.');
        }
    };

    const handleQuickSnapshot = () => {
        if (!result) return;

        // Auto-generate name: "Age 65 | $85k/yr"
        const baseName = `Age ${inputs.retirementAge} | $${(inputs.currentExpenses / 1000).toFixed(0)}k/yr`;
        let finalName = baseName;
        let counter = 2;

        // Ensure uniqueness
        while (savedScenarios.has(finalName)) {
            finalName = `${baseName} (${counter})`;
            counter++;
        }

        const success = saveScenario(finalName);
        if (success) {
            // Optional: Auto-select it
            setTimeout(() => toggleScenarioSelection(finalName), 100);
        } else {
            alert('Limit reached: Maximum 5 scenarios allowed. Please delete one first.');
        }
    };

    const scenariosArray = Array.from(savedScenarios.values()).sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    return (
        <div className="space-y-4">
            {/* Save Button */}
            <Button
                onClick={handleSave}
                disabled={!result}
                className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
            >
                <Camera className="w-4 h-4" />
                Snapshot Scenario
            </Button>

            {/* Saved Scenarios List */}
            {scenariosArray.length > 0 && (
                <Card>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">
                                Saved Scenarios ({scenariosArray.length}/5)
                            </h4>
                            {selectedScenarios.size > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    {selectedScenarios.size} selected for comparison
                                </p>
                            )}
                        </div>

                        <AnimatePresence>
                            {scenariosArray.map((scenario) => {
                                const isSelected = selectedScenarios.has(scenario.name);
                                const retirementYear = scenario.result.years.find(
                                    y => y.userAge === scenario.inputs.retirementAge
                                );

                                return (
                                    <motion.div
                                        key={scenario.name}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={cn(
                                            'flex items-start gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer',
                                            isSelected
                                                ? 'bg-secondary/10 border-secondary'
                                                : 'bg-muted/30 border-muted hover:border-muted-foreground/30'
                                        )}
                                        onClick={() => toggleScenarioSelection(scenario.name)}
                                    >
                                        {/* Checkbox */}
                                        <div className={cn(
                                            'w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5',
                                            isSelected
                                                ? 'bg-secondary border-secondary'
                                                : 'border-muted-foreground/30'
                                        )}>
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-secondary-foreground" />}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-medium text-sm truncate">{scenario.name}</h5>
                                                    <p className="text-xs text-muted-foreground">
                                                        {scenario.timestamp.toLocaleDateString()} at{' '}
                                                        {scenario.timestamp.toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteScenario(scenario.name);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="text-muted-foreground">Success: </span>
                                                    <span className="font-medium">
                                                        {scenario.result.successProbability.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">At Retirement: </span>
                                                    <span className="font-medium tabular-nums">
                                                        {formatCurrency(retirementYear?.totalPortfolio ?? 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {selectedScenarios.size >= 3 && (
                            <p className="text-xs text-warning">
                                ⚠️ Maximum 3 scenarios can be compared at once
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}


        </div>
    );
}
