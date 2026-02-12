import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSimulation } from '@/context/SimulationContext';
import { Bug, ChevronDown, ChevronUp } from 'lucide-react';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { inputs, result, rawBackendResults } = useSimulation();

  if (import.meta.env.PROD) return null; // Only show in development

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg border-2 border-orange-500">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-sm">Debug Info</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-6 w-6 p-0"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>

        {isOpen && (
          <div className="space-y-2 text-xs font-mono">
            {/* Validation Warnings */}
            {(() => {
              const totalSavings = (inputs.taxDeferredSavings || 0) + (inputs.taxFreeSavings || 0) + (inputs.taxableSavings || 0) + 
                                   (inputs.spouseTaxDeferredSavings || 0) + (inputs.spouseTaxFreeSavings || 0) + (inputs.spouseTaxableSavings || 0);
              const totalIncome = (inputs.currentSalary || 0) + (inputs.spouseSalary || 0);
              const warnings = [];
              
              if (totalSavings === 0) warnings.push('⚠️ No savings entered!');
              if ((inputs.currentExpenses || 0) > totalIncome) warnings.push('⚠️ Expenses exceed income!');
              
              return warnings.length > 0 ? (
                <div className="border-t pt-2">
                  <div className="font-semibold mb-1 text-red-600">Warnings:</div>
                  <div className="bg-red-50 border border-red-200 p-2 rounded space-y-1">
                    {warnings.map((w, i) => <div key={i} className="text-red-700">{w}</div>)}
                  </div>
                </div>
              ) : null;
            })()}

            <div className="border-t pt-2">
              <div className="font-semibold mb-1">Frontend Inputs:</div>
              <div className="bg-gray-50 p-2 rounded max-h-40 overflow-y-auto">
                <div>Age: {inputs.currentAge} → {inputs.lifeExpectancy}</div>
                <div>Salary: ${inputs.currentSalary?.toLocaleString()}</div>
                <div>Expenses: ${inputs.currentExpenses?.toLocaleString()}</div>
                <div className={inputs.taxDeferredSavings === 0 ? 'text-red-600' : ''}>
                  Tax-Deferred: ${inputs.taxDeferredSavings?.toLocaleString() || 0}
                </div>
                <div className={inputs.taxFreeSavings === 0 ? 'text-red-600' : ''}>
                  Roth: ${inputs.taxFreeSavings?.toLocaleString() || 0}
                </div>
                <div className={inputs.taxableSavings === 0 ? 'text-red-600' : ''}>
                  Taxable: ${inputs.taxableSavings?.toLocaleString() || 0}
                </div>
                {inputs.taxFilingStatus === 'married_joint' && (
                  <>
                    <div className="text-purple-600 font-semibold mt-1">Spouse:</div>
                    <div>Salary: ${inputs.spouseSalary?.toLocaleString() || 0}</div>
                    <div>Tax-Deferred: ${inputs.spouseTaxDeferredSavings?.toLocaleString() || 0}</div>
                    <div>Roth: ${inputs.spouseTaxFreeSavings?.toLocaleString() || 0}</div>
                  </>
                )}
              </div>
            </div>

            {result && (
              <div className="border-t pt-2">
                <div className="font-semibold mb-1">Simulation Result:</div>
                <div className="bg-green-50 p-2 rounded">
                  <div>Years: {result.years?.length || 0}</div>
                  <div>Success: {result.successProbability?.toFixed(1)}%</div>
                  <div>Final: ${result.totalLegacy?.toLocaleString()}</div>
                  {result.shortfallYears && result.shortfallYears.length > 0 && (
                    <div className="text-red-600">
                      Shortfall: {result.shortfallYears.length} years
                    </div>
                  )}
                </div>
              </div>
            )}

            {rawBackendResults && (
              <div className="border-t pt-2">
                <div className="font-semibold mb-1">Backend Data:</div>
                <div className="bg-blue-50 p-2 rounded">
                  <div>Records: {rawBackendResults.length}</div>
                  <div>First Year: {rawBackendResults[0]?.Year}</div>
                  <div>Last Year: {rawBackendResults[rawBackendResults.length - 1]?.Year}</div>
                </div>
              </div>
            )}

            <div className="border-t pt-2 text-orange-600">
              💡 Check browser console (F12) for detailed logs
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
