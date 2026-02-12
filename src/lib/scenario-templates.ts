import { SimulationInputs } from '@/types/simulation';

export interface ScenarioTemplate {
    id: string;
    name: string;
    description: string;
    category: 'retirement_age' | 'spending' | 'savings';
    icon: string;
    modifier: (currentInputs: SimulationInputs) => Partial<SimulationInputs>;
}

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
    // Retirement Age Templates
    {
        id: 'retire_2_earlier',
        name: 'Retire 2 Years Earlier',
        description: 'What if I retire at age',
        category: 'retirement_age',
        icon: '🏖️',
        modifier: (inputs) => ({
            retirementAge: inputs.retirementAge - 2,
        }),
    },
    {
        id: 'retire_2_later',
        name: 'Work 2 More Years',
        description: 'What if I work until age',
        category: 'retirement_age',
        icon: '💼',
        modifier: (inputs) => ({
            retirementAge: inputs.retirementAge + 2,
        }),
    },
    {
        id: 'retire_at_67',
        name: 'Retire at Full SS Age (67)',
        description: 'Traditional retirement age',
        category: 'retirement_age',
        icon: '📅',
        modifier: () => ({
            retirementAge: 67,
        }),
    },

    // Spending Templates
    {
        id: 'reduce_spending_10',
        name: 'Cut Spending 10%',
        description: 'Live more frugally',
        category: 'spending',
        icon: '💰',
        modifier: (inputs) => ({
            currentExpenses: Math.round(inputs.currentExpenses * 0.9),
        }),
    },
    {
        id: 'reduce_spending_20',
        name: 'Cut Spending 20%',
        description: 'Major lifestyle reduction',
        category: 'spending',
        icon: '🔻',
        modifier: (inputs) => ({
            currentExpenses: Math.round(inputs.currentExpenses * 0.8),
        }),
    },
    {
        id: 'increase_spending_20',
        name: 'Spend 20% More',
        description: 'Upgrade lifestyle',
        category: 'spending',
        icon: '✨',
        modifier: (inputs) => ({
            currentExpenses: Math.round(inputs.currentExpenses * 1.2),
        }),
    },

    // Savings Templates
    {
        id: 'save_500_more',
        name: 'Save $500/Month More',
        description: 'Boost retirement savings now',
        category: 'savings',
        icon: '📈',
        modifier: (inputs) => ({
            contribDeferred: inputs.contribDeferred + 500,
        }),
    },
    {
        id: 'save_1000_more',
        name: 'Save $1,000/Month More',
        description: 'Aggressive savings mode',
        category: 'savings',
        icon: '🚀',
        modifier: (inputs) => ({
            contribDeferred: inputs.contribDeferred + 1000,
        }),
    },
];

export function getTemplatesByCategory(category: ScenarioTemplate['category']): ScenarioTemplate[] {
    return SCENARIO_TEMPLATES.filter(t => t.category === category);
}

export function applyTemplate(template: ScenarioTemplate, currentInputs: SimulationInputs): SimulationInputs {
    const modifications = template.modifier(currentInputs);
    return { ...currentInputs, ...modifications };
}
