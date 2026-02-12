# Advanced Retirement Planner - Complete Application Documentation

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Project Structure](#project-structure)
3. [Page-by-Page Breakdown](#page-by-page-breakdown)
4. [Component Library](#component-library)
5. [Data Flow & Architecture](#data-flow--architecture)
6. [Input Parameters Reference](#input-parameters-reference)
7. [Output Visualizations Reference](#output-visualizations-reference)
8. [Charts & Graphs Guide](#charts--graphs-guide)

---

## 🎯 Application Overview

**Purpose**: A comprehensive, tax-optimized retirement planning simulator that helps users project their financial future through retirement, comparing different withdrawal strategies and analyzing risk through Monte Carlo simulations.

**Tech Stack**:
- **Frontend**: React 18.3.1 + TypeScript 5.8.3 + Vite 5.4.19
- **UI Framework**: Material UI (MUI) v7.3.7 + Shadcn UI (Radix UI)
- **Charts**: ApexCharts 5.3.6 (react-apexcharts 1.9.0)
- **Styling**: Tailwind CSS 3.4.17 + Emotion + MUI Theme
- **Icons**: Iconify (@iconify/react 6.0.2) - Solar icon set
- **Animations**: Framer Motion 12.29.2
- **Forms**: React Hook Form 7.61.1 + Zod validation
- **Routing**: React Router DOM 6.30.1
- **State**: React Context (SimulationProvider) + TanStack Query 5.83.0
- **Backend**: Python Flask API (separate repository)
- **Build Tool**: Vite with SWC compiler
- **Testing**: Vitest 3.2.4 + Testing Library

---

## ⚙️ Project Configuration

### Environment Variables

**Development** (`.env.development`):
```bash
VITE_API_URL=/api
VITE_RETIREMENT_API_URL=http://localhost:5001/api
```

**Production** (`.env.production`):
```bash
VITE_API_URL=https://your-production-api.com/api
VITE_RETIREMENT_API_URL=https://your-production-api.com/api
```

### Vite Configuration

**File**: `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5001",  // Backend Flask server
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Import alias for cleaner paths
    },
  },
}));
```

**Key Features**:
- **API Proxy**: All `/api` requests forwarded to Flask backend at `localhost:5001`
- **SWC Compiler**: Fast refresh and build times
- **Path Aliases**: `@/` resolves to `src/` directory
- **Hot Module Replacement**: Instant updates during development

### Package Scripts

```json
{
  "dev": "vite",                        // Start dev server on port 8080
  "build": "vite build",                // Production build (preview with `npm run preview`)
  "build:dev": "vite build --mode development",  // Dev mode build
  "lint": "eslint .",                   // Run ESLint
  "preview": "vite preview",            // Preview production build
  "test": "vitest run",                 // Run tests once
  "test:watch": "vitest"                // Run tests in watch mode
}
```

### Component Configuration

**Shadcn UI** (`components.json`):
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Key Dependencies

#### Core UI Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| `@mui/material` | 7.3.7 | Material Design components |
| `@mui/icons-material` | 7.3.7 | Material Design icons |
| `@emotion/react` | 11.14.0 | CSS-in-JS styling |
| `@emotion/styled` | 11.14.1 | Styled components |
| `framer-motion` | 12.29.2 | Animations and transitions |

#### Radix UI (Shadcn Components)
| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/react-dialog` | 1.1.14 | Modal dialogs |
| `@radix-ui/react-dropdown-menu` | 2.1.15 | Dropdown menus |
| `@radix-ui/react-tabs` | 1.1.12 | Tab navigation |
| `@radix-ui/react-select` | 2.2.5 | Select inputs |
| `@radix-ui/react-checkbox` | 1.3.2 | Checkboxes |
| *(+15 more Radix packages)* |  | Accessible UI primitives |

#### Charts & Visualization
| Package | Version | Purpose |
|---------|---------|---------|
| `apexcharts` | 5.3.6 | Chart library |
| `react-apexcharts` | 1.9.0 | React wrapper for ApexCharts |
| `recharts` | 2.15.4 | Alternative chart library |

#### Forms & Validation
| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | 7.61.1 | Form state management |
| `zod` | 3.25.76 | Schema validation |
| `@hookform/resolvers` | 3.10.0 | Zod integration |

#### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| `react-router-dom` | 6.30.1 | Routing |
| `@tanstack/react-query` | 5.83.0 | Server state management |
| `date-fns` | 3.6.0 | Date manipulation |
| `clsx` | 2.1.1 | Conditional classNames |
| `tailwind-merge` | 2.6.0 | Merge Tailwind classes |

---

## 🔌 Backend Integration

### API Service

**File**: `src/services/retirement.service.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_RETIREMENT_API_URL || '/api';

export const retirementService = {
  // Run standard simulation
  async runSimulation(params: RetirementSimulationParams): Promise<SimulationResponse> {
    const response = await fetch(`${API_BASE_URL}/retirement/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error('Simulation failed');
    return response.json();
  },

  // Run Monte Carlo simulation
  async runMonteCarloSimulation(
    params: RetirementSimulationParams & { volatility: number; num_simulations: number }
  ): Promise<MonteCarloResults> {
    const response = await fetch(`${API_BASE_URL}/retirement/monte-carlo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error('Monte Carlo simulation failed');
    return response.json();
  },
};
```

### Backend Repository

**Location**: Separate Python Flask repository (not in this frontend repo)

**Key Files**:
- `app.py` - Flask API server
- `retirement_planner_yr.py` - Core simulation logic
- `verify_tax_logic.py` - Tax calculation verification

**Endpoints**:
1. `POST /api/retirement/simulate`
   - Accepts: `RetirementSimulationParams`
   - Returns: `SimulationResponse` with 2 strategies

2. `POST /api/retirement/monte-carlo`
   - Accepts: `RetirementSimulationParams + { volatility, num_simulations }`
   - Returns: `MonteCarloResults` with statistical analysis

**Backend Start Command**:
```bash
cd retirement_planner
conda activate retirement_planner
python app.py
```

**Backend runs on**: `http://localhost:5001`

---

## 📁 Project Structure

```
future-navigator/
├── src/
│   ├── pages/
│   │   ├── RetirementPlannerPage.tsx      # Main retirement planner page
│   │   ├── DashboardPage.tsx              # Dashboard/Analytics
│   │   ├── OnboardingPage.tsx             # Multi-step onboarding wizard
│   │   └── LoginPage.tsx                  # Authentication
│   │
│   ├── components/
│   │   ├── retirement/
│   │   │   ├── RetirementInputForm.tsx    # Main input form (8 sections)
│   │   │   ├── SimulationResults.tsx      # Results display & charts
│   │   │   ├── MonteCarloResults.tsx      # Monte Carlo analysis UI
│   │   │   └── CsvUploadSection.tsx       # File upload component
│   │   │
│   │   ├── onboarding/
│   │   │   ├── OnboardingStepCard.tsx     # Reusable card wrapper
│   │   │   ├── OnboardingStepper.tsx      # Progress indicator
│   │   │   ├── OnboardingNavigation.tsx   # Navigation controls
│   │   │   └── OnboardingLayout.tsx       # Layout wrapper
│   │   │
│   │   └── dashboard/
│   │       └── (various dashboard components)
│   │
│   ├── services/
│   │   └── retirement.service.ts          # API communication
│   │
│   ├── types/
│   │   └── retirement-types.ts            # TypeScript interfaces
│   │
│   ├── theme/
│   │   └── mui-theme.ts                   # Custom MUI theme
│   │
│   └── App.tsx                            # Main app with routing
```

---

## 📄 Page-by-Page Breakdown

### 1. **Retirement Planner Page** (`RetirementPlannerPage.tsx`)

**Route**: `/retirement-planner`

**Purpose**: Main page for retirement planning simulation and analysis.

#### Structure:
```
┌─────────────────────────────────────────────┐
│  🏛️ Advanced Retirement Planner             │
│  Comprehensive tax-optimized withdrawal...  │
├─────────────────────────────────────────────┤
│                                             │
│  📝 Input Form (8 Sections)                 │
│  ├─ Demographics                            │
│  ├─ Spending                                │
│  ├─ Employment                              │
│  ├─ Social Security                         │
│  ├─ Pensions                                │
│  ├─ Account Balances                        │
│  ├─ Returns                                 │
│  └─ Real Estate                             │
│                                             │
│  [Run Simulation Button]                    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  📊 Simulation Results                      │
│  ├─ Strategy Tabs (Standard/Taxable-First) │
│  ├─ Summary Cards (6-8 metrics)            │
│  ├─ Home Equity Visualization              │
│  ├─ Custom Analysis & Data Selector        │
│  └─ Projection Chart                       │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  🎲 Monte Carlo Simulation                  │
│  ├─ Input Controls                          │
│  └─ [Run Monte Carlo Button]               │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  📈 Monte Carlo Results                     │
│  ├─ Probability of Success Card            │
│  ├─ Net Worth Trajectory Chart             │
│  ├─ Account Balance Chart                  │
│  └─ Run Inspector                          │
│                                             │
└─────────────────────────────────────────────┘
```

#### Components Used:
- `RetirementInputForm` - Main input form
- `SimulationResults` - Results visualization
- `MonteCarloResults` - Monte Carlo analysis
- `OnboardingStepCard` - Card wrapper for sections
- `ThemeProvider` - MUI theme context

#### State Management:
```typescript
const [simulationResults, setSimulationResults] = useState<SimulationResponse | null>(null);
const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResultsType | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

---

### 2. **Onboarding Page** (`OnboardingPage.tsx`)

**Route**: `/onboarding`

**Purpose**: Multi-step wizard to guide new users through initial setup.

#### Structure:
```
Step 1: Welcome & Demographics
Step 2: Financial Goals
Step 3: Account Setup
Step 4: Configuration
Step 5: Review & Submit
```

#### Components Used:
- `OnboardingLayout` - Page wrapper
- `OnboardingStepper` - Progress tracker
- `OnboardingStepCard` - Content cards
- `OnboardingNavigation` - Next/Back buttons

---

### 3. **Dashboard Page** (`DashboardPage.tsx`)

**Route**: `/dashboard`

**Purpose**: High-level overview and analytics dashboard.

#### Features:
- Key metrics summary
- Recent simulations
- Quick actions
- Visual analytics

---

### 4. **Login Page** (`LoginPage.tsx`)

**Route**: `/login`

**Purpose**: User authentication and access control.

#### Features:
- Email/password login
- OAuth integration
- Password reset
- Registration link

---

## 🧩 Component Library

### Onboarding Components

#### 1. **OnboardingStepCard** (`OnboardingStepCard.tsx`)

**Purpose**: Premium card wrapper with icon, title, and description.

**Props**:
```typescript
interface OnboardingStepCardProps {
  icon: React.ReactNode;        // Icon (usually Iconify)
  title: string;                // Card title
  description: string;          // Subtitle/description
  children: React.ReactNode;    // Card content
}
```

**Example Usage**:
```tsx
<OnboardingStepCard
  icon={<Icon icon="solar:user-bold-duotone" width={32} color="white" />}
  title="Demographics"
  description="Basic information about you and your partner"
>
  {/* Form fields go here */}
</OnboardingStepCard>
```

**Visual Design**:
- Gradient icon bubble (left side)
- White card with subtle shadow
- Hover effects
- Consistent spacing

---

### Retirement Components

#### 2. **RetirementInputForm** (`RetirementInputForm.tsx`)

**Purpose**: Comprehensive input form with 8 sections for retirement planning parameters.

**Sections**:

##### Section 1: Demographics
**Icon**: `solar:user-bold-duotone`

**Inputs**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Person 1 Name | Text | "Husband" | Primary person's name |
| Person 2 Name | Text | "Wife" | Secondary person's name |
| Person 1 Current Age | Number | 65 | Primary's age today |
| Person 2 Current Age | Number | 63 | Secondary's age today |
| End Simulation Age | Number | 95 | Age to project until |
| Inflation Rate | Number (%) | 0.03 | Annual inflation (3%) |
| Filing Status | Select | "MFJ" | Tax filing status (Single/MFJ/MFS/HOH) |

##### Section 2: Spending & Goals
**Icon**: `solar:wallet-money-bold-duotone`

**Inputs**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Annual Spend Goal | Currency | $200,000 | Desired annual spending |
| Target Tax Bracket Rate | Number (%) | 0.24 | Optimal tax rate target |
| Previous Year Taxes | Currency | $50,000 | Last year's tax payment |

##### Section 3: Employment Income
**Icon**: `solar:suitcase-bold-duotone`

**Inputs**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| P1 Annual Employment Income | Currency | $100,000 | Primary's salary |
| P1 Works Until Age | Number | 67 | Retirement age |
| P2 Annual Employment Income | Currency | $80,000 | Secondary's salary |
| P2 Works Until Age | Number | 65 | Retirement age |

##### Section 4: Social Security
**Icon**: `solar:shield-bold-duotone`

**Inputs**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| P1 SS Amount (annual) | Currency | $45,000 | Primary's benefit |
| P1 SS Start Age | Number | 70 | Claim age |
| P2 SS Amount (annual) | Currency | $45,000 | Secondary's benefit |
| P2 SS Start Age | Number | 65 | Claim age |

##### Section 5: Pensions
**Icon**: `solar:document-text-bold-duotone`

**Inputs**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| P1 Annual Pension | Currency | $0 | Primary's pension |
| P1 Pension Start Age | Number | 65 | Start age |
| P2 Annual Pension | Currency | $0 | Secondary's pension |
| P2 Pension Start Age | Number | 65 | Start age |

##### Section 6: Account Balances
**Icon**: `solar:chart-2-bold-duotone`

**Inputs**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Taxable Brokerage Account | Currency | $700,000 | Taxable investments |
| Pre-Tax P1 (401k/IRA) | Currency | $1,250,000 | Traditional 401k/IRA |
| Pre-Tax P2 (401k/IRA) | Currency | $1,250,000 | Traditional 401k/IRA |
| Roth P1 | Currency | $60,000 | Roth IRA/401k |
| Roth P2 | Currency | $60,000 | Roth IRA/401k |

##### Section 7: Expected Annual Returns
**Icon**: `solar:graph-new-up-bold-duotone`

**Inputs**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Taxable Brokerage Return | Number (%) | 0.07 | Expected return (7%) |
| P1 Pre-Tax Return | Number (%) | 0.07 | Expected return (7%) |
| P2 Pre-Tax Return | Number (%) | 0.07 | Expected return (7%) |
| P1 Roth Return | Number (%) | 0.07 | Expected return (7%) |
| P2 Roth Return | Number (%) | 0.07 | Expected return (7%) |
| Taxable Basis Ratio | Number | 0.75 | Portion that is principal (75%) |

##### Section 8: Real Estate Assets
**Icon**: `solar:home-bold-duotone`

**Sub-sections**:

**Primary Home**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Home Value | Currency | $0 | Current market value |
| Annual Appreciation | Number (%) | 0.03 | Growth rate (3%) |
| Mortgage Principal | Currency | $0 | Outstanding balance |
| Interest Rate | Number (%) | 0 | Loan rate |
| Years Remaining | Number | 0 | Payoff timeline |

**Rental Property 1**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Property Value | Currency | $0 | Market value |
| Annual Rental Income | Currency | $0 | Gross rent |
| Property Growth Rate | Number (%) | 0.03 | Appreciation (3%) |
| Income Growth Rate | Number (%) | 0.03 | Rent increase (3%) |
| Mortgage Principal | Currency | $0 | Outstanding balance |
| Interest Rate | Number (%) | 0 | Loan rate |
| Years Remaining | Number | 0 | Payoff timeline |

**Submit Button**:
```tsx
<Button
  variant="contained"
  size="large"
  startIcon={<Icon icon="solar:chart-bold-duotone" />}
  sx={{
    background: 'linear-gradient(135deg, #00A76F 0%, #007867 100%)',
    // Premium gradient styling
  }}
>
  Run Advanced Simulation 🚀
</Button>
```

---

#### 3. **SimulationResults** (`SimulationResults.tsx`)

**Purpose**: Display simulation results with strategy comparison, charts, and data tables.

**Props**:
```typescript
interface SimulationResultsProps {
  scenarios: {
    standard: StrategyResults;
    taxable_first: StrategyResults;
  };
  config?: Record<string, any>;
}
```

**Components**:

##### A. Strategy Tabs
**Material UI Tabs** - Switch between withdrawal strategies:
- Standard Strategy (RMD-driven)
- Taxable-First Strategy (deplete taxable first)

##### B. Summary Cards (ResultCard Grid)

**Grid Layout**: 3 columns on desktop, responsive

**Cards Displayed**:

| Card | Icon | Color | Metric |
|------|------|-------|--------|
| Final Net Worth | `solar:wallet-money-bold-duotone` | Success (Green) | Total assets at end |
| Total Pre-Tax Accounts | `solar:chart-2-bold-duotone` | Info (Blue) | 401k/IRA balance |
| Total Roth Accounts | `solar:shield-check-bold-duotone` | Secondary (Purple) | Roth balance |
| Total Taxable Accounts | `solar:card-bold-duotone` | Info (Blue) | Brokerage balance |
| Final Year Tax Rate | `solar:pie-chart-2-bold-duotone` | Warning (Orange) | Effective tax % |
| Total Tax Paid | `solar:bill-check-bold-duotone` | Error (Red) | Lifetime taxes |
| Final Home Equity (Primary) | `solar:home-smile-bold-duotone` | Success (Green) | Primary residence |
| Total Real Estate Equity | `solar:city-bold-duotone` | Success (Green) | All properties |

**ResultCard Design**:
```tsx
<ResultCard
  title="Final Net Worth"
  value="$1,234,567"
  icon="solar:wallet-money-bold-duotone"
  color="success"
  delay={0.1}  // Staggered animation
/>
```

**Features**:
- Icon bubble with gradient background
- Large value display
- Hover animation (lift + glow)
- Framer Motion entrance animation

##### C. Home Equity Visualization

**Icon**: `solar:home-add-bold-duotone`

**Features**:
1. **Display Tabs** (4 options):
   - Primary Home Equity
   - Rental Equity
   - Total Home Equity
   - Mortgage Liability

2. **Area Chart** (ApexCharts):
   - Switchable data based on selected tab
   - Smooth curves
   - Gradient fill
   - Year-over-year projection

**Chart Configuration**:
```typescript
const equityChartOptions: ApexOptions = {
  chart: { type: 'area', toolbar: { show: false } },
  colors: ['#00A76F'],  // Green for equity
  fill: {
    type: 'gradient',
    gradient: { opacityFrom: 0.7, opacityTo: 0.2 }
  },
  stroke: { curve: 'smooth', width: 3 },
  // ...
};
```

**Data Source**:
Frontend calculates equity using mortgage amortization formula:
```typescript
// Monthly payment calculation
PMT = P * (r * (1+r)^n) / ((1+r)^n - 1)

// Equity = Property Value - Outstanding Balance
```

##### D. Custom Analysis & Data Selector

**Icon**: `solar:chart-square-bold-duotone`

**Features**:
1. **Column Checkboxes**:
   - Year
   - P1_Age, P2_Age
   - Net_Worth
   - Bal_PreTax_P1, Bal_PreTax_P2
   - Bal_Roth_P1, Bal_Roth_P2
   - Bal_Taxable
   - Tax_Bill
   - Ord_Income
   - RMD_P1, RMD_P2
   - Withdrawal_Total
   - (+ all other backend columns)

2. **Dynamic Line Chart**:
   - Multi-series based on selected columns
   - Smooth curves
   - Zoom/pan enabled
   - Responsive legend

3. **Data Table**:
   - Shows only visible columns
   - Formatted numbers
   - Scrollable
   - Year-by-year breakdown

4. **Download CSV Button**:
   - Exports visible columns
   - Filename: `{strategy}_results.csv`
   - Orange gradient styling

##### E. Projection Chart

**Icon**: `solar:graph-new-up-bold-duotone`

**Chart Type**: Line chart (ApexCharts)

**Series**: Based on selected columns from Data Selector

**Example**:
```typescript
chartSeries = [
  { name: 'Net Worth', data: [200k, 210k, 220k, ...] },
  { name: 'Bal PreTax P1', data: [1M, 1.05M, 1.1M, ...] },
  // ...based on checkbox selections
]
```

---

#### 4. **MonteCarloResults** (`MonteCarloResults.tsx`)

**Purpose**: Display probabilistic Monte Carlo simulation results with statistical analysis.

**Props**:
```typescript
interface MonteCarloResultsProps {
  results: MonteCarloResultsType;
}
```

**Type Structure**:
```typescript
interface MonteCarloResults {
  success_rate: number;              // % of runs that succeed
  num_simulations: number;           // 100, 500, 1000, etc.
  volatility: number;                // 0.18 = 18% market volatility
  stats: MonteCarloStats[];          // Yearly P10/median/P90 stats
  all_runs: MonteCarloRun[];         // Individual run data
  baselines: {                       // Baseline scenarios
    standard: StrategyResults;
    taxable_first: StrategyResults;
  };
}
```

**Components**:

##### A. Probability of Success Card

**ResultCard** with dynamic styling:
- **Success (≥90%)**: Green shield with checkmark
- **Warning (75-89%)**: Orange shield with warning
- **Error (<75%)**: Red shield with cross

```tsx
<ResultCard
  title="Probability of Success"
  value="87.5%"
  icon="solar:shield-warning-bold-duotone"
  color="warning"
/>
```

##### B. Projected Net Worth Trajectory

**Icon**: `solar:graph-new-up-bold-duotone`

**Chart Type**: Multi-line chart (ApexCharts)

**Series** (4 lines):
1. **10th Percentile** (Red) - "Unlucky" scenario
2. **Median** (Purple) - "Expected" outcome
3. **90th Percentile** (Green) - "Lucky" scenario
4. **Selected Run** (Orange) - User-selected individual run (overlay)

**Chart Features**:
- Smooth curves
- Gradient fill
- Zoom/pan enabled
- Tooltip with formatted values
- Legend at top

**Example Data**:
```typescript
netWorthSeries = [
  { name: '10th Percentile (Unlucky)', data: [700k, 650k, 600k, ...] },
  { name: 'Median (Expected)', data: [800k, 850k, 900k, ...] },
  { name: '90th Percentile (Lucky)', data: [900k, 1M, 1.1M, ...] },
]
```

##### C. Account Balance Trajectories (Median)

**Icon**: `solar:chart-2-bold-duotone`

**Chart Type**: Stacked area chart

**Series** (3 stacks):
1. **Taxable** (Orange)
2. **Pre-Tax (Traditional)** (Blue)
3. **Roth** (Purple)

**Purpose**: Show how account types deplete over time

**Chart Features**:
- Stacked to show total balance
- Smooth curves
- Distinct colors per account type
- Legend at top

##### D. Run Inspector (Drill Down)

**Icon**: `solar:magnifer-zoom-in-bold-duotone`

**Features**:

1. **Select Run Dropdown**:
   - Quick access: Worst Case, Median, Best Case
   - Full list: All 100+ runs sorted by final net worth
   - Displays final net worth for each run

```tsx
<Select value={selectedRunId} onChange={...}>
  <MenuItem value={worstRun.run_id}>
    ⚠️ Worst Case (Final NW: $234,567)
  </MenuItem>
  <MenuItem value={medianRun.run_id}>
    📊 Median Case (Final NW: $567,890)
  </MenuItem>
  <MenuItem value={bestRun.run_id}>
    🚀 Best Case (Final NW: $901,234)
  </MenuItem>
  <MenuItem disabled>────────────────</MenuItem>
  {/* All runs */}
</Select>
```

2. **Annual Returns Chart** (for selected run):
   - **Chart Type**: Bar chart
   - **Color**: Red (negative returns), Green (positive returns)
   - **Purpose**: Show sequence-of-returns risk
   - **X-axis**: Years
   - **Y-axis**: Return percentage

**Example**:
```
Year 2025: +8.5% (Green bar)
Year 2026: -12.3% (Red bar)
Year 2027: +5.2% (Green bar)
```

3. **Selected Run Overlay**:
   - Orange line added to Net Worth Trajectory chart
   - Allows comparison of specific run vs. percentiles
   - Alert notification when run is selected

---

## 🔄 Data Flow & Architecture

### Request Flow

```
┌──────────────┐
│   User UI    │
│  (React)     │
└──────┬───────┘
       │
       │ 1. User fills form
       │ 2. Clicks "Run Simulation"
       │
       v
┌──────────────────────┐
│ retirementService    │
│ .runSimulation()     │
└──────────┬───────────┘
           │
           │ POST /api/retirement/simulate
           │ Body: RetirementSimulationParams
           │
           v
┌──────────────────────────┐
│  Flask Backend (Python)  │
│  app.py                  │
│  └─> RetirementSimulator │
└──────────┬───────────────┘
           │
           │ 1. Parse inputs
           │ 2. Run year-by-year simulation
           │ 3. Calculate RMDs, taxes, withdrawals
           │ 4. Compare strategies
           │
           v
┌──────────────────────┐
│ SimulationResponse   │
│  {                   │
│    scenarios: {...}  │
│    config: {...}     │
│  }                   │
└──────────┬───────────┘
           │
           │ JSON Response
           │
           v
┌──────────────────────┐
│  setState(results)   │
│  (React Component)   │
└──────────┬───────────┘
           │
           │ Trigger re-render
           │
           v
┌──────────────────────┐
│ SimulationResults    │
│ Display charts,      │
│ tables, cards        │
└──────────────────────┘
```

### Monte Carlo Flow

```
User clicks "Run Monte Carlo"
  │
  ├─> Reads: volatility, num_simulations
  │
  ├─> POST /api/retirement/monte-carlo
  │   Body: {...config, volatility, num_simulations}
  │
  ├─> Backend runs 100+ simulations
  │   ├─> Each with random market returns
  │   ├─> Calculate percentiles (P10, median, P90)
  │   └─> Track success rate
  │
  └─> Returns: MonteCarloResults
      │
      └─> Display in MonteCarloResults component
```

---

## 📊 Input Parameters Reference

### Complete Input Schema

```typescript
interface RetirementSimulationParams {
  // Demographics
  p1_name: string;
  p2_name: string;
  p1_current_age: number;
  p2_current_age: number;
  end_age: number;
  inflation_rate: number;
  filing_status: 'Single' | 'MFJ' | 'MFS' | 'HOH';

  // Spending
  annual_spend_goal: number;
  target_tax_bracket_rate: number;
  previous_year_taxes: number;

  // Employment
  p1_employment_income: number;
  p1_works_til_age: number;
  p2_employment_income: number;
  p2_works_til_age: number;

  // Social Security
  p1_ss_amount: number;
  p1_ss_start_age: number;
  p2_ss_amount: number;
  p2_ss_start_age: number;

  // Pensions
  p1_pension: number;
  p1_pension_start_age: number;
  p2_pension: number;
  p2_pension_start_age: number;

  // Account Balances
  taxable_balance: number;
  bal_pretax_p1: number;
  bal_pretax_p2: number;
  bal_roth_p1: number;
  bal_roth_p2: number;

  // Returns
  taxable_return: number;
  pretax_p1_return: number;
  pretax_p2_return: number;
  roth_p1_return: number;
  roth_p2_return: number;
  taxable_basis_ratio: number;

  // Real Estate - Primary Home
  primary_home_value: number;
  primary_home_growth_rate: number;
  primary_home_mortgage_principal: number;
  primary_home_mortgage_rate: number;
  primary_home_mortgage_years: number;

  // Real Estate - Rental 1
  rental_1_value: number;
  rental_1_income: number;
  rental_1_growth_rate: number;
  rental_1_income_growth_rate: number;
  rental_1_mortgage_principal: number;
  rental_1_mortgage_rate: number;
  rental_1_mortgage_years: number;

  // Monte Carlo (optional)
  volatility?: number;
  num_simulations?: number;
}
```

---

## 📈 Output Visualizations Reference

### Summary Metrics (Cards)

| Metric | Formula/Source | Purpose |
|--------|---------------|---------|
| Final Net Worth | Sum of all account balances at end age | Overall financial health |
| Total Pre-Tax | Bal_PreTax_P1 + Bal_PreTax_P2 (final year) | Tax-deferred assets |
| Total Roth | Bal_Roth_P1 + Bal_Roth_P2 (final year) | Tax-free assets |
| Total Taxable | Bal_Taxable (final year) | Taxable assets |
| Final Year Tax Rate | (Tax_Bill / Ord_Income) × 100 | Effective tax burden |
| Total Tax Paid | Sum of Tax_Bill across all years | Lifetime tax cost |
| Final Home Equity | Property Value - Mortgage Balance | Real estate wealth |

### Yearly Result Columns

Backend returns an array of `RetirementYearResult` objects:

```typescript
interface RetirementYearResult {
  Year: number;
  P1_Age: number;
  P2_Age: number;
  
  // Balances
  Bal_PreTax_P1: number;
  Bal_PreTax_P2: number;
  Bal_Roth_P1: number;
  Bal_Roth_P2: number;
  Bal_Taxable: number;
  Net_Worth: number;
  
  // Income
  Employment_Income_P1: number;
  Employment_Income_P2: number;
  SS_P1: number;
  SS_P2: number;
  Pension_P1: number;
  Pension_P2: number;
  Ord_Income: number;
  
  // Withdrawals
  RMD_P1: number;
  RMD_P2: number;
  Withdrawal_PreTax: number;
  Withdrawal_Roth: number;
  Withdrawal_Taxable: number;
  Withdrawal_Total: number;
  
  // Real Estate
  Primary_Home_Value?: number;
  Primary_Home_Mortgage?: number;
  Primary_Home_Equity?: number;
  Rental_Home_Value?: number;
  Rental_Home_Mortgage?: number;
  Rental_Home_Equity?: number;
  Total_Home_Equity?: number;
  
  // Taxes
  Tax_Bill: number;
  
  // Market (Monte Carlo only)
  Market_Return?: number;
}
```

---

## 📊 Charts & Graphs Guide

### Chart 1: **Net Worth Trajectory** (Monte Carlo)

**Type**: Multi-line chart (ApexCharts)

**Purpose**: Show range of possible outcomes across 100+ random simulations

**Data Source**: `MonteCarloResults.stats[]`

**Series**:
- 10th Percentile (pessimistic): `Net_Worth_P10`
- Median (expected): `Net_Worth_median`
- 90th Percentile (optimistic): `Net_Worth_P90`
- Selected Run (optional overlay): Individual run data

**X-Axis**: Years (2025, 2026, ...)

**Y-Axis**: Net Worth (formatted as $XXXk)

**Configuration**:
```typescript
{
  chart: { type: 'line', animations: true },
  stroke: { width: [3, 3, 3, 4], curve: 'smooth' },
  colors: ['#f43f5e', '#6366f1', '#10b981', '#f59e0b'],
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.1 } }
}
```

---

### Chart 2: **Account Balance Trajectories** (Monte Carlo)

**Type**: Stacked area chart

**Purpose**: Show how different account types contribute to total balance over time

**Data Source**: `MonteCarloResults.stats[]`

**Series**:
- Taxable: `Bal_Taxable_median`
- Pre-Tax: `Bal_PreTax_Total_median` (P1 + P2)
- Roth: `Bal_Roth_Total_median` (P1 + P2)

**X-Axis**: Years

**Y-Axis**: Balance

**Configuration**:
```typescript
{
  chart: { type: 'area', stacked: true },
  colors: ['#f59e0b', '#3b82f6', '#a855f7']
}
```

---

### Chart 3: **Annual Returns** (Run Inspector)

**Type**: Bar chart

**Purpose**: Show sequence-of-returns risk for a specific simulation run

**Data Source**: Selected `MonteCarloRun.data[]`

**Series**: `Market_Return × 100` (convert to percentage)

**Colors**: 
- Red if `Market_Return < 0` (losses)
- Green if `Market_Return >= 0` (gains)

**X-Axis**: Years

**Y-Axis**: Return %

**Configuration**:
```typescript
{
  chart: { type: 'bar' },
  plotOptions: { bar: { borderRadius: 4, distributed: true } },
  colors: returnsData.map(r => r < 0 ? '#f43f5e' : '#10b981')
}
```

---

### Chart 4: **Home Equity Visualization**

**Type**: Area chart

**Purpose**: Track real estate equity and mortgage paydown over time

**Data Source**: Frontend calculation (not from backend)

**Calculation**:
```typescript
// Mortgage amortization formula
const monthlyPmt = P * (r * (1+r)^n) / ((1+r)^n - 1);

// Each year:
for (12 months) {
  interest = balance * (rate/12);
  principal = monthlyPmt - interest;
  balance -= principal;
}

// Property appreciates:
value *= (1 + growthRate);

// Equity:
equity = value - balance;
```

**Series** (switchable via tabs):
- Primary Home Equity
- Rental Equity
- Total Home Equity
- Mortgage Liability

**X-Axis**: Years

**Y-Axis**: Equity/Liability

**Configuration**:
```typescript
{
  chart: { type: 'area', toolbar: false },
  colors: ['#00A76F'],
  fill: { type: 'gradient', gradient: { opacityFrom: 0.7, opacityTo: 0.2 } },
  stroke: { curve: 'smooth', width: 3 }
}
```

---

### Chart 5: **Custom Projection Chart**

**Type**: Multi-line chart

**Purpose**: User-customizable chart based on selected columns

**Data Source**: Current scenario results + user column selections

**Series**: Dynamic - based on checked columns

**Example**:
```
User checks:
☑ Net_Worth
☑ Bal_PreTax_P1
☑ Tax_Bill

Chart shows 3 lines with those data series
```

**Configuration**: Same as standard line chart with dynamic series

---

## 🎨 Design System

### Colors

**Primary** (Teal):
- Main: `#00A76F`
- Light: `#5BE49B`
- Dark: `#007867`
- Lighter: `#C8FAD6`
- Darker: `#004B50`

**Secondary** (Purple):
- Main: `#8E33FF`
- Light: `#C684FF`
- Dark: `#5119B7`

**Success** (Green):
- Main: `#00A76F`

**Warning** (Orange):
- Main: `#FFAB00`

**Error** (Red):
- Main: `#FF5630`

**Info** (Blue):
- Main: `#00B8D9`

### Typography

**Font Family**: 'Inter', sans-serif

**Variants**:
- h1: 96px, Thin, -1.5px
- h2: 60px, Light, -0.5px
- h3: 48px, Regular, 0px
- h4: 34px, Regular, 0.25px
- h5: 24px, Regular, 0px
- h6: 20px, Medium, 0.15px
- body1: 16px, Regular, 0.5px
- body2: 14px, Regular, 0.25px

### Gradients

**Primary Gradient**:
```css
background: linear-gradient(135deg, #00A76F 0%, #007867 100%);
```

**Secondary Gradient**:
```css
background: linear-gradient(135deg, #8E33FF 0%, #5119B7 100%);
```

**Warning Gradient**:
```css
background: linear-gradient(135deg, #FFAB00 0%, #B76E00 100%);
```

### Shadows

```css
/* Card elevation */
box-shadow: 0 8px 16px 0 rgba(0, 167, 111, 0.24);

/* Hover state */
box-shadow: 0 12px 20px 0 rgba(0, 167, 111, 0.32);
```

### Border Radius

- Cards: `16px`
- Buttons: `12px`
- Inputs: `8px`

---

## 🔧 API Endpoints

### 1. Run Simulation

**Endpoint**: `POST /api/retirement/simulate`

**Request Body**: `RetirementSimulationParams`

**Response**: `SimulationResponse`

```typescript
{
  success: true,
  scenarios: {
    standard: { results: [...], columns: [...] },
    taxable_first: { results: [...], columns: [...] }
  },
  config: { ...original inputs... }
}
```

### 2. Run Monte Carlo

**Endpoint**: `POST /api/retirement/monte-carlo`

**Request Body**: `RetirementSimulationParams + { volatility, num_simulations }`

**Response**: `MonteCarloResults`

```typescript
{
  success_rate: 87.5,
  num_simulations: 100,
  volatility: 0.18,
  stats: [...],
  all_runs: [...],
  baselines: { standard: {...}, taxable_first: {...} }
}
```

---

---

## � Complete Charts & Metrics Reference

This section provides exhaustive documentation of every chart in the Advanced Retirement Planner, including exact metrics, axes, filters, and interactive features.

---

### Chart 1: **Projected Net Worth Trajectory** (Monte Carlo)

**Location**: Monte Carlo Results section (after clicking "Run Monte Carlo")

**Component**: `MonteCarloResults.tsx`

**Chart Type**: Multi-line chart with gradient fill

**Purpose**: Display the range of possible net worth outcomes across 100-1000 random market simulations, showing pessimistic (P10), expected (median), and optimistic (P90) scenarios.

#### Axes & Metrics

**X-Axis**:
- **Metric**: Year
- **Format**: 2025, 2026, 2027... until end simulation age
- **Data Source**: `MonteCarloResults.stats[].Year`
- **Range**: From current year to `end_age` (typically 95)

**Y-Axis**:
- **Metric**: Net Worth (Total Assets)
- **Format**: Dollar values formatted as `$XXXk` (e.g., $500k, $1M, $1.5M)
- **Data Source**: 
  - P10: `MonteCarloResults.stats[].Net_Worth_P10`
  - Median: `MonteCarloResults.stats[].Net_Worth_median`
  - P90: `MonteCarloResults.stats[].Net_Worth_P90`
- **Range**: Auto-scaled from minimum to maximum net worth

#### Series Displayed

1. **10th Percentile (Red line)**:
   - Represents "unlucky" scenario
   - 10% of simulations fall below this line
   - Shows worst-case outcomes within realistic bounds

2. **Median (Purple line)**:
   - Represents "expected" outcome
   - 50% of simulations fall above/below
   - Most likely trajectory

3. **90th Percentile (Green line)**:
   - Represents "lucky" scenario
   - 90% of simulations fall below this line
   - Shows best-case outcomes within realistic bounds

4. **Selected Run (Orange line)** - OPTIONAL:
   - Appears when user selects a specific run via Run Inspector
   - Shows exact trajectory of that random simulation
   - Allows comparison against percentiles

#### Interactive Features

**Zoom**:
- Mouse wheel or pinch to zoom in/out
- Double-click to reset zoom

**Pan**:
- Click and drag to pan when zoomed

**Tooltip**:
- Hover over any point to see:
  - Year
  - Exact net worth value for each series
  - Formatted as `Year: $X,XXX,XXX`

**Legend**:
- Click legend items to toggle series on/off
- Positioned at top of chart

**Toolbar** (top-right):
- Download chart as PNG/SVG
- Zoom in/out buttons
- Pan button
- Reset zoom

#### Filters & Controls

**No direct filters on this chart**

**Indirect Control via**:
- **Run Inspector Dropdown**: Select individual run to overlay orange line
- **Clear Selection**: Remove selected run overlay

#### Configuration

```typescript
{
  chart: { type: 'line', toolbar: { show: true }, zoom: { enabled: true } },
  stroke: { width: [3, 3, 3, 4], curve: 'smooth' },
  colors: ['#f43f5e', '#6366f1', '#10b981', '#f59e0b'],
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
  xaxis: { categories: years, title: { text: 'Year' } },
  yaxis: { 
    title: { text: 'Net Worth' },
    labels: { formatter: (val) => `$${(val / 1000).toFixed(0)}K` }
  }
}
```

---

### Chart 2: **Account Balance Trajectories (Median)**

**Location**: Monte Carlo Results section

**Component**: `MonteCarloResults.tsx`

**Chart Type**: Stacked area chart

**Purpose**: Show how different account types (Taxable, Pre-Tax, Roth) contribute to total balance over time, using median values across all simulations.

#### Axes & Metrics

**X-Axis**:
- **Metric**: Year
- **Format**: 2025, 2026, 2027...
- **Data Source**: `MonteCarloResults.stats[].Year`

**Y-Axis**:
- **Metric**: Account Balance (stacked)
- **Format**: `$XXXk`
- **Data Source**: 
  - Taxable: `stats[].Bal_Taxable_median`
  - Pre-Tax: `stats[].Bal_PreTax_Total_median` (P1 + P2)
  - Roth: `stats[].Bal_Roth_Total_median` (P1 + P2)
- **Range**: 0 to total balance (sum of all accounts)

#### Series Displayed (Stacked)

1. **Taxable (Orange area)** - Bottom layer:
   - Brokerage account balance
   - Depleted first in taxable-first strategy

2. **Pre-Tax / Traditional (Blue area)** - Middle layer:
   - 401k/Traditional IRA balances (both persons combined)
   - Subject to RMDs and ordinary income tax

3. **Roth (Purple area)** - Top layer:
   - Roth IRA/401k balances (both persons combined)
   - Tax-free, no RMDs, typically preserved longest

#### Interactive Features

**Tooltip**:
- Hover to see breakdown per account type at that year
- Shows individual values + total

**Legend**:
- Toggle individual account types
- Positioned at top

**Zoom/Pan**: Same as Chart 1

#### Filters & Controls

**No direct filters**

**Purpose**: Shows median outcome only (not adjustable)

#### Key Insights

- **Stacked view**: Y-axis represents total balance
- **Area size**: Indicates relative proportion of each account type
- **Depletion pattern**: Shows which accounts are drawn down first
- **Strategy impact**: Taxable-first vs. standard withdrawal order

---

### Chart 3: **Annual Returns (Sequence Risk)**

**Location**: Monte Carlo Results → Run Inspector (after selecting a run)

**Component**: `MonteCarloResults.tsx`

**Chart Type**: Bar chart (distributed colors)

**Purpose**: Display year-by-year market returns for a specific simulation run, highlighting sequence-of-returns risk.

#### Axes & Metrics

**X-Axis**:
- **Metric**: Year
- **Format**: 2025, 2026, 2027...
- **Data Source**: `selectedRun.data[].Year`

**Y-Axis**:
- **Metric**: Annual Market Return (%)
- **Format**: Percentage (e.g., -12.3%, +8.5%)
- **Data Source**: `selectedRun.data[].Market_Return × 100`
- **Range**: Typically -40% to +40% (based on volatility)

#### Series Displayed

**Single series**: Annual Market Return
- **Color coding**:
  - **Green bars**: Positive returns (gains)
  - **Red bars**: Negative returns (losses)

#### Interactive Features

**Tooltip**:
- Hover over bar to see:
  - Year
  - Exact return percentage (e.g., `+8.27%` or `-12.34%`)

**No zoom/pan** (discrete years, fixed view)

#### Filters & Controls

**Run Inspector Dropdown** (parent control):
- Select from:
  - **⚠️ Worst Case**: Run with lowest final net worth
  - **📊 Median Case**: Run closest to 50th percentile
  - **🚀 Best Case**: Run with highest final net worth
  - **All Runs**: Full dropdown list (Run #1, Run #2, ...)

- Shows final net worth for each run in dropdown

**Clear Selection**:
- Chip with "X" button to deselect run
- Hides this chart when no run selected

#### Key Insights

- **Sequence Risk**: Early negative returns have bigger impact than late ones
- **Color Pattern**: Clusters of red bars = bear market periods
- **Volatility**: Width of return range shows market uncertainty
- **Comparison**: Compare worst/median/best runs to see how sequence affects outcomes

---

### Chart 4: **Home Equity Visualization**

**Location**: Simulation Results → Home Equity section (between summary cards and data selector)

**Component**: `SimulationResults.tsx`

**Chart Type**: Area chart with gradient fill

**Purpose**: Track real estate equity and mortgage payoff over time for primary home and rental properties.

#### Axes & Metrics

**X-Axis**:
- **Metric**: Year
- **Format**: 2025, 2026, 2027...
- **Data Source**: Current scenario results years

**Y-Axis**:
- **Metric**: Equity or Liability ($)
- **Format**: `$XXXk` or `$X.XXM`
- **Data Source**: **Frontend-calculated** (not from backend):
  ```
  Primary Equity = Primary Home Value - Primary Mortgage Balance
  Rental Equity = Rental Value - Rental Mortgage Balance
  Total Equity = Primary Equity + Rental Equity
  Mortgage Liability = Primary Mortgage + Rental Mortgage
  ```
- **Range**: Auto-scaled based on selected tab

#### Series Displayed (Switchable via Tabs)

**Tab 1: Primary Home Equity**:
- **Single series**: Primary Home Equity (Green)
- **Calculation**: Home value - mortgage balance
- **Shows**: Equity growth from property appreciation + mortgage paydown

**Tab 2: Rental Equity**:
- **Single series**: Rental Equity (Green)
- **Calculation**: Rental value - rental mortgage balance
- **Shows**: Investment property equity growth

**Tab 3: Total Home Equity**:
- **Single series**: Total Real Estate Equity (Green)
- **Calculation**: Sum of primary + rental equity
- **Shows**: Combined real estate wealth

**Tab 4: Mortgage Liability**:
- **Single series**: Total Mortgage Liability (Red)
- **Calculation**: Primary mortgage + rental mortgage
- **Shows**: Outstanding debt over time (amortization)

#### Interactive Features

**Display Tabs** (Primary Control):
- 4 tabs to switch between equity views
- Icon: `solar:chart-bold-duotone`
- Label format: "Display: [Tab Name]"

**Tooltip**:
- Hover to see exact equity/liability at that year

**Chart Title** (Dynamic):
- "Primary Home Equity Over Time"
- "Rental Property Equity Over Time"
- "Total Real Estate Net Equity"
- "Outstanding Mortgage Balances"

**No zoom/pan** (simple visualization)

#### Filters & Controls

**Tab Selection**:
- **Primary Home Equity** (default)
- **Rental Equity**
- **Total Home Equity**
- **Mortgage Liability**

**Visibility Condition**:
- Section only appears if `config` contains home/rental values
- Previously required > $0 equity, now always shown if inputs exist

#### Calculation Details

**Mortgage Amortization** (per year):
```typescript
// Monthly payment formula
PMT = P × (r × (1 + r)^n) / ((1 + r)^n - 1)

// For each month (12 per year):
interest = balance × (annualRate / 12)
principal = monthlyPayment - interest
balance -= principal

// Property appreciation (per year):
value *= (1 + growthRate)

// Equity:
equity = value - balance
```

**Inputs Used**:
- Primary Home: `primary_home_value`, `primary_home_growth_rate`, `primary_home_mortgage_*`
- Rental: `rental_1_value`, `rental_1_growth_rate`, `rental_1_mortgage_*`

---

### Chart 5: **Custom Projection Chart**

**Location**: Simulation Results → Custom Analysis & Data Selector

**Component**: `SimulationResults.tsx`

**Chart Type**: Multi-line chart (user-configurable)

**Purpose**: Allow users to create custom visualizations by selecting any combination of data columns from the simulation results.

#### Axes & Metrics

**X-Axis**:
- **Metric**: Year
- **Format**: 2025, 2026, 2027...
- **Data Source**: `currentScenario.results[].Year`
- **Fixed**: Always Year (not customizable)

**Y-Axis**:
- **Metric**: **USER-SELECTED COLUMNS**
- **Format**: Auto-formatted based on column type
  - Dollar values: `$X,XXX,XXX`
  - Percentages: `XX.X%`
  - Ages: `XX years`
  - Numbers: `X,XXX`
- **Data Source**: Any checked columns from results
- **Range**: Auto-scaled to fit all selected series

#### Series Displayed (Dynamic)

**Based on checkbox selections**, examples:

- ✅ **Net Worth**: Total assets across all accounts
- ✅ **Bal_PreTax_P1**: Person 1's Traditional 401k/IRA
- ✅ **Bal_PreTax_P2**: Person 2's Traditional 401k/IRA
- ✅ **Bal_Roth_P1**: Person 1's Roth accounts
- ✅ **Bal_Roth_P2**: Person 2's Roth accounts
- ✅ **Bal_Taxable**: Brokerage account
- ✅ **Tax_Bill**: Annual taxes paid
- ✅ **Ord_Income**: Ordinary income (employment + SS + pension + withdrawals)
- ✅ **RMD_P1**: Person 1's required minimum distributions
- ✅ **RMD_P2**: Person 2's required minimum distributions
- ✅ **Withdrawal_Total**: Total withdrawals across all accounts
- ✅ **Withdrawal_PreTax**: Withdrawals from Traditional accounts
- ✅ **Withdrawal_Roth**: Withdrawals from Roth accounts
- ✅ **Withdrawal_Taxable**: Withdrawals from taxable accounts
- ✅ **SS_P1**: Person 1's Social Security benefits
- ✅ **SS_P2**: Person 2's Social Security benefits
- ✅ **Employment_Income_P1**: Person 1's salary
- ✅ **Employment_Income_P2**: Person 2's salary
- ✅ **P1_Age**: Person 1's age at each year
- ✅ **P2_Age**: Person 2's age at each year

**Total Available Columns**: 30+ (all backend output fields)

**Default Selection**:
- Year (always shown)
- P1_Age
- Bal_PreTax_P1
- Bal_Roth_P1
- Net_Worth

#### Interactive Features

**Column Selector Checkboxes**:
- Grid layout (multiple columns on desktop)
- Each checkbox toggles a data series
- Label = column name (e.g., "Net Worth", "Tax Bill")

**Real-time Chart Update**:
- Chart re-renders immediately when checkboxes change
- No "Apply" button needed

**Tooltip**:
- Hover to see all visible series values at that year
- Format: `Column Name: $X,XXX` or `XX.X%`

**Legend**:
- Shows all active series
- Click to toggle individual series on/off
- Positioned at top

**Zoom/Pan**: Enabled (same as Monte Carlo charts)

**Toolbar**: Full ApexCharts toolbar with download, zoom, pan

#### Filters & Controls

**Primary Filter**: **Column Checkboxes**
- Location: Above chart in `<FormGroup>`
- Layout: Row (wraps on small screens)
- Interaction: Click to toggle

**Secondary Filter**: **Strategy Tabs** (parent control)
- Standard Strategy
- Taxable-First Strategy
- Changes entire dataset, affecting all charts

**Data Table Filter** (same checkboxes):
- Table below chart shows only checked columns
- Synchronized with chart selection

#### Download Feature

**CSV Export Button**:
- Icon: `<Download />` (MUI icon)
- Color: Orange gradient
- Tooltip: "Download CSV"

**Export Behavior**:
- Exports only visible columns (based on checkboxes)
- Filename: `{strategy}_results.csv`
  - Example: `Standard_Strategy_results.csv`
- Format: CSV with headers
- Includes all years (not filtered by zoom)

#### Key Insights

**Use Cases**:
1. **Account Comparison**: Check all "Bal_" columns to see account evolution
2. **Withdrawal Analysis**: Check all "Withdrawal_" columns to see draw-down strategy
3. **Tax Analysis**: Check "Tax_Bill", "Ord_Income", "RMD_P1", "RMD_P2"
4. **Income Streams**: Check "SS_P1", "SS_P2", "Employment_Income_P1", etc.
5. **Custom Deep Dive**: Mix any columns for unique insights

**Performance**:
- Smooth rendering even with 10+ series
- Auto-adjusts line width (thinner when more series)
- Color palette cycles through distinct colors

---

### Chart 6: **Strategy Comparison View** (Table)

**Location**: Simulation Results → Custom Analysis section (below chart)

**Component**: `SimulationResults.tsx`

**Type**: Interactive data table (not a chart, but critical visualization)

**Purpose**: Display year-by-year data in tabular format for detailed analysis, exportable to CSV.

#### Columns Displayed

**Dynamic based on checkbox selection**

**Default Columns**:
- Year
- P1_Age
- Bal_PreTax_P1
- Bal_Roth_P1
- Net_Worth

**All Available Columns** (30+):
| Column Name | Description |
|-------------|-------------|
| `Year` | Calendar year |
| `P1_Age` | Person 1's age |
| `P2_Age` | Person 2's age |
| `Bal_PreTax_P1` | Person 1 Traditional 401k/IRA |
| `Bal_PreTax_P2` | Person 2 Traditional 401k/IRA |
| `Bal_Roth_P1` | Person 1 Roth accounts |
| `Bal_Roth_P2` | Person 2 Roth accounts |
| `Bal_Taxable` | Taxable brokerage |
| `Net_Worth` | Total assets |
| `Tax_Bill` | Annual taxes paid |
| `Ord_Income` | Total ordinary income |
| `RMD_P1` | Person 1 RMD |
| `RMD_P2` | Person 2 RMD |
| `Withdrawal_Total` | Total withdrawals |
| `Withdrawal_PreTax` | Traditional withdrawals |
| `Withdrawal_Roth` | Roth withdrawals |
| `Withdrawal_Taxable` | Taxable withdrawals |
| `SS_P1` | Person 1 Social Security |
| `SS_P2` | Person 2 Social Security |
| `Pension_P1` | Person 1 pension |
| `Pension_P2` | Person 2 pension |
| `Employment_Income_P1` | Person 1 salary |
| `Employment_Income_P2` | Person 2 salary |
| *(+10 more columns from backend)* | |

#### Formatting

**Numbers**:
- Dollar amounts: `$1,234,567`
- Percentages: `12.5%`
- Whole numbers: `1,234`

**Alignment**:
- Numbers: Right-aligned
- Text: Left-aligned

**Styling**:
- Header: Bold, dark background
- Rows: Alternating background (zebra striping)
- Borders: Subtle gray lines

#### Interactive Features

**Scroll**:
- Vertical scroll for many years (30+ rows)
- Horizontal scroll for many columns (10+ columns)

**Synchronized with Chart**:
- Same checkbox controls affect both table and chart
- Real-time updates

**Export**: Same CSV download button (shared with chart)

#### Filters & Controls

**Column Selection**: Same checkboxes as chart

**Strategy Selection**: Tabs at top of results section

**No row filtering**: All years shown (cannot filter by year range)

---

## 🎛️ Global Filters & Controls Summary

### Strategy Comparison Tabs

**Location**: Top of Simulation Results section

**Options**:
1. **Standard Strategy**
   - RMD-driven withdrawals
   - Follows IRS required minimum distributions
   
2. **Taxable-First Strategy**
   - Depletes taxable accounts before touching tax-advantaged
   - Optimizes for tax-free growth

**Effect on Charts**:
- Changes data for ALL charts in Simulation Results
- Changes data for table
- Updates all summary cards

### Monte Carlo Controls

**Volatility Slider**:
- **Location**: Monte Carlo input section
- **Range**: 0% to 30%
- **Default**: 18% (historical market volatility)
- **Step**: 1%
- **Effect**: Controls randomness of market returns

**Number of Simulations**:
- **Location**: Monte Carlo input section
- **Options**: 100, 500, 1000
- **Default**: 100
- **Effect**: More simulations = smoother percentile lines, slower computation

### Run Inspector

**Location**: Monte Carlo Results section

**Dropdown Options**:
- Worst Case (lowest final NW)
- Median Case (50th percentile)
- Best Case (highest final NW)
- All individual runs (Run #1, #2, ...)

**Effect**:
- Overlays selected run on Net Worth Trajectory chart
- Shows Annual Returns chart for selected run
- Displays alert notification

---

## 📏 Metric Definitions Reference

### Account Balances

| Metric | Definition | Tax Treatment |
|--------|------------|---------------|
| `Bal_PreTax_P1` | Person 1's Traditional 401k/IRA | Ordinary income tax on withdrawals |
| `Bal_PreTax_P2` | Person 2's Traditional 401k/IRA | Ordinary income tax on withdrawals |
| `Bal_Roth_P1` | Person 1's Roth IRA/401k | Tax-free withdrawals |
| `Bal_Roth_P2` | Person 2's Roth IRA/401k | Tax-free withdrawals |
| `Bal_Taxable` | Taxable brokerage account | Capital gains tax on gains only |
| `Net_Worth` | Sum of all accounts | N/A (total assets) |

### Income Sources

| Metric | Definition | Tax Treatment |
|--------|------------|---------------|
| `Employment_Income_P1` | Person 1's salary | Ordinary income |
| `Employment_Income_P2` | Person 2's salary | Ordinary income |
| `SS_P1` | Person 1's Social Security | 0-85% taxable (based on combined income) |
| `SS_P2` | Person 2's Social Security | 0-85% taxable (based on combined income) |
| `Pension_P1` | Person 1's pension | Ordinary income |
| `Pension_P2` | Person 2's pension | Ordinary income |
| `Ord_Income` | Total ordinary income | Used for tax calculation |

### Withdrawals

| Metric | Definition | Purpose |
|--------|------------|---------|
| `RMD_P1` | Required Minimum Distribution (P1) | IRS-mandated withdrawal from Traditional accounts |
| `RMD_P2` | Required Minimum Distribution (P2) | IRS-mandated withdrawal from Traditional accounts |
| `Withdrawal_PreTax` | Traditional account withdrawals | Includes RMDs + discretionary |
| `Withdrawal_Roth` | Roth account withdrawals | Tax-free, no RMDs |
| `Withdrawal_Taxable` | Taxable account withdrawals | Only gains are taxed |
| `Withdrawal_Total` | Sum of all withdrawals | Used to meet spending goal |

### Tax Metrics

| Metric | Definition | Notes |
|--------|------------|-------|
| `Tax_Bill` | Annual federal income tax | Based on ordinary income + capital gains |
| `Effective_Tax_Rate` | `(Tax_Bill / Ord_Income) × 100` | Frontend-calculated |
| `Total_Tax_Paid` | Sum of `Tax_Bill` across all years | Lifetime tax burden |

### Real Estate (Frontend-Calculated)

| Metric | Definition | Calculation |
|--------|------------|-------------|
| `Primary_Home_Value` | Current market value | Starting value × (1 + appreciation)^years |
| `Primary_Home_Equity` | Equity in primary residence | Home value - mortgage balance |
| `Rental_Home_Value` | Rental property value | Starting value × (1 + appreciation)^years |
| `Rental_Home_Equity` | Rental property equity | Property value - mortgage balance |
| `Total_Home_Equity` | Combined real estate equity | Primary equity + rental equity |
| `Mortgage_Liability` | Total outstanding debt | Primary mortgage + rental mortgage |

---

## 🎨 Chart Styling Reference

### Color Palette

**Percentile Lines** (Monte Carlo):
- P10 (Pessimistic): `#f43f5e` (Rose Red)
- Median (Expected): `#6366f1` (Indigo)
- P90 (Optimistic): `#10b981` (Emerald Green)
- Selected Run: `#f59e0b` (Amber Orange)

**Account Types**:
- Taxable: `#f59e0b` (Amber)
- Pre-Tax: `#3b82f6` (Blue)
- Roth: `#a855f7` (Purple)

**Returns Bar Chart**:
- Positive: `#10b981` (Green)
- Negative: `#f43f5e` (Red)

**Home Equity**:
- Equity: `#00A76F` (Teal Green)
- Liability: `#FF5630` (Red-Orange)

### Typography

**Chart Titles**:
- Font: Inter, sans-serif
- Size: 18px
- Weight: 600 (SemiBold)
- Color: Text primary

**Axis Labels**:
- Font: Inter
- Size: 12px
- Weight: 400 (Regular)
- Color: Text secondary

**Tooltips**:
- Font: Inter
- Size: 14px
- Background: White with shadow
- Border: 1px solid gray-200

---

## 🚀 Getting Started

### Run Frontend

```bash
cd future-navigator
npm install
npm run dev
```

Access at: `http://localhost:8080`

### Run Backend

```bash
cd retirement_planner
conda activate retirement_planner
python app.py
```

API at: `http://localhost:5001`

---

## 📝 Complete Feature Summary

This Advanced Retirement Planner application provides:

✅ **8 Comprehensive Input Sections** covering all retirement planning aspects
✅ **2 Withdrawal Strategies** for comparison (Standard vs. Taxable-First)
✅ **6-8 Dynamic Summary Cards** with key financial metrics
✅ **Home Equity Visualization** with 4 switchable views and frontend calculations
✅ **Custom Data Analysis Tool** with 30+ selectable columns
✅ **Interactive Data Table** with CSV export
✅ **Monte Carlo Simulation** with configurable volatility and simulation count
✅ **5 Major Chart Types**:
   - Net Worth Trajectory (P10/Median/P90)
   - Account Balance Trajectories (Stacked)
   - Annual Returns (Sequence Risk)
   - Home Equity Area Chart (4 views)
   - Custom Projection Chart (User-defined)
✅ **Run Inspector** for detailed drill-down analysis
✅ **Premium UI** with OnboardingStepCard design system
✅ **Responsive Design** for desktop, tablet, and mobile
✅ **TypeScript** for complete type safety
✅ **Material UI + Shadcn** for consistent, accessible components
✅ **ApexCharts** for interactive, professional visualizations

**Total Input Fields**: 40+
**Total Output Metrics**: 30+
**Total Visualizations**: 5 major charts + 8 summary cards + 1 data table
**Total Interactive Controls**: 10+ (tabs, checkboxes, dropdowns, sliders)

**Every feature is documented. Every metric is defined. Every chart is explained.** 🎉
