export interface LifeEvent {
  id: string;
  type: LifeEventType;
  name: string;
  icon: string;
  startAge: number;
  endAge?: number;
  color: string;
  params: Record<string, number | string | boolean>;
}

export type LifeEventType =
  | 'education'
  | 'job'
  | 'job-change'
  | 'job-loss'
  | 'side-hustle'
  | 'marriage'
  | 'rent'
  | 'home'
  | 'children'
  | 'career-break'
  | 'business'
  | 'retirement'
  | 'health'
  | 'move'
  | 'family-support'
  | 'car'
  | 'vacation'
  | 'one-time-expense'
  | 'insurance';

// Qualitative levels for easy user choices
export type IncomeLevel = 'low' | 'moderate' | 'good' | 'high';
export type CostLevel = 'cheaper' | 'same' | 'expensive' | 'very-expensive';
export type Direction = 'up' | 'same' | 'down';

export const INCOME_VALUES: Record<IncomeLevel, number> = {
  low: 35000,
  moderate: 55000,
  good: 85000,
  high: 130000,
};

export const COST_MULTIPLIERS: Record<CostLevel, number> = {
  cheaper: 0.7,
  same: 1.0,
  expensive: 1.3,
  'very-expensive': 1.7,
};

export interface WealthDataPoint {
  age: number;
  taxable: number;
  taxDeferred: number;
  roth: number;
  total: number;
  cashFlow: number;
  riskLevel: 'safe' | 'caution' | 'aware';
}

export interface LifeInsights {
  netWorth: number;
  monthlyCashFlow: number;
  stressLevel: number; // 0-100
  riskLevel: 'safe' | 'caution' | 'aware';
  retirementAge: number;
  explanation?: string;
}

export const EVENT_CONFIGS: Record<LifeEventType, {
  icon: string;
  label: string;
  color: string;
  description: string;
  defaultParams: Record<string, number | string | boolean>;
}> = {
  education: {
    icon: 'solar:mortarboard-bold-duotone',
    label: 'Education',
    color: 'hsl(220, 70%, 60%)',
    description: 'College, grad school, or training',
    defaultParams: { tuition: 40000, durationYears: 4, hasAid: false }
  },
  job: {
    icon: 'solar:briefcase-bold-duotone',
    label: 'Start Working',
    color: 'hsl(150, 50%, 45%)',
    description: 'Your first or main job',
    defaultParams: { salary: 55000, annualRaise: 3 }
  },
  'job-change': {
    icon: 'solar:refresh-circle-bold-duotone',
    label: 'Job Change',
    color: 'hsl(200, 55%, 50%)',
    description: 'Switch to a different job',
    defaultParams: { newSalary: 75000, annualRaise: 3, hasSigningBonus: false, signingBonus: 10000 }
  },
  'job-loss': {
    icon: 'solar:danger-circle-bold-duotone',
    label: 'Work Gap',
    color: 'hsl(30, 50%, 55%)',
    description: 'Time without work (by choice or not)',
    defaultParams: { gapMonths: 6, hasEmergencyFund: true, hasSeverance: false }
  },
  'side-hustle': {
    icon: 'solar:star-bold-duotone',
    label: 'Side Income',
    color: 'hsl(45, 70%, 50%)',
    description: 'Freelance, gig work, or extra income',
    defaultParams: { monthlyIncome: 1000 }
  },
  marriage: {
    icon: 'solar:heart-bold-duotone',
    label: 'Partner Up',
    color: 'hsl(330, 60%, 65%)',
    description: 'Marriage or long-term partnership',
    defaultParams: { weddingCost: 25000, partnerIncome: 50000 }
  },
  rent: {
    icon: 'solar:city-bold-duotone',
    label: 'Renting',
    color: 'hsl(30, 50%, 55%)',
    description: 'Living expenses while renting',
    defaultParams: { monthlyRent: 2000 }
  },
  home: {
    icon: 'solar:home-smile-bold-duotone',
    label: 'Buy Home',
    color: 'hsl(25, 70%, 50%)',
    description: 'Purchase a place to live',
    defaultParams: { homePrice: 400000, downPaymentPercent: 20, mortgageTerm: '30' }
  },
  children: {
    icon: 'solar:users-group-rounded-bold-duotone',
    label: 'Have Kids',
    color: 'hsl(340, 55%, 60%)',
    description: 'Starting or growing a family',
    defaultParams: { numKids: 1, annualCostPerKid: 15000, parentStaysHome: false }
  },
  'career-break': {
    icon: 'solar:airplane-bold-duotone',
    label: 'Take a Break',
    color: 'hsl(200, 60%, 55%)',
    description: 'Sabbatical, travel, or personal time',
    defaultParams: { breakMonths: 6, monthlySpending: 3000, hasSavings: true }
  },
  business: {
    icon: 'solar:rocket-bold-duotone',
    label: 'Start Business',
    color: 'hsl(270, 50%, 55%)',
    description: 'Launch your own venture',
    defaultParams: { startupCost: 50000, expectedRevenue: 80000, yearsToProfitable: 3 }
  },
  retirement: {
    icon: 'solar:sun-fog-bold-duotone',
    label: 'Retire',
    color: 'hsl(45, 70%, 55%)',
    description: 'Stop working and enjoy life',
    defaultParams: { monthlySpending: 4000, socialSecurity: 1800 }
  },
  health: {
    icon: 'solar:heart-pulse-bold-duotone',
    label: 'Health Event',
    color: 'hsl(0, 50%, 60%)',
    description: 'Major medical expense or ongoing care',
    defaultParams: { medicalCost: 25000, insuranceCoverage: 70 }
  },
  move: {
    icon: 'solar:map-point-bold-duotone',
    label: 'Move Cities',
    color: 'hsl(180, 45%, 50%)',
    description: 'Relocate to a different area',
    defaultParams: { movingCost: 5000, costOfLivingChange: 0 }
  },
  'family-support': {
    icon: 'solar:hand-heart-bold-duotone',
    label: 'Support Family',
    color: 'hsl(280, 40%, 55%)',
    description: 'Help parents or extended family',
    defaultParams: { monthlyAmount: 500, supportYears: 5 }
  },
  car: {
    icon: 'solar:car-bold-duotone',
    label: 'Buy a Car',
    color: 'hsl(210, 50%, 50%)',
    description: 'Purchase a vehicle',
    defaultParams: { carPrice: 30000, depreciation: 15, keepYears: 7 }
  },
  vacation: {
    icon: 'solar:palmtree-bold-duotone',
    label: 'Major Vacation',
    color: 'hsl(195, 60%, 50%)',
    description: 'A significant trip or travel',
    defaultParams: { tripCost: 5000 }
  },
  'one-time-expense': {
    icon: 'solar:wad-of-money-bold-duotone',
    label: 'One-Time Expense',
    color: 'hsl(350, 55%, 55%)',
    description: 'Wedding, renovation, or other large expense',
    defaultParams: { expenseType: 'other', amount: 15000 }
  },
  insurance: {
    icon: 'solar:shield-check-bold-duotone',
    label: 'Insurance Policy',
    color: 'hsl(160, 60%, 40%)',
    description: 'Life, disability, or other long-term insurance',
    defaultParams: { monthlyPremium: 100, coverageAmount: 500000, termLength: 20 }
  }
};

export const EVENT_CATEGORIES: Record<string, LifeEventType[]> = {
  'Work & Income': ['job', 'job-change', 'job-loss', 'side-hustle', 'business'],
  'Home & Family': ['rent', 'home', 'marriage', 'children', 'family-support', 'car', 'insurance'],
  'Life Changes': ['education', 'health', 'move', 'retirement', 'vacation', 'one-time-expense'],
};
