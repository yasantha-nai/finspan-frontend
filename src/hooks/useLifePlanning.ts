import { useState, useCallback, useMemo, useRef } from 'react';
import { LifeEvent, WealthDataPoint, LifeInsights, EVENT_CONFIGS, LifeEventType, INCOME_VALUES, COST_MULTIPLIERS } from '@/types/life-planning';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultEvents = (): LifeEvent[] => [
  {
    id: generateId(),
    type: 'job',
    name: 'First Job',
    icon: EVENT_CONFIGS.job.icon,
    startAge: 22,
    color: EVENT_CONFIGS.job.color,
    params: { incomeLevel: 'moderate', stability: 'stable' }
  },
  {
    id: generateId(),
    type: 'rent',
    name: 'Renting',
    icon: EVENT_CONFIGS.rent.icon,
    startAge: 22,
    endAge: 32,
    color: EVENT_CONFIGS.rent.color,
    params: { costLevel: 'moderate' }
  },
  {
    id: generateId(),
    type: 'retirement',
    name: 'Retirement',
    icon: EVENT_CONFIGS.retirement.icon,
    startAge: 65,
    color: EVENT_CONFIGS.retirement.color,
    params: { lifestyleLevel: 'moderate' }
  }
];

// Helper to get numeric value from qualitative param
const getIncomeValue = (level: string): number => {
  return INCOME_VALUES[level as keyof typeof INCOME_VALUES] || INCOME_VALUES.moderate;
};

const getCostMultiplier = (level: string): number => {
  return COST_MULTIPLIERS[level as keyof typeof COST_MULTIPLIERS] || 1;
};

const BASE_COSTS = {
  education: 40000,
  rent: 18000,
  home: 400000,
  children: 15000,
  health: { minor: 5000, moderate: 25000, major: 80000 },
  business: { small: 10000, moderate: 50000, large: 150000 },
  retirement: { frugal: 36000, moderate: 60000, generous: 96000 },
  'family-support': { small: 6000, moderate: 15000, significant: 30000 },
};

interface HistoryEntry {
  events: LifeEvent[];
  timestamp: number;
}

export function useLifePlanning() {
  const [currentAge, setCurrentAge] = useState(30);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  const [events, setEvents] = useState<LifeEvent[]>(createDefaultEvents);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastExplanation, setLastExplanation] = useState<string>('');

  const historyRef = useRef<HistoryEntry[]>([]);

  // Save to history before making changes
  const saveToHistory = useCallback(() => {
    const entry = { events: JSON.parse(JSON.stringify(events)), timestamp: Date.now() };
    historyRef.current = [...historyRef.current.slice(-19), entry];
    setHistory(historyRef.current);
  }, [events]);

  const undo = useCallback(() => {
    if (historyRef.current.length > 0) {
      const lastEntry = historyRef.current.pop();
      if (lastEntry) {
        setEvents(lastEntry.events);
        setHistory([...historyRef.current]);
        setLastExplanation("↩️ Change undone");
      }
    }
  }, []);

  const reset = useCallback(() => {
    saveToHistory();
    setEvents(createDefaultEvents());
    setCurrentAge(30);
    setLastExplanation("🔄 Reset to a fresh start");
  }, [saveToHistory]);

  const calculateWealth = useCallback((events: LifeEvent[]): WealthDataPoint[] => {
    const data: WealthDataPoint[] = [];
    let taxable = 10000; // Start with small savings
    let taxDeferred = 0;
    let roth = 0;

    for (let age = 18; age <= 95; age++) {
      let income = 0;
      let expenses = 12000; // Base living expenses
      let isWorking = false;
      let isRetired = false;
      let hasPartner = false;

      // Process events
      events.forEach(event => {
        const eventActive = age >= event.startAge && (!event.endAge || age <= event.endAge);
        const eventStarted = age >= event.startAge;

        switch (event.type) {
          case 'education':
            if (eventActive) {
              const baseCost = BASE_COSTS.education;
              const multiplier = getCostMultiplier(String(event.params.costLevel || 'moderate'));
              expenses += (baseCost * multiplier) / 4; // Spread over 4 years
            }
            break;

          case 'job':
            if (eventStarted && !isRetired) {
              const baseIncome = getIncomeValue(String(event.params.incomeLevel || 'moderate'));
              const yearsWorking = age - event.startAge;
              income += baseIncome * Math.pow(1.025, yearsWorking); // 2.5% annual growth
              isWorking = true;
            }
            break;

          case 'job-change':
            if (eventStarted && !isRetired) {
              const direction = String(event.params.direction || 'same');
              const directionMultiplier = direction === 'up' ? 1.2 : direction === 'down' ? 0.8 : 1;
              const baseIncome = getIncomeValue(String(event.params.incomeLevel || 'moderate'));
              income = baseIncome * directionMultiplier;
              isWorking = true;
            }
            break;

          case 'job-loss':
            if (eventActive) {
              income = 0;
              isWorking = false;
              if (!event.params.hasEmergencyFund) {
                expenses += 5000; // Additional stress costs
              }
            }
            break;

          case 'side-hustle':
            if (eventActive && !isRetired) {
              const baseIncome = getIncomeValue(String(event.params.incomeLevel || 'low'));
              income += baseIncome * 0.3; // Side income is partial
            }
            break;

          case 'rent':
            if (eventActive) {
              const baseCost = BASE_COSTS.rent;
              const multiplier = getCostMultiplier(String(event.params.costLevel || 'moderate'));
              expenses += baseCost * multiplier;
            }
            break;

          case 'marriage':
            if (eventStarted) {
              hasPartner = true;
              const partnerLevel = String(event.params.partnerIncomeLevel || 'moderate');
              if (partnerLevel !== 'none') {
                const partnerIncome = getIncomeValue(partnerLevel);
                income += partnerIncome * (isRetired ? 0 : 0.8);
              }
              // Shared expenses benefit
              expenses *= 0.85;
            }
            break;

          case 'home':
            if (age === event.startAge) {
              const multiplier = getCostMultiplier(String(event.params.costLevel || 'expensive'));
              const homePrice = BASE_COSTS.home * multiplier;
              const downPayment = event.params.hasGoodSavings ? homePrice * 0.2 : homePrice * 0.1;
              taxable -= downPayment;
            }
            if (eventStarted) {
              const multiplier = getCostMultiplier(String(event.params.costLevel || 'expensive'));
              const homePrice = BASE_COSTS.home * multiplier;
              expenses += homePrice * 0.06; // Simplified annual housing cost
            }
            break;

          case 'children':
            if (eventActive) {
              const count = Number(event.params.count) || 1;
              const multiplier = getCostMultiplier(String(event.params.costLevel || 'moderate'));
              expenses += BASE_COSTS.children * count * multiplier;
            }
            break;

          case 'career-break':
            if (eventActive) {
              income = 0;
              isWorking = false;
              if (!event.params.hasSavings) {
                expenses += 3000; // Extra costs without savings
              }
            }
            break;

          case 'retirement':
            if (eventStarted) {
              isRetired = true;
              isWorking = false;
              const lifestyleLevel = String(event.params.lifestyleLevel || 'moderate');
              const retirementCosts = BASE_COSTS.retirement[lifestyleLevel as keyof typeof BASE_COSTS.retirement] || BASE_COSTS.retirement.moderate;
              expenses = retirementCosts + (hasPartner ? retirementCosts * 0.6 : 0);
            }
            break;

          case 'health':
            if (age === event.startAge) {
              const severity = String(event.params.severity || 'moderate');
              const baseCost = BASE_COSTS.health[severity as keyof typeof BASE_COSTS.health] || BASE_COSTS.health.moderate;
              const insuranceMultiplier = event.params.hasInsurance ? 0.3 : 1;
              expenses += baseCost * insuranceMultiplier;
            }
            break;

          case 'business':
            if (age === event.startAge) {
              const investmentLevel = String(event.params.investmentLevel || 'moderate');
              const investment = BASE_COSTS.business[investmentLevel as keyof typeof BASE_COSTS.business] || BASE_COSTS.business.moderate;
              taxable -= investment;
            }
            if (eventStarted && age < event.startAge + 3) {
              // Early years - no income
              income = 0;
            } else if (eventStarted && age >= event.startAge + 3 && !isRetired) {
              const riskLevel = String(event.params.riskLevel || 'moderate');
              const riskMultiplier = riskLevel === 'high' ? 1.5 : riskLevel === 'low' ? 0.7 : 1;
              const investmentLevel = String(event.params.investmentLevel || 'moderate');
              const baseReturn = BASE_COSTS.business[investmentLevel as keyof typeof BASE_COSTS.business] || 50000;
              income += baseReturn * riskMultiplier * 1.5;
              isWorking = true;
            }
            break;

          case 'move':
            if (eventStarted) {
              const costChange = String(event.params.costChange || 'same');
              const multiplier = getCostMultiplier(costChange);
              expenses *= multiplier;
            }
            break;

          case 'family-support':
            if (eventActive) {
              const amount = String(event.params.amount || 'moderate');
              const supportCost = BASE_COSTS['family-support'][amount as keyof typeof BASE_COSTS['family-support']] || BASE_COSTS['family-support'].moderate;
              expenses += supportCost;
            }
            break;
        }
      });

      // Calculate savings and investments
      const netIncome = income - expenses;
      const cashFlow = netIncome / 12;

      if (isWorking && netIncome > 0) {
        const savings = netIncome * 0.25;
        taxDeferred += savings * 0.4;
        roth += savings * 0.2;
        taxable += savings * 0.4 + (netIncome - savings);
      } else if (netIncome > 0) {
        taxable += netIncome * 0.5;
      } else {
        // Draw from savings proportionally
        const deficit = Math.abs(netIncome);
        const total = taxable + taxDeferred + roth;
        if (total > 0) {
          const drawRatio = Math.min(1, deficit / total);
          taxable = Math.max(0, taxable * (1 - drawRatio));
          taxDeferred = Math.max(0, taxDeferred * (1 - drawRatio));
          roth = Math.max(0, roth * (1 - drawRatio));
        }
      }

      // Investment growth
      const growthRate = 1.055; // 5.5% growth
      taxable *= growthRate;
      taxDeferred *= growthRate;
      roth *= growthRate;

      const total = taxable + taxDeferred + roth;

      let riskLevel: 'safe' | 'caution' | 'aware' = 'safe';
      if (cashFlow < -500) {
        riskLevel = 'aware';
      } else if (cashFlow < 500) {
        riskLevel = 'caution';
      }

      data.push({
        age,
        taxable: Math.max(0, Math.round(taxable)),
        taxDeferred: Math.max(0, Math.round(taxDeferred)),
        roth: Math.max(0, Math.round(roth)),
        total: Math.max(0, Math.round(total)),
        cashFlow: Math.round(cashFlow),
        riskLevel
      });
    }

    return data;
  }, []);

  const wealthData = useMemo(() => calculateWealth(events), [events, calculateWealth]);

  const insights = useMemo((): LifeInsights => {
    const currentData = wealthData.find(d => d.age === currentAge) || wealthData[0];

    // Calculate stress level more gently
    const maxWealth = Math.max(...wealthData.map(d => d.total));
    const wealthRatio = maxWealth > 0 ? currentData.total / maxWealth : 0.5;

    let stressLevel = 30; // Base stress
    if (currentData.cashFlow < 0) stressLevel += 40;
    else if (currentData.cashFlow < 1000) stressLevel += 20;
    stressLevel += (1 - wealthRatio) * 20;

    // Find retirement age
    const retirementEvent = events.find(e => e.type === 'retirement');
    const retirementAge = retirementEvent?.startAge || 65;

    return {
      netWorth: currentData.total,
      monthlyCashFlow: currentData.cashFlow,
      stressLevel: Math.min(100, Math.max(0, Math.round(stressLevel))),
      riskLevel: currentData.riskLevel,
      retirementAge,
      explanation: lastExplanation
    };
  }, [wealthData, currentAge, events, lastExplanation]);

  const addEvent = useCallback((type: LifeEventType, startAge: number) => {
    saveToHistory();
    const config = EVENT_CONFIGS[type];
    const newEvent: LifeEvent = {
      id: generateId(),
      type,
      name: config.label,
      icon: config.icon,
      startAge,
      color: config.color,
      params: { ...config.defaultParams }
    };

    // Set duration for certain event types
    if (['rent', 'children', 'job-loss', 'career-break', 'family-support'].includes(type)) {
      newEvent.endAge = startAge + (type === 'children' ? 18 : type === 'job-loss' ? 1 : 5);
    }

    setEvents(prev => [...prev, newEvent]);

    // Generate explanation
    const explanations: Record<string, string> = {
      job: "💼 Added work - this brings in income!",
      'job-change': "🔄 Job change affects your income trajectory",
      'job-loss': "⏸️ Work gap - you'll draw from savings during this time",
      home: "🏠 Buying a home is a big commitment - watch your savings dip",
      children: "👶 Kids bring joy and costs - expenses go up for about 18 years",
      retirement: "🌴 Retirement age set - income stops, savings start to decrease",
      health: "❤️ Health costs can impact your savings",
      business: "🚀 Starting a business takes investment upfront",
    };
    setLastExplanation(explanations[type] || `Added ${config.label} to your timeline`);
  }, [saveToHistory]);

  const updateEvent = useCallback((id: string, updates: Partial<LifeEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const removeEvent = useCallback((id: string) => {
    saveToHistory();
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (event) {
      setLastExplanation(`Removed ${event.name} from your timeline`);
    }
  }, [events, saveToHistory]);

  const moveEvent = useCallback((id: string, newStartAge: number) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const duration = e.endAge ? e.endAge - e.startAge : 0;
      return {
        ...e,
        startAge: newStartAge,
        endAge: e.endAge ? newStartAge + duration : undefined
      };
    }));
  }, []);

  return {
    currentAge,
    setCurrentAge,
    lifeExpectancy,
    setLifeExpectancy,
    events,
    wealthData,
    insights,
    addEvent,
    updateEvent,
    removeEvent,
    moveEvent,
    undo,
    reset,
    canUndo: history.length > 0,
  };
}
