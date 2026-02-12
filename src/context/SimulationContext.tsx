import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { SimulationInputs, SimulationResult, defaultInputs } from '@/types/simulation';
import { simulationService, mapFrontendToBackend, mapBackendToFrontend, BackendYearResult } from '@/services/simulation.service';

export interface SavedScenario {
  name: string;
  timestamp: Date;
  inputs: SimulationInputs;
  result: SimulationResult;
  rawBackendResults: BackendYearResult[];
}

interface SimulationContextType {
  inputs: SimulationInputs;
  updateInput: <K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) => void;
  updateInputs: (partial: Partial<SimulationInputs>) => void;
  result: SimulationResult | null;
  rawBackendResults: BackendYearResult[] | null;
  currentPhase: number;
  setCurrentPhase: (phase: number) => void;
  isSimulating: boolean;
  runSim: () => void;
  // Scenario management
  savedScenarios: Map<string, SavedScenario>;
  selectedScenarios: Set<string>;
  saveScenario: (name: string) => boolean;
  deleteScenario: (name: string) => void;
  toggleScenarioSelection: (name: string) => void;
  clearScenarioSelection: () => void;
  // Comparison
  baselineResult: SimulationResult | null;
  setBaseline: () => void;
  clearBaseline: () => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  // Load initial state from localStorage
  const [inputs, setInputs] = useState<SimulationInputs>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('simulation_inputs');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to load inputs', e);
        }
      }
    }
    return defaultInputs;
  });

  const [result, setResult] = useState<SimulationResult | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('simulation_result');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to load result', e);
        }
      }
    }
    return null;
  });

  const [rawBackendResults, setRawBackendResults] = useState<BackendYearResult[] | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Scenario management state
  const [savedScenarios, setSavedScenarios] = useState<Map<string, SavedScenario>>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('retirement_scenarios');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const map = new Map<string, SavedScenario>();
          Object.entries(parsed).forEach(([key, value]: [string, any]) => {
            map.set(key, {
              ...value,
              timestamp: new Date(value.timestamp)
            });
          });
          return map;
        } catch (e) {
          console.error('Failed to load scenarios', e);
        }
      }
    }
    return new Map();
  });

  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set());

  // Save scenarios to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && savedScenarios.size > 0) {
      const obj = Object.fromEntries(savedScenarios);
      localStorage.setItem('retirement_scenarios', JSON.stringify(obj));
    }
  }, [savedScenarios]);

  // Save inputs to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simulation_inputs', JSON.stringify(inputs));
    }
  }, [inputs]);

  // Save result to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && result) {
      localStorage.setItem('simulation_result', JSON.stringify(result));
    }
  }, [result]);

  const updateInput = useCallback(<K extends keyof SimulationInputs>(
    key: K,
    value: SimulationInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateInputs = useCallback((partial: Partial<SimulationInputs>) => {
    setInputs(prev => ({ ...prev, ...partial }));
  }, []);

  const runSim = useCallback(async () => {
    setIsSimulating(true);
    console.group('🚀 SIMULATION DEBUG');
    console.log('⏰ Started at:', new Date().toISOString());
    
    try {
      // Log frontend inputs
      console.group('📥 Frontend Inputs');
      console.table({
        'Age': inputs.currentAge,
        'Retirement Age': inputs.retirementAge,
        'Life Expectancy': inputs.lifeExpectancy,
        'Annual Salary': inputs.currentSalary,
        'Spouse Salary': inputs.spouseSalary || 0,
        'Annual Spending': inputs.currentExpenses,
        'Tax Filing': inputs.taxFilingStatus,
      });
      console.log('Full inputs:', inputs);
      console.groupEnd();

      // Map to backend format
      const backendParams = mapFrontendToBackend(inputs);
      
      // Log backend params
      console.group('📤 Backend Request Payload');
      console.table({
        'P1 Age': backendParams.p1_start_age,
        'P2 Age': backendParams.p2_start_age,
        'End Age': backendParams.end_simulation_age,
        'P1 Salary': backendParams.p1_employment_income,
        'P2 Salary': backendParams.p2_employment_income,
        'Spending Goal': backendParams.annual_spend_goal,
        'Inflation': (backendParams.inflation_rate * 100).toFixed(2) + '%',
        'Growth Rate': (backendParams.growth_rate_pretax_p1 * 100).toFixed(2) + '%',
      });
      console.log('Account Balances:', {
        'Taxable': backendParams.bal_taxable,
        'P1 Pre-Tax': backendParams.bal_pretax_p1,
        'P2 Pre-Tax': backendParams.bal_pretax_p2,
        'P1 Roth': backendParams.bal_roth_p1,
        'P2 Roth': backendParams.bal_roth_p2,
      });
      console.log('Full backend params:', backendParams);
      console.groupEnd();

      // Call backend
      console.log('🌐 Calling backend API...');
      const response = await simulationService.runSimulation(backendParams);

      // Log response
      console.group('✅ Backend Response');
      console.log('Success:', response.success);
      console.log('Results count:', response.results?.length || 0);
      if (response.results && response.results.length > 0) {
        console.log('First year:', response.results[0]);
        console.log('Last year:', response.results[response.results.length - 1]);
        
        // Summary stats
        const finalYear = response.results[response.results.length - 1];
        console.table({
          'Starting Net Worth': response.results[0].Net_Worth.toLocaleString(),
          'Final Net Worth': finalYear.Net_Worth.toLocaleString(),
          'Final Age': finalYear.P1_Age,
          'Years Simulated': response.results.length,
        });
      }
      console.groupEnd();

      if (response && response.results) {
        setRawBackendResults(response.results);
        const frontendResult = mapBackendToFrontend(response.results, inputs);
        
        // Log mapped frontend result
        console.group('🎯 Mapped Frontend Result');
        console.log('Success Probability:', frontendResult.successProbability + '%');
        console.log('Total Legacy:', frontendResult.totalLegacy?.toLocaleString());
        console.log('FI Age:', frontendResult.financialIndependenceAge);
        console.log('Shortfall Years:', frontendResult.shortfallYears?.length || 0);
        console.log('Years data:', frontendResult.years.length);
        console.groupEnd();
        
        setResult(frontendResult);
        console.log('✅ Simulation completed successfully');
      }
    } catch (error) {
      console.group('❌ SIMULATION ERROR');
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.groupEnd();
      
      // Show error to user instead of falling back to mock data
      alert('Unable to connect to backend server. Please make sure the backend is running at http://localhost:5050.\n\nTo start the backend:\ncd piumal_one/tax-pensions-backend\npip install -r requirements.txt\nuvicorn main:app --host 0.0.0.0 --port 5050 --reload');
    } finally {
      setIsSimulating(false);
      console.log('⏰ Finished at:', new Date().toISOString());
      console.groupEnd();
    }
  }, [inputs]);

  const saveScenario = useCallback((name: string): boolean => {
    if (!result || !rawBackendResults) {
      console.warn('Cannot save scenario: no simulation results available');
      return false;
    }

    if (savedScenarios.size >= 5 && !savedScenarios.has(name)) {
      console.warn('Maximum 5 scenarios allowed');
      return false;
    }

    const scenario: SavedScenario = {
      name,
      timestamp: new Date(),
      inputs: { ...inputs },
      result,
      rawBackendResults
    };

    setSavedScenarios(prev => new Map(prev).set(name, scenario));
    return true;
  }, [inputs, result, rawBackendResults, savedScenarios]);

  const deleteScenario = useCallback((name: string) => {
    setSavedScenarios(prev => {
      const next = new Map(prev);
      next.delete(name);
      return next;
    });
    setSelectedScenarios(prev => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const toggleScenarioSelection = useCallback((name: string) => {
    setSelectedScenarios(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else if (next.size < 3) { // Max 3 scenarios for comparison
        next.add(name);
      }
      return next;
    });
  }, []);

  const clearScenarioSelection = useCallback(() => {
    setSelectedScenarios(new Set());
  }, []);

  // Comparison Baseline
  const [baselineResult, setBaselineResult] = useState<SimulationResult | null>(null);

  const setBaseline = useCallback(() => {
    if (result) {
      setBaselineResult(result);
    }
  }, [result]);

  const clearBaseline = useCallback(() => {
    setBaselineResult(null);
  }, []);

  const value = useMemo(() => ({
    inputs,
    updateInput,
    updateInputs,
    result,
    rawBackendResults,
    currentPhase,
    setCurrentPhase,
    isSimulating,
    runSim,
    savedScenarios,
    selectedScenarios,
    saveScenario,
    deleteScenario,
    toggleScenarioSelection,
    clearScenarioSelection,
    // Comparison
    baselineResult,
    setBaseline,
    clearBaseline,
  }), [
    inputs,
    updateInput,
    updateInputs,
    result,
    rawBackendResults,
    currentPhase,
    isSimulating,
    runSim,
    savedScenarios,
    selectedScenarios,
    saveScenario,
    deleteScenario,
    toggleScenarioSelection,
    clearScenarioSelection,
    baselineResult,
    setBaseline,
    clearBaseline,
  ]);

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
}
