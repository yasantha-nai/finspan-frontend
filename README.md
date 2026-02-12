# FinSpan - Advanced Retirement Planning Platform

A comprehensive, tax-optimized retirement planning application that helps users project their financial future through retirement, comparing different withdrawal strategies and analyzing risk through Monte Carlo simulations.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/finspan-frontend)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)
- [API Integration](#api-integration)
- [Contributing](#contributing)

## Features

### Core Functionality
- **Comprehensive Retirement Planning** - 8 detailed input sections covering demographics, spending, employment, social security, pensions, accounts, returns, and real estate
- **Dual Withdrawal Strategies** - Compare Standard (RMD-driven) vs. Taxable-First withdrawal strategies
- **Monte Carlo Simulation** - Run probabilistic simulations with configurable volatility and iteration counts
- **Interactive Visualizations** - Professional charts powered by ApexCharts and Recharts
- **Real Estate Planning** - Track home equity, rental properties, and mortgage amortization
- **Tax Optimization** - Calculate tax-optimized withdrawal strategies across account types

### User Experience
- **Landing Page** - Beautiful, conversion-optimized landing page with features showcase
- **User Authentication** - Secure Firebase authentication with email/password and OAuth
- **Protected Routes** - Role-based access control for authenticated users
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark Mode Ready** - Theme support with next-themes
- **Onboarding Flow** - Multi-step wizard to guide new users

### Technical Features
- **TypeScript** - Complete type safety across the application
- **React Hook Form** - Performant forms with Zod validation
- **TanStack Query** - Powerful server state management
- **Context API** - Global state for simulation and authentication
- **SPA Routing** - Client-side routing with React Router v6
- **Hot Module Replacement** - Fast development with Vite HMR

## Tech Stack

### Frontend
- **Framework:** React 18.3.1
- **Language:** TypeScript 5.8.3
- **Build Tool:** Vite 5.4.19 with SWC compiler
- **Routing:** React Router DOM 6.30.1

### UI & Styling
- **UI Libraries:**
  - Material UI (MUI) v7.3.7
  - Shadcn UI (Radix UI primitives)
- **Styling:**
  - Tailwind CSS 3.4.17
  - Emotion (CSS-in-JS)
- **Icons:**
  - Iconify (@iconify/react) - Solar icon set
  - MUI Icons Material
- **Animations:** Framer Motion 12.29.2

### Charts & Visualization
- **Charts:** ApexCharts 5.3.6 (via react-apexcharts)
- **Alternative Charts:** Recharts 2.15.4

### Forms & Validation
- **Forms:** React Hook Form 7.61.1
- **Validation:** Zod 3.25.76
- **Integration:** @hookform/resolvers 3.10.0

### State Management
- **Server State:** TanStack Query (React Query) 5.83.0
- **Local State:** React Context API
- **Auth State:** Firebase Authentication

### Backend Integration
- **Authentication:** Firebase 12.9.0
- **API Client:** Native Fetch API
- **Backend:** Python Flask (separate repository)

### Development Tools
- **Testing:** Vitest 3.2.4 + Testing Library
- **Linting:** ESLint 9.32.0
- **Type Checking:** TypeScript 5.8.3

## Project Structure

```
finspan-frontend/
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── charts/            # Chart components
│   │   ├── dashboard/         # Dashboard widgets
│   │   ├── debug/             # Development tools
│   │   ├── landing/           # Landing page sections
│   │   ├── layout/            # Layout components
│   │   ├── onboarding/        # Onboarding wizard
│   │   ├── retirement/        # Retirement planner components
│   │   ├── simulation/        # Financial simulation UI
│   │   └── ui/                # Shadcn UI components
│   ├── config/
│   │   └── firebase.ts        # Firebase configuration
│   ├── context/
│   │   ├── AuthContext.tsx    # Authentication context
│   │   └── SimulationContext.tsx  # Simulation state
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── pages/                 # Page components
│   ├── services/              # API services
│   ├── theme/                 # MUI theme configuration
│   ├── types/                 # TypeScript types
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── .env                       # Environment variables (production)
├── .env.development          # Development environment
├── .env.example              # Environment template
├── .env.production           # Production environment
├── vercel.json               # Vercel configuration
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager
- Firebase project (for authentication)
- Backend API (see [API Integration](#api-integration))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finspan-frontend.git
cd finspan-frontend
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your Firebase credentials and API URL:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API URL
VITE_RETIREMENT_API_URL=https://your-backend-api.com/api
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSyC...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `my-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `VITE_RETIREMENT_API_URL` | Backend API URL | `https://api.example.com/api` |

### Environment Files

- `.env` - Production credentials (gitignored, add to Vercel)
- `.env.development` - Development environment (localhost backend)
- `.env.production` - Production environment (production backend)
- `.env.example` - Template for environment variables

**Note:** Environment variables prefixed with `VITE_` are exposed to the client-side code.

## Deployment

### Deploy to Vercel

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Import Your Repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository

2. **Configure Build Settings:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables:**
   Go to "Environment Variables" and add:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_RETIREMENT_API_URL=https://your-backend-api.com/api
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts to configure your project
```

### Important Deployment Notes

#### Backend URL Configuration
Make sure your `VITE_RETIREMENT_API_URL` environment variable points to your production backend:
- **Development:** `http://localhost:5050/api`
- **Production:** `https://retirement-planner-backend-471609383103.us-central1.run.app/api`

#### CORS Configuration
Ensure your backend API allows requests from your Vercel domain:
```python
# In your Flask backend (app.py)
from flask_cors import CORS

CORS(app, origins=[
    'http://localhost:8080',
    'https://your-project.vercel.app',
    'https://*.vercel.app'  # Allow all Vercel preview deployments
])
```

#### Vercel Configuration
The `vercel.json` file is already configured for:
- SPA routing (all routes redirect to index.html)
- Asset caching (1 year cache for static assets)
- Build optimization

### Deploy to Other Platforms

#### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Add environment variables in Netlify dashboard
```

#### Firebase Hosting
```bash
firebase deploy
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 8080)
npm run dev:host         # Start dev server with network access

# Building
npm run build            # Production build
npm run build:dev        # Development mode build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler

# Testing
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
```

## Documentation

### Application Documentation
See [APPLICATION_DOCUMENTATION.md](./APPLICATION_DOCUMENTATION.md) for:
- Detailed component documentation
- Page-by-page breakdown
- Input parameters reference
- Chart and visualization guide
- API endpoints
- Design system

### Key Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page | No |
| `/login` | User login | No |
| `/register` | User signup | No |
| `/forgot-password` | Password reset | No |
| `/dashboard` | User dashboard | Yes |
| `/simulator` | Financial simulator | Yes |
| `/simulator/life-weaver` | Life event simulator | Yes |
| `/retirement-planner` | Retirement planning tool | Yes |
| `/simulation-results` | View saved results | Yes |
| `/reports` | Generate reports | Yes |

## API Integration

### Backend Repository
This frontend connects to a separate Python Flask backend for retirement calculations.

**Backend Requirements:**
- Python 3.9+
- Flask
- Retirement planning engine

### API Endpoints

#### 1. Run Standard Simulation
```http
POST /api/retirement/simulate
Content-Type: application/json

{
  "p1_current_age": 65,
  "p2_current_age": 63,
  "annual_spend_goal": 200000,
  // ... other parameters
}
```

**Response:**
```json
{
  "success": true,
  "scenarios": {
    "standard": { "results": [...], "columns": [...] },
    "taxable_first": { "results": [...], "columns": [...] }
  },
  "config": { ... }
}
```

#### 2. Run Monte Carlo Simulation
```http
POST /api/retirement/monte-carlo
Content-Type: application/json

{
  // Same as standard simulation params, plus:
  "volatility": 0.18,
  "num_simulations": 100
}
```

**Response:**
```json
{
  "success_rate": 87.5,
  "num_simulations": 100,
  "volatility": 0.18,
  "stats": [...],
  "all_runs": [...],
  "baselines": { ... }
}
```

### Service Layer
API calls are abstracted in service files:
- `src/services/retirement.service.ts` - Retirement API calls
- `src/services/simulation.service.ts` - Simulation API calls

## Contributing

### Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "feat: add your feature"
```

3. Push to your fork:
```bash
git push origin feature/your-feature-name
```

4. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow existing component structure
- Use Shadcn UI components when possible
- Add proper type definitions
- Write tests for new features

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build/tooling changes

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Loading
- Ensure variables are prefixed with `VITE_`
- Restart the dev server after changing `.env`
- Check that `.env` file is in the root directory

#### Firebase Authentication Issues
- Verify Firebase credentials in `.env`
- Check Firebase console for proper domain configuration
- Ensure Firebase Authentication is enabled in console

#### API Connection Issues
- Verify `VITE_RETIREMENT_API_URL` is correct
- Check backend is running and accessible
- Inspect network tab for CORS errors

## Verification Checklist for Vercel Deployment

- [ ] `vercel.json` is configured for SPA routing
- [ ] All environment variables are added in Vercel dashboard
- [ ] Backend URL points to production API
- [ ] Firebase credentials are production values
- [ ] CORS is configured on backend to allow Vercel domain
- [ ] Build completes successfully
- [ ] All routes work after deployment
- [ ] Authentication works in production
- [ ] API calls succeed from deployed app

## License

[Your License Here]

## Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## Acknowledgments

Built with:
- React & TypeScript
- Vite
- Material UI & Shadcn UI
- Firebase
- ApexCharts
- TanStack Query

---

**Made with ❤️ by the FinSpan Team**
