# **Trackify — External Examiner Viva Questions & Answers**

> **Comprehensive preparation guide covering all aspects of the project — architecture, code, design decisions, security, deployment, and theoretical concepts.**

---

## **Table of Contents**

| Section | Topic | Questions |
|---------|-------|-----------|
| 1 | Project Overview & Motivation | Q1–Q10 |
| 2 | Frontend — React, TypeScript, Vite | Q11–Q30 |
| 3 | Backend — Flask, REST API | Q31–Q50 |
| 4 | Database — PostgreSQL, Schema Design | Q51–Q65 |
| 5 | Authentication — JWT, OAuth, Bcrypt | Q66–Q80 |
| 6 | Auto-Categorization Engine | Q81–Q88 |
| 7 | Live Market Data Pipeline | Q89–Q100 |
| 8 | AI Chatbot — Gemini Integration | Q101–Q110 |
| 9 | Deployment & DevOps | Q111–Q125 |
| 10 | Security | Q126–Q140 |
| 11 | Testing & Performance | Q141–Q150 |
| 12 | Future Scope & Limitations | Q151–Q160 |
| 13 | Theoretical / Conceptual | Q161–Q180 |

---

# **Section 1 — Project Overview & Motivation**

---

### **Q1. What is Trackify? Give a brief overview.**

**Answer:**
Trackify is a full-stack personal finance and expense tracker web application built specifically for Indian users. It allows users to track income and expenses with automatic categorization, set monthly budgets, create and monitor savings goals, view live Indian market data (Nifty 50, Sensex, stocks, mutual funds, gold, ELSS, REITs), interact with an AI-powered financial assistant (Google Gemini), visualize analytics through interactive charts, and export data to Excel. The frontend is built with React 19 + TypeScript + Vite and deployed on Vercel. The backend is a Flask REST API deployed on Render, backed by Neon serverless PostgreSQL.

---

### **Q2. What problem does Trackify solve?**

**Answer:**
There is no single, free, web-based, privacy-respecting personal finance application in the Indian market that combines expense tracking, income management, budget control, savings goals, live Indian market data, AI-powered financial advice, and interactive analytics — all without requiring invasive device permissions or displaying advertisements. Existing apps like Walnut (discontinued), Money Manager (mobile-only, no cloud sync), CRED (credit card users only), and ET Money (investment-focused) each address only a fragment of the problem. Trackify provides a unified, all-in-one solution.

---

### **Q3. Why did you choose a web application instead of a mobile app?**

**Answer:**
1. **Accessibility** — A web app is accessible from any device (desktop, tablet, mobile) with a browser, without requiring app store downloads.
2. **Platform Independence** — No need to build separate Android and iOS apps. A single codebase serves all platforms via responsive design.
3. **Desktop Advantage** — Financial analysis, chart viewing, and data entry are more convenient on larger screens.
4. **No Permissions Required** — Unlike mobile apps that request SMS, contacts, and location access, a web app requires zero device permissions.
5. **Easier Deployment** — Vercel provides instant deployments from Git with global CDN. No Play Store / App Store review process needed.

---

### **Q4. Who are the stakeholders of this project?**

**Answer:**
- **End Users** (Indian professionals and students) — Primary users who track personal finances
- **Project Developer** — Full-stack developer who designed, built, and deployed the application
- **Academic Supervisor / Guide** — Reviews project progress and evaluates deliverables
- **College / University** — Evaluates the project as part of final year curriculum
- **Vercel** — Frontend hosting provider (CDN-based static hosting)
- **Render** — Backend hosting provider (containerized Python app hosting)
- **Neon** — Database provider (serverless PostgreSQL)
- **Google Cloud** — Provides OAuth 2.0 authentication and Gemini AI API
- **Yahoo Finance** — Provides real-time stock and index pricing data
- **MFAPI.in** — Provides latest NAV data for Indian mutual fund schemes

---

### **Q5. What methodology did you follow for development?**

**Answer:**
We followed the **Agile methodology** with iterative sprints over approximately 6 months (October 2025 – March 2026). The development was divided into four major phases:
1. **Planning (Oct 2025)** — Requirement analysis, system design, literature survey, technology selection
2. **Backend Development (Nov–Jan 2026)** — Database schema, auth, CRUD APIs, categorization engine, market data pipeline
3. **Frontend Development (Nov 2025–Feb 2026)** — Project setup, auth pages, dashboard, transactions, analytics, goals, investments, chatbot, theme, landing page
4. **Testing & Deployment (Feb–Mar 2026)** — Integration testing, Vercel/Render deployment, Neon DB setup, bug fixes, documentation

---

### **Q6. How is Trackify different from existing apps like CRED or ET Money?**

**Answer:**

| Feature | CRED | ET Money | Trackify |
|---------|------|----------|----------|
| Expense Tracking | CC only | SMS only | ✅ Full manual |
| Income Tracking | ❌ | ❌ | ✅ |
| Budget Management | ❌ | ❌ | ✅ |
| Savings Goals | ❌ | ❌ | ✅ |
| Live Market Data | ❌ | MF only | ✅ All (stocks, MF, gold, ELSS, REITs) |
| AI Financial Advice | ❌ | ❌ | ✅ Gemini-powered |
| Web Application | ❌ | ❌ | ✅ |
| Data Privacy | Monetizes data | Requires SMS access | ✅ Zero permissions |
| Free / No Ads | CC users only | Has ads | ✅ Completely free |

---

### **Q7. What are the key features of Trackify?**

**Answer:**
1. **Income & Expense Tracking** with 8 expense categories and 4 income sources
2. **Auto-Categorization** using keyword-based string matching
3. **Monthly Budget Management** with real-time progress tracking
4. **Savings Goals** with target amounts, deadlines, and progress visualization
5. **Live Indian Market Data** — Nifty 50, Sensex, 5 blue-chip stocks, 5 MF NAVs, gold, 2 ELSS funds, 2 REITs
6. **AI Chatbot** powered by Google Gemini 2.5 Flash with personalized financial advice
7. **Interactive Analytics** — Pie charts, bar graphs via Recharts
8. **Data Export** to Excel (.xlsx) using SheetJS
9. **Dark/Light Theme** with localStorage persistence
10. **Demo Mode** for showcasing without registration
11. **Google OAuth 2.0** + Email/Password authentication with JWT
12. **Responsive Design** for mobile, tablet, and desktop

---

### **Q8. What is the technology stack used in Trackify?**

**Answer:**

**Frontend:**
- React 19 (UI library), TypeScript (type safety), Vite 6 (build tool)
- React Router DOM 7 (client-side routing)
- Framer Motion / motion (animations)
- Recharts (charts & analytics)
- Lucide React (icons)
- @google/generative-ai (Gemini AI chatbot)
- @react-oauth/google (Google OAuth)
- SheetJS + FileSaver (Excel export)
- TailwindCSS 4 (utility-first CSS)

**Backend:**
- Python 3.11+, Flask 3.1 (REST API framework)
- PostgreSQL 16 on Neon (serverless database)
- psycopg2-binary (PostgreSQL driver — raw SQL, no ORM)
- Flask-JWT-Extended (JWT authentication)
- Flask-Bcrypt (password hashing)
- flask-cors (Cross-Origin Resource Sharing)
- google-auth (server-side OAuth token verification)
- Gunicorn (production WSGI server)

**Infrastructure:**
- Vercel (frontend hosting with CDN)
- Render (backend hosting)
- Neon (serverless PostgreSQL)
- Git/GitHub (version control)

---

### **Q9. What is the architecture of Trackify?**

**Answer:**
Trackify follows a **two-tier (client-server) decoupled architecture**:

1. **Client Layer** — React SPA running in the user's browser, deployed on Vercel CDN
2. **Server Layer** — Flask REST API running on Render, communicating with Neon PostgreSQL

The frontend communicates with the backend exclusively via RESTful API calls over HTTPS. Authentication is stateless using JWT tokens. The frontend also directly communicates with Google Gemini API (for the chatbot) and Google OAuth (for authentication popups).

The backend is organized using Flask Blueprints:
- `auth_bp` — `/register`, `/login`, `/auth/google` (No auth required)
- `expense_bp` — `/expenses` (JWT required)
- `income_bp` — `/income` (JWT required)
- `budget_bp` — `/budget` (JWT required)
- `goal_bp` — `/goals` (JWT required)
- `market_bp` — `/market/*` (No auth required)

---

### **Q10. Why did you choose a decoupled (separate frontend and backend) architecture?**

**Answer:**
1. **Independent Deployment** — Frontend and backend can be deployed, scaled, and updated independently. A CSS change doesn't require redeploying the Python server.
2. **Technology Flexibility** — React + TypeScript for the frontend and Python + Flask for the backend — each technology excels in its domain.
3. **Scalability** — Frontend is served via Vercel CDN (global edge network), while the backend can be scaled on Render independently.
4. **Reusability** — The same REST API can serve a future mobile app (React Native) without any backend changes.
5. **Team Scalability** — In a team setting, frontend and backend developers can work parallelly.
6. **Cost Optimization** — Vercel's free tier handles static hosting efficiently; Render's free tier handles API compute. Separating them maximizes free-tier usage.

---

# **Section 2 — Frontend (React, TypeScript, Vite)**

---

### **Q11. Why did you choose React for the frontend?**

**Answer:**
1. **Component-Based Architecture** — React promotes reusable, modular UI components (Navbar, ChatBot, MarketCard, GoalTracker, etc.)
2. **Virtual DOM** — React's virtual DOM minimizes actual DOM manipulations, improving rendering performance
3. **Rich Ecosystem** — Large community, extensive libraries (Recharts, Framer Motion, React Router, etc.)
4. **Context API** — Built-in state management without needing Redux for our scale
5. **Industry Standard** — Most widely used frontend library, well-documented, and battle-tested
6. **Hooks** — Functional components with hooks (`useState`, `useEffect`, `useContext`, `useMemo`, `useLayoutEffect`) provide clean, readable code

---

### **Q12. Why TypeScript instead of JavaScript?**

**Answer:**
1. **Compile-Time Type Checking** — Catches type-related bugs before runtime (e.g., passing a `string` where a `number` is expected)
2. **Better IDE Support** — IntelliSense, auto-completion, and inline documentation in VS Code
3. **Interface Definitions** — We define `Transaction`, `User`, `Budget`, `Goal` interfaces in `types.ts` ensuring consistent data shapes across all components and contexts
4. **Refactoring Safety** — Renaming a property automatically flags all usages
5. **Self-Documenting Code** — Type annotations serve as live documentation

For example, our `Transaction` interface:
```typescript
export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType; // 'income' | 'expense'
  category: string;
  date: string;
  description: string;
}
```

---

### **Q13. What is Vite and why did you use it instead of Create React App (CRA)?**

**Answer:**
Vite is a next-generation frontend build tool. We chose it over CRA because:

1. **Instant Dev Server Startup** — Vite uses native ES modules, starting in under 500ms vs CRA's 30+ seconds
2. **Hot Module Replacement (HMR)** — Changes reflect instantly in the browser without full page reload
3. **Optimized Production Builds** — Uses Rollup under the hood for tree-shaking and code splitting
4. **Smaller Bundle Size** — Our production build is ~450 KB gzipped (CRA bundles tend to be larger)
5. **Native TypeScript Support** — No additional configuration needed
6. **Plugin Ecosystem** — TailwindCSS and React plugins work seamlessly via `@tailwindcss/vite` and `@vitejs/plugin-react`

CRA is now effectively deprecated (unmaintained), making Vite the recommended choice by the React team.

---

### **Q14. Explain the state management approach in Trackify.**

**Answer:**
We use **React Context API** with three dedicated providers that wrap the entire application:

1. **AuthContext** — Manages user authentication state (`user`, `token`, `isDemo`), provides `login()`, `register()`, `logout()`, `activateDemo()`, `loginWithGoogle()` functions. Persists user and token to `localStorage` under keys `trackify_user` and `trackify_token`.

2. **ExpenseContext** — Manages all financial transactions (both income and expenses stored in a unified `Transaction[]` array with a `type: 'income' | 'expense'` discriminator) and budgets. Provides `addTransaction()`, `deleteTransaction()`, `addBudget()`, `getMonthlySummary()` functions. Concurrently fetches expenses, income, and budgets on token change using `Promise.all()`.

3. **GoalContext** — Manages savings goals with CRUD operations. Provides `addGoal()`, `updateGoalSavings()`, `deleteGoal()`, `fetchGoals()`, `loadDemoGoals()` functions. Computes `progress` percentage using `Math.min(100, Math.round((saved_amount / target_amount) * 100))`.

Additionally, **ThemeProvider** manages dark/light theme using `useLayoutEffect` (to prevent flash of wrong theme) and persists to `localStorage` under key `trackify_theme`.

The provider hierarchy in `App.tsx` is:
```
AuthProvider → ExpenseProvider → GoalProvider → Router → Routes
```

---

### **Q15. Why did you use Context API instead of Redux?**

**Answer:**
1. **Simplicity** — Our application has 3 distinct state domains (auth, expenses, goals) that don't need complex cross-domain interactions. Context API handles this cleanly without Redux's boilerplate (actions, reducers, store, dispatch).
2. **Built-in** — Context API is built into React, requiring no additional dependency.
3. **Scale Appropriateness** — Redux is beneficial for very large applications with deeply nested state and complex state mutations. Trackify's state is relatively flat and straightforward.
4. **Performance** — With dedicated contexts per domain, re-renders are limited to consumers of the specific context that changed. If we used a single Redux store, any state change could trigger wider re-renders.

---

### **Q16. What is the `PrivateRoute` component and how does it work?**

**Answer:**
`PrivateRoute` is a route guard component that protects authenticated pages from unauthorized access:

```typescript
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isDemo } = useAuth();
  return (user || isDemo) ? <>{children}</> : <Navigate to="/login" />;
}
```

**How it works:**
- It checks if `user` exists (logged-in user) OR `isDemo` is true (demo mode active)
- If either condition is met, it renders the `children` (the protected page)
- If neither is met, it uses React Router's `<Navigate>` component to redirect to `/login`
- All authenticated routes in `App.tsx` are wrapped with `<PrivateRoute>`

---

### **Q17. How does routing work in Trackify?**

**Answer:**
We use **React Router DOM v7** with `BrowserRouter` for client-side SPA routing. The routes are defined in `App.tsx`:

| Route | Component | Protected? |
|-------|-----------|-----------|
| `/` | `LandingPage` | No |
| `/login` | `LoginPage` | No |
| `/register` | `RegisterPage` | No |
| `/dashboard` | `DashboardPage` | Yes |
| `/transactions` | `TransactionsPage` | Yes |
| `/analytics` | `AnalyticsPage` | Yes |
| `/goals` | `GoalsPage` | Yes |
| `/investments` | `InvestmentsPage` | Yes |
| `/budget` | `BudgetPage` | Yes |
| `/profile` | `ProfilePage` | Yes |
| `/add-transaction` | `AddTransactionPage` | Yes |
| `*` | `NotFoundPage` | No |

On the Vercel side, `vercel.json` contains a rewrite rule `"source": "/(.*)"` → `"destination": "/"` to ensure all routes are handled by the SPA's `index.html`, preventing 404 errors on direct URL access or page refresh.

---

### **Q18. What is the Demo Mode and how is it implemented?**

**Answer:**
Demo Mode allows users to explore the full application without creating an account. Implementation:

1. **Activation** — User clicks "Try Demo" on the landing page → `activateDemo()` in AuthContext sets `isDemo = true` and `user = demoUser` where `demoUser = { id: 'demo', username: 'Demo User', email: 'demo@trackify.com' }`
2. **Data Loading** — ExpenseContext's `loadDemoData()` populates mock transactions (e.g., "Monthly Salary ₹50,000", "Swiggy Orders ₹2,200") and GoalContext's `loadDemoGoals()` populates dummy goals ("Buy Laptop ₹70,000", "Goa Trip ₹25,000")
3. **Route Access** — `PrivateRoute` checks `user || isDemo`, so demo users can access all protected routes
4. **No API Calls** — In demo mode, no backend API calls are made; all data is loaded from in-memory mock data
5. **Exit** — Clicking logout clears `isDemo`, `user`, and `token`, redirecting back to the landing page

---

### **Q19. How does the theme toggle (dark/light mode) work?**

**Answer:**
The Theme system works through `ThemeProvider` in `context/ThemeContext.tsx`:

1. **State Initialization** — Reads the saved theme from `localStorage.getItem('trackify_theme')`. Defaults to `'dark'`.
2. **Application** — Uses `useLayoutEffect` (not `useEffect`) to toggle a CSS class on `document.documentElement` (the `<html>` element):
   - Dark mode: removes `'light'` class (dark is default)
   - Light mode: adds `'light'` class
3. **Persistence** — Saves the chosen theme to `localStorage` on every change
4. **CSS Variables** — CSS custom properties (e.g., `--bg-card`, `--border-card`, `--text-secondary`) change values based on `html.light` vs default
5. **Why `useLayoutEffect`?** — It runs synchronously after DOM mutations but before the browser paints, preventing a "flash of wrong theme" (FOWT). If we used `useEffect`, the user would briefly see the wrong theme on page load.

---

### **Q20. How is data exported to Excel?**

**Answer:**
The export functionality is in the `ProfilePage` component, using two libraries:

1. **SheetJS (xlsx)** — Converts JavaScript arrays/objects into Excel workbook format
2. **FileSaver** — Triggers the browser's file download dialog

**Process:**
1. User clicks "Export to Excel" on the Profile page
2. Transaction data is mapped into an array of objects with columns: Type, Description, Amount (₹), Category/Source, Date
3. SheetJS's `XLSX.utils.json_to_sheet()` creates a worksheet from the array
4. `XLSX.utils.book_new()` creates a workbook and appends the worksheet
5. `XLSX.write()` generates the binary .xlsx output
6. FileSaver's `saveAs()` triggers the download with filename `trackify_transactions.xlsx`

All processing happens client-side — no server round-trip needed.

---

### **Q21. What animations does Trackify use and how are they implemented?**

**Answer:**
Trackify uses **Framer Motion** (imported as `motion/react`) for animations:

1. **Page Transitions** — Fade-in and slide-up on page mount using `motion.div` with `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`
2. **Market Card Stagger** — Cards appear sequentially with `transition={{ delay: index * 0.05 }}`
3. **Chat Window** — `AnimatePresence` handles enter/exit animations for the chatbot popup
4. **Loading Skeletons** — CSS `animate-pulse` class for placeholder content during data fetches
5. **Button Interactions** — `hover:scale-105` and `active:scale-95` for press effects
6. **Live Indicator** — `animate-pulse` CSS on the "LIVE" badge in market cards
7. **Goal Progress Bars** — Animated width transitions on progress bars

---

### **Q22. What are the TypeScript interfaces defined in `types.ts`?**

**Answer:**
Four core interfaces:

```typescript
// 1. Transaction — unified record for both income and expenses
export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType; // 'income' | 'expense'
  category: string;
  date: string;        // YYYY-MM-DD format
  description: string;
}

// 2. Budget — monthly spending limit
export interface Budget {
  month: string;  // YYYY-MM format
  amount: number;
}

// 3. User — authenticated user profile
export interface User {
  id: string;
  username: string;
  email: string;
}

// 4. Goal — savings goal with progress
export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  deadline: string;
  progress: number;  // 0-100 percentage
}
```

`TransactionType` is a type alias: `'income' | 'expense'`.

---

### **Q23. What charts are used in the Analytics page?**

**Answer:**
We use the **Recharts** library (built on D3.js) for two main chart types:

1. **Pie Chart** — Shows expense distribution by category (Food, Travel, Bills, Shopping, Entertainment, Health, Education, Other). Each slice is color-coded, interactive with hover tooltips showing exact amounts and percentages.

2. **Bar Chart** — Shows monthly income vs expenses trend. Two bars per month (one for income in green, one for expenses in red). Allows users to identify spending patterns over time.

Both charts are responsive, meaning they resize based on the container width, and are implemented in the `ChartComponent.tsx` component.

---

### **Q24. How does the `getMonthlySummary()` function work in ExpenseContext?**

**Answer:**
```typescript
const getMonthlySummary = (month: string) => {
  // Filter transactions matching the given month (YYYY-MM format)
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(month));
  
  // Sum all income transactions
  const income = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Sum all expense transactions
  const expenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Find budget for the month
  const budget = budgets.find(b => b.month === month);
  const budgetAmount = budget?.amount || 0;
  
  // Calculate derived values
  const remainingBudget = budgetAmount - expenses;
  const netBalance = income - expenses;
  const availableSavings = Math.max(0, netBalance - allocatedToGoals);
  
  return { income, expenses, remainingBudget, budgetAmount, netBalance, availableSavings };
};
```

This function is used by the Dashboard, Budget page, and ChatBot to compute financial summaries. It takes a month string like `"2026-04"` and returns all key financial metrics for that month.

---

### **Q25. What is the `savingsTier` system in the LiveMarketData component?**

**Answer:**
The `LiveMarketData` component uses a tier-based filtering system to show market data relevant to the user's savings level:

| Tier | Savings Range | Market Data Shown |
|------|--------------|-------------------|
| `none` | ₹0 or negative | No market data |
| `starter` | Low savings | Gold (commodity) only |
| `growing` | Moderate | Mirae Asset Large Cap, Axis Bluechip, PPF rate |
| `moderate` | Mid-range | Market indices (Nifty, Sensex), FD rate, Nasdaq 100 MF |
| `good` | Good savings | Blue-chip stocks (Reliance, TCS, HDFC Bank), Parag Parikh Flexi Cap |
| `excellent` | High savings | Indices, REITs (Embassy, Mindspace), ELSS tax-saving funds |

This tier is computed in the Dashboard based on the user's net balance and passed as a prop to the `LiveMarketData` component. The logic uses `useMemo` to efficiently recompute filtered data only when `data` or `savingsTier` changes.

---

### **Q26. How does the `keepAlive` mechanism work?**

**Answer:**
Render's free tier puts the backend to sleep after 15 minutes of inactivity. To prevent this:

1. In `main.tsx`, a `setInterval` runs every **10 minutes** (600,000 ms)
2. It sends a `fetch()` request to the backend root endpoint (`GET /`)
3. The backend responds with `"Backend is running 🚀"` (200 OK)
4. This keeps the Render container alive

```typescript
setInterval(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL
      || 'https://expense-tracker-89aa.onrender.com';
    await fetch(`${baseUrl}/`);
  } catch {}
}, 10 * 60 * 1000);
```

The `catch {}` block silently ignores any network errors to avoid console spam.

---

### **Q27. How does the Navbar component work?**

**Answer:**
The `Navbar.tsx` component (10,906 bytes) provides:

1. **Logo & Brand Name** — "Trackify" with a link to /dashboard
2. **Navigation Links** — Dashboard, Add Transaction, Transactions, Analytics, Goals, Investments, Budget, Profile
3. **Theme Toggle** — A button that switches between dark and light mode using `useTheme()` context
4. **Logout Button** — Calls `logout()` from AuthContext, clears all state and localStorage
5. **Responsive Design** — Full horizontal navbar on desktop, collapsible hamburger menu on mobile/tablet
6. **Active Route Highlighting** — Uses React Router's location to highlight the current page link
7. **Sticky Positioning** — Navbar stays fixed at the top of the viewport during scroll

---

### **Q28. What is `createPortal` and why is it used in the ChatBot?**

**Answer:**
`createPortal` is a React DOM utility that renders a component outside its parent's DOM hierarchy while keeping it inside React's component tree.

In `ChatBot.tsx`, we use `createPortal` to render the floating chat button and chat window directly into `document.body`:

```typescript
return createPortal(
  <div className="fixed bottom-6 right-6 z-50">
    {/* Chat button and window */}
  </div>,
  document.body
);
```

**Why?** Without `createPortal`:
- The chatbot would be nested inside the current page's DOM, inheriting its `overflow: hidden`, `z-index`, or `transform` properties
- These CSS properties would clip the chat window or place it behind other elements
- By portaling to `document.body`, the chatbot is always on top (z-index: 50) and never clipped by parent containers

---

### **Q29. What is the `StarfieldBackground` component?**

**Answer:**
`StarfieldBackground.tsx` is a decorative component used on the Landing Page to create an animated starfield effect in the background. It renders small dots (stars) that slowly animate, creating a space-like aesthetic that gives the landing page a premium, modern feel. This enhances the first impression and visual appeal of the application.

---

### **Q30. How does the frontend handle API errors?**

**Answer:**
Error handling is done at multiple levels:

1. **Network Errors** — All `fetch()` calls are wrapped in `try-catch` blocks. Failed requests are logged to `console.error()`.
2. **HTTP Status Codes** — After receiving a response, we check `if (!res.ok)` to detect 4xx/5xx responses. For login/register, specific error messages from the backend (e.g., "Invalid credentials", "User already registered") are displayed to the user.
3. **Gemini API Rate Limiting** — The chatbot specifically handles HTTP 429 (Too Many Requests) with a user-friendly message: "Too many requests. Please wait a few seconds."
4. **Market Data Failures** — If live market data fails to fetch, an error banner with a "Retry" button is shown. Individual market entries that fail gracefully return `null` prices.
5. **Graceful Degradation** — If the backend is completely down, the frontend still renders (shows empty data). Demo mode continues working entirely without a backend.

---

# **Section 3 — Backend (Flask, REST API)**

---

### **Q31. Why did you choose Flask instead of Django or FastAPI?**

**Answer:**
1. **Lightweight & Flexible** — Flask is a micro-framework with minimal boilerplate. We only add what we need (JWT, CORS, Bcrypt) via extensions.
2. **Blueprint Architecture** — Flask Blueprints allow modular route organization (auth_bp, expense_bp, income_bp, budget_bp, goal_bp, market_bp).
3. **Simple Learning Curve** — Flask's simplicity makes it ideal for a time-bound academic project.
4. **Raw SQL Control** — Unlike Django's mandatory ORM, Flask allows us to use raw psycopg2 queries, giving full control over SQL and eliminating ORM overhead.
5. **Adequate for Scale** — Our API handles straightforward CRUD operations and external API proxying. Flask handles this efficiently without Django's heavy middleware stack.

Django was overkill (admin panel, ORM migrations, template engine — all unnecessary). FastAPI would have been a good alternative but Flask had better library support for JWT and OAuth at the time of development.

---

### **Q32. What are Flask Blueprints and how are they used?**

**Answer:**
Flask Blueprints are a way to organize a Flask application into modular components. Each Blueprint groups related routes together.

In Trackify, we have 6 Blueprints:

```python
auth_bp = Blueprint('auth', __name__)       # /register, /login, /auth/google
expense_bp = Blueprint('expense', __name__)  # /expenses
income_bp = Blueprint('income', __name__)    # /income
budget_bp = Blueprint('budget', __name__)    # /budget
goal_bp = Blueprint('goal', __name__)        # /goals
market_bp = Blueprint('market', __name__)    # /market/*
```

They are registered in `app.py`:
```python
app.register_blueprint(auth_bp)
app.register_blueprint(expense_bp)
# ... etc
```

**Benefits:**
- Clean separation of concerns
- Each Blueprint can be in its own file (`routes/auth_routes.py`, etc.)
- Easier to test and maintain individual route groups

---

### **Q33. Explain the `app.py` file — what happens when the Flask app starts?**

**Answer:**
`app.py` is the entry point. On startup:

1. **Load Environment** — `load_dotenv()` loads variables from `.env`
2. **Create Flask App** — `app = Flask(__name__)`
3. **Load Config** — `app.config.from_object(Config)` loads `SECRET_KEY` and `DATABASE_URL`
4. **Configure JWT** — `JWTManager(app)` initializes JWT with `JWT_SECRET_KEY` from environment
5. **Configure Bcrypt** — `Bcrypt(app)` initializes password hashing
6. **Configure CORS** — Allows requests from localhost ports (3000, 3001, 3002, 5173) and `https://trackify-beta.vercel.app` and `https://*.vercel.app`. Supports credentials, allows `Content-Type` and `Authorization` headers, and permits `GET, POST, PUT, DELETE, OPTIONS` methods.
7. **Register Blueprints** — All 6 route Blueprints are registered
8. **Create Tables** — Within `app.app_context()`, calls `create_users_table()`, `create_expenses_table()`, `create_income_table()`, `create_budgets_table()`, `create_goals_table()` — each runs a `CREATE TABLE IF NOT EXISTS` SQL statement
9. **Start Server** — In development, runs on `0.0.0.0:8000` with debug mode. In production, Gunicorn handles this.

---

### **Q34. How does the `get_db()` function work?**

**Answer:**
```python
def get_db():
    conn = psycopg2.connect(
        os.getenv("DATABASE_URL"),
        connect_timeout=30,
        keepalives=1,
        keepalives_idle=30,
        keepalives_interval=10,
        keepalives_count=5
    )
    return conn
```

This function creates a **fresh PostgreSQL connection** for every request using `psycopg2.connect()`.

**Parameters explained:**
- `DATABASE_URL` — Neon PostgreSQL connection string (e.g., `postgres://user:pass@host/db?sslmode=require`)
- `connect_timeout=30` — Allows up to 30 seconds for initial connection (needed for Neon's cold start when the database is auto-suspended)
- `keepalives=1` — Enables TCP keep-alive probes to detect stale connections
- `keepalives_idle=30` — Sends the first probe after 30 seconds of inactivity
- `keepalives_interval=10` — Sends subsequent probes every 10 seconds
- `keepalives_count=5` — Closes the connection after 5 consecutive failed probes

**Note:** This creates a new connection per request (no connection pooling), which is acceptable for our scale but would need `psycopg2.pool.ThreadedConnectionPool` for high-traffic production use.

---

### **Q35. Why did you use raw SQL (psycopg2) instead of an ORM like SQLAlchemy?**

**Answer:**
1. **Full SQL Control** — Raw queries let us write exactly the SQL we need without ORM abstractions
2. **Simplicity** — Our queries are straightforward CRUD operations. An ORM adds unnecessary complexity for simple `INSERT`, `SELECT`, `UPDATE`, `DELETE` statements.
3. **No Migration Overhead** — We use `CREATE TABLE IF NOT EXISTS` for schema creation, avoiding the need for Alembic migrations
4. **Performance** — Raw psycopg2 is the fastest PostgreSQL adapter for Python; no ORM translation layer
5. **Learning Value** — Direct SQL demonstrates understanding of database operations (valuable for academic evaluation)

However, for a larger production application, SQLAlchemy with Alembic migrations would be preferred for schema versioning and relationship management.

---

### **Q36. How does CORS work in your application?**

**Answer:**
CORS (Cross-Origin Resource Sharing) is configured in `app.py` using `flask-cors`:

```python
CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "https://trackify-beta.vercel.app",
        "https://*.vercel.app"
    ]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)
```

**Why CORS is needed:** The frontend (on `trackify-beta.vercel.app`) and backend (on `expense-tracker-89aa.onrender.com`) are on different domains. Without CORS, browsers block cross-origin API requests as a security measure.

**How it works:**
1. Browser sends a **preflight OPTIONS request** before the actual request
2. Backend responds with `Access-Control-Allow-Origin` header matching the requestor's origin
3. If the origin is in our whitelist, the browser allows the actual request
4. `supports_credentials=True` allows cookies/auth headers to be sent
5. `Authorization` is explicitly allowed in headers (needed for JWT Bearer tokens)

---

### **Q37. Explain the complete API endpoint reference.**

**Answer:**

| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|--------------|----------|
| POST | `/register` | No | `{name, email, password}` | `{message}` 201 |
| POST | `/login` | No | `{email, password}` | `{token, user}` 200 |
| POST | `/auth/google` | No | `{credential}` | `{token, user}` 200 |
| GET | `/expenses` | JWT | — | `[{id, title, amount, category, date, note}]` |
| POST | `/expenses` | JWT | `{title, amount, category, note}` | `{message}` 201 |
| DELETE | `/expenses/:id` | JWT | — | `{message}` 200 |
| POST | `/expenses/categorize` | No | `{description}` | `{category}` 200 |
| GET | `/income` | JWT | — | `[{id, title, amount, source, date}]` |
| POST | `/income` | JWT | `{title, amount, source}` | `{message}` 201 |
| DELETE | `/income/:id` | JWT | — | `{message}` 200 |
| POST | `/income/categorize` | No | `{description}` | `{source}` 200 |
| GET | `/budget` | JWT | — | `[{id, category, limit_amount, month}]` |
| POST | `/budget` | JWT | `{category, limit_amount, month}` | `{message}` 201 |
| GET | `/goals` | JWT | — | `[{id, name, target_amount, saved_amount, deadline}]` |
| POST | `/goals` | JWT | `{name, target_amount, saved_amount, deadline}` | `{message}` 201 |
| PUT | `/goals/:id` | JWT | `{saved_amount}` | `{message}` 200 |
| DELETE | `/goals/:id` | JWT | — | `{message}` 200 |
| GET | `/market/all` | No | — | `{indices, stocks, sips, gold, elss, reits}` |

Total: **18 endpoints** across 6 Blueprints.

---

### **Q38. How does the budget upsert logic work?**

**Answer:**
In `models/budget.py`, the `set_budget()` function implements an upsert (update or insert):

```python
def set_budget(user_id, category, limit_amount, month):
    conn = get_db()
    cur = conn.cursor()
    # Step 1: Check if a budget already exists for this user and month
    cur.execute(
        "SELECT id FROM budgets WHERE user_id = %s AND month = %s",
        (user_id, month)
    )
    existing = cur.fetchone()
    if existing:
        # Step 2a: If exists, UPDATE the limit_amount
        cur.execute(
            "UPDATE budgets SET limit_amount = %s WHERE user_id = %s AND month = %s",
            (limit_amount, user_id, month)
        )
    else:
        # Step 2b: If not exists, INSERT a new budget
        cur.execute(
            "INSERT INTO budgets (user_id, category, limit_amount, month) VALUES (%s, %s, %s, %s)",
            (user_id, category, limit_amount, month)
        )
    conn.commit()
```

This prevents duplicate budgets for the same month and allows users to update their budget without deleting and recreating.

---

### **Q39. How does the `/expenses/categorize` endpoint differ from the `/expenses` POST endpoint?**

**Answer:**
- **`POST /expenses/categorize`** — A standalone categorization endpoint that takes a `{description}` and returns the predicted `{category}`. It does **not** require JWT authentication and does **not** store anything in the database. It's used by the frontend to dynamically suggest a category as the user types a description.

- **`POST /expenses`** — The actual data storage endpoint that requires JWT authentication. It takes `{title, amount, category, note}` and inserts a new expense record into the `expenses` table.

The categorize endpoint is separated so the frontend can call it in real-time (e.g., on input change) without needing to submit the full form.

---

### **Q40. Why do you handle OPTIONS requests manually in auth routes?**

**Answer:**
```python
@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
```

This handles CORS **preflight requests**. When the browser sends a cross-origin POST request with custom headers (`Content-Type: application/json`, `Authorization: Bearer ...`), it first sends an OPTIONS request to check if the server allows the actual request.

While `flask-cors` generally handles this automatically, explicitly returning `200` for OPTIONS ensures no edge cases where the preflight fails. This is a defensive coding pattern, especially important for authentication endpoints that must work reliably across all browsers.

---

### **Q41. What is Gunicorn and why is it used in production?**

**Answer:**
Gunicorn (Green Unicorn) is a production-grade **WSGI HTTP server** for Python web applications.

**Why not use Flask's built-in server in production?**
- Flask's `app.run()` uses Werkzeug's development server which is **single-threaded** and not designed for concurrent requests
- It has no process management, no graceful reloading, and no worker pool

**Gunicorn provides:**
1. **Multi-worker process management** — Spawns multiple worker processes to handle concurrent requests
2. **Graceful restarts** — Can reload workers without dropping connections
3. **Signal handling** — Proper UNIX signal handling for graceful shutdown
4. **Production stability** — Battle-tested in production at scale

On Render, the start command is `gunicorn app:app` which tells Gunicorn to serve the `app` object from the `app.py` module.

---

### **Q42. What does `psycopg2.extras.RealDictCursor` do?**

**Answer:**
By default, psycopg2 returns query results as tuples:
```python
# Default cursor:
cur.execute("SELECT id, name, email FROM users WHERE id = 1")
result = cur.fetchone()  # Returns: (1, 'Ayush', 'ayush@example.com')
```

`RealDictCursor` returns results as Python dictionaries:
```python
# RealDictCursor:
cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
cur.execute("SELECT id, name, email FROM users WHERE id = 1")
result = cur.fetchone()  # Returns: {'id': 1, 'name': 'Ayush', 'email': 'ayush@example.com'}
```

**Why we use it:** It makes results directly serializable with `jsonify()` and allows dictionary key access (`user['email']`) instead of index-based access (`user[2]`), making the code more readable and less error-prone.

---

### **Q43. How does the backend handle table creation?**

**Answer:**
Tables are created on application startup in `app.py` using `app.app_context()`:

```python
with app.app_context():
    try:
        create_users_table()
        create_expenses_table()
        create_income_table()
        create_budgets_table()
        create_goals_table()
        print("All tables ready!")
    except Exception as e:
        print(f"Error during table creation: {e}")
```

Each model file (e.g., `models/user.py`) contains a `create_*_table()` function that runs `CREATE TABLE IF NOT EXISTS ...`. The `IF NOT EXISTS` clause ensures:
- First deployment: Tables are created
- Subsequent restarts: Tables already exist, so no action is taken (no errors, no data loss)

**Limitation:** There is no migration system. If we need to alter a table schema (e.g., add a new column), we'd need to run manual `ALTER TABLE` commands or drop and recreate the table.

---

### **Q44. How does the Flask app configuration work?**

**Answer:**
Configuration is managed in `config.py`:

```python
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY")
```

In `app.py`:
```python
app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
```

Environment variables are loaded from `.env` via `python-dotenv`:
- `DATABASE_URL` — PostgreSQL connection string
- `SECRET_KEY` — Flask's secret key for session management
- `JWT_SECRET_KEY` — Secret key for signing JWT tokens
- `GOOGLE_CLIENT_ID` — Google OAuth client ID for token verification

**Note:** The `SQLALCHEMY_*` settings in Config are legacy remnants from an initial SQLAlchemy setup that was later replaced with raw psycopg2. They don't affect the current application behavior.

---

### **Q45. How is the `delete_expense_route` secured?**

**Answer:**
```python
@expense_bp.route('/expenses/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_expense_route(id):
    delete_expense(id)
    return jsonify({"message": "Expense deleted"}), 200
```

Security layers:
1. **`@jwt_required()`** — The Flask-JWT-Extended decorator validates the JWT token from the `Authorization: Bearer <token>` header. If the token is missing, expired, or invalid, a 401/422 error is returned automatically.
2. **Route parameter typing** — `<int:id>` ensures only integer IDs are accepted. Non-integer values return a 404.

**Known limitation:** The current implementation does **not** verify that the expense belongs to the requesting user (no `WHERE user_id = current_user AND id = :id` check). This means theoretically a user could delete another user's expense if they know the ID. This is noted as a future improvement.

---

### **Q46. What HTTP status codes does your API use?**

**Answer:**
- **200 OK** — Successful GET, PUT, DELETE operations
- **201 Created** — Successful POST operations (new resource created)
- **400 Bad Request** — Invalid Google OAuth token
- **401 Unauthorized** — Invalid login credentials
- **404 Not Found** — Invalid route (handled by Flask's default)
- **422 Unprocessable Entity** — JWT validation errors (missing/expired token)

---

### **Q47. How do you handle `OPTIONS` preflight in your API?**

**Answer:**
CORS preflight OPTIONS requests are handled in two ways:
1. **Globally** by `flask-cors` which automatically responds to OPTIONS with appropriate CORS headers
2. **Explicitly** in auth routes (`if request.method == 'OPTIONS': return '', 200`) as a defensive measure for the most critical endpoints

---

### **Q48. What happens if the database connection fails?**

**Answer:**
- `get_db()` has a `connect_timeout=30` which allows 30 seconds for the connection
- If Neon's serverless database is cold (auto-suspended), it may take 2-3 seconds to wake up — the 30-second timeout accommodates this
- If the connection truly fails, the `psycopg2.OperationalError` propagates up, and Flask returns a 500 Internal Server Error
- On app startup, table creation failures are caught and logged: `print(f"Error during table creation: {e}")`

---

### **Q49. How does the `income_routes.py` differ from `expense_routes.py`?**

**Answer:**
They are structurally identical but operate on different tables and fields:
- Expenses have `category` and `note` fields; Income has `source` field
- Expenses use `categorize_expense()` from the categorizer; Income uses `categorize_income()`
- Expenses have 8 categories; Income has 4 sources (+ "Other")
- Both support GET (list), POST (create), DELETE operations
- Both require JWT authentication for CRUD but not for categorization

---

### **Q50. What is the structure of API responses?**

**Answer:**
All API responses follow a consistent JSON format:

**Success responses:**
```json
// Single operation
{"message": "Expense added successfully"}

// Login/Register
{"token": "eyJhbG...", "user": {"id": 1, "username": "Ayush", "email": "ayush@example.com"}}

// List operations
[{"id": 1, "title": "Swiggy", "amount": 450, "category": "Food", "date": "2026-04-20T12:00:00", "note": "Lunch"}]
```

**Error responses:**
```json
{"message": "Invalid credentials"}
{"error": "Token verification failed"}
```

---

# **Section 4 — Database (PostgreSQL, Schema Design)**

---

### **Q51. Why did you choose PostgreSQL over MySQL or MongoDB?**

**Answer:**
1. **ACID Compliance** — PostgreSQL provides full ACID compliance ensuring data integrity for financial transactions
2. **Data Relationships** — Our data is highly relational (users → expenses, income, budgets, goals) making an RDBMS the right choice over MongoDB (document)
3. **Neon Hosting** — Neon provides serverless PostgreSQL with auto-suspend, branching, and a generous free tier — ideal for academic projects
4. **Advanced Features** — PostgreSQL supports JSON columns, array types, and window functions if needed for future analytics
5. **Industry Standard** — PostgreSQL is the most advanced open-source RDBMS, widely used in production

MongoDB was considered but rejected because our data is structured, relational, and benefits from JOIN capabilities and schema enforcement.

---

### **Q52. Describe the database schema.**

**Answer:**
Five tables with one-to-many relationships from `users` to all others:

**1. `users`** — Stores user accounts
- `id` (SERIAL PK), `name` (VARCHAR 100), `email` (VARCHAR 120 UNIQUE), `password` (VARCHAR 200)

**2. `expenses`** — Stores expense records
- `id` (SERIAL PK), `user_id` (FK → users), `title` (VARCHAR 100), `amount` (FLOAT), `category` (VARCHAR 50), `date` (TIMESTAMP DEFAULT NOW), `note` (VARCHAR 200)

**3. `income`** — Stores income records
- `id` (SERIAL PK), `user_id` (FK → users), `title` (VARCHAR 100), `amount` (FLOAT), `source` (VARCHAR 100), `date` (TIMESTAMP DEFAULT NOW)

**4. `budgets`** — Stores monthly budget limits
- `id` (SERIAL PK), `user_id` (FK → users), `category` (VARCHAR 50), `limit_amount` (FLOAT), `month` (VARCHAR 20)

**5. `goals`** — Stores savings goals
- `id` (SERIAL PK), `user_id` (FK → users), `name` (VARCHAR 100), `target_amount` (FLOAT), `saved_amount` (FLOAT DEFAULT 0), `deadline` (DATE)

---

### **Q53. What are the relationships between the tables?**

**Answer:**
All relationships are **One-to-Many** from `users`:
- `users` 1 → * `expenses` (each user has many expenses)
- `users` 1 → * `income` (each user has many income records)
- `users` 1 → * `budgets` (each user has budgets for multiple months)
- `users` 1 → * `goals` (each user has multiple savings goals)

The foreign key is `user_id INTEGER REFERENCES users(id)` in each child table.

---

### **Q54. Why is `email` marked as UNIQUE in the users table?**

**Answer:**
The `UNIQUE` constraint on `email` serves two purposes:
1. **Login Identifier** — Email is used as the login credential; duplicates would cause ambiguous authentication
2. **Account Uniqueness** — Prevents the same person from creating multiple accounts with the same email
3. **Google OAuth De-duplication** — When a user logs in via Google OAuth, we check if a user with that email already exists. The UNIQUE constraint ensures the lookup `get_user_by_email(email)` returns at most one result.

This also creates an implicit **B-tree index** on the `email` column, making email lookups `O(log n)` instead of `O(n)`.

---

### **Q55. Why did you use `FLOAT` for monetary amounts instead of `DECIMAL`?**

**Answer:**
Using `FLOAT` is a known trade-off in this project:
- **Advantage:** Simpler to work with in Python (native `float` type). No need for `Decimal` conversions.
- **Limitation:** Floating-point arithmetic can cause precision errors (e.g., `0.1 + 0.2 = 0.30000000000000004`).

For a production financial application, `DECIMAL(12,2)` or `NUMERIC(12,2)` would be the correct choice because:
- `DECIMAL` provides exact decimal arithmetic
- Financial calculations (interest, tax, rounding) require precision
- Regulatory compliance often mandates fixed-point arithmetic

This is documented as a known limitation and future improvement.

---

### **Q56. What is Neon and why was it chosen?**

**Answer:**
Neon is a **serverless PostgreSQL** hosting platform. Key features:
1. **Auto-Suspend** — Database suspends after inactivity, reducing costs (wakes up on first query)
2. **Free Tier** — Generous free tier with 512 MB storage (sufficient for academic projects)
3. **Serverless Scaling** — Automatically scales compute based on demand
4. **Database Branching** — Can create database branches (like Git branches) for testing
5. **Standard PostgreSQL** — Full PostgreSQL 16 compatibility; psycopg2 connects normally

**Cold Start Issue:** After auto-suspend, the first connection takes 2-3 seconds. This is why `get_db()` sets `connect_timeout=30` — to accommodate cold starts without timing out.

---

### **Q57. Why is there no migration system?**

**Answer:**
We use `CREATE TABLE IF NOT EXISTS` for schema management instead of a migration tool like Alembic because:
1. **Simplicity** — The schema is stable; we don't expect frequent schema changes
2. **Academic Scope** — Migrations add complexity without academic value for this project
3. **Single Developer** — No risk of schema conflicts from multiple developers

**Trade-off:** If we need to add a column (e.g., adding a `currency` field to expenses), we'd need to run manual `ALTER TABLE expenses ADD COLUMN currency VARCHAR(10) DEFAULT 'INR'` directly on the database. This is a known limitation.

---

### **Q58. How is data integrity maintained?**

**Answer:**
1. **Foreign Keys** — `REFERENCES users(id)` in all child tables ensures expenses/income/budgets/goals cannot reference non-existent users
2. **NOT NULL Constraints** — Critical fields (`name`, `email`, `password`, `title`, `amount`, `category`) cannot be null
3. **UNIQUE Constraint** — Email uniqueness prevents duplicate accounts
4. **DEFAULT Values** — `date DEFAULT CURRENT_TIMESTAMP` auto-fills creation date; `saved_amount DEFAULT 0` initializes goals correctly
5. **Parameterized Queries** — All SQL queries use `%s` placeholders, preventing SQL injection which could corrupt data
6. **Transaction Commits** — Every write operation follows `execute() → commit() → close()` ensuring atomicity

---

### **Q59. How would you add an index to improve query performance?**

**Answer:**
Currently, the only index is the implicit one on `users.email` (from the UNIQUE constraint). For better performance:

```sql
-- Index on user_id for faster joins and filtering
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_income_user_id ON income(user_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);

-- Composite index for budget lookups
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);

-- Index on expense date for time-range queries
CREATE INDEX idx_expenses_date ON expenses(date);
```

These would improve performance when the data grows beyond a few thousand records per user.

---

### **Q60. What is the password field's VARCHAR(200) size for?**

**Answer:**
Bcrypt-hashed passwords produce a 60-character string like:
```
$2b$12$LJGs7aT3sLPJHK3kW3T5C.sREgvqT2X93jnXhj5V3v6T7V5xK/2Gy
```

The format is: `$2b$` (algorithm) + `12$` (cost factor) + 22 chars (salt) + 31 chars (hash) = ~60 characters.

VARCHAR(200) provides ample room for:
- Current bcrypt output (60 chars)
- Future algorithm changes that might produce longer hashes (e.g., Argon2id)
- Google OAuth users who get randomly generated passwords using `secrets.token_hex(16)` (32 chars before hashing, ~60 chars after)

---

### **Q61. What is `SERIAL` in PostgreSQL?**

**Answer:** `SERIAL` is a PostgreSQL shorthand for creating an auto-incrementing integer column. `id SERIAL PRIMARY KEY` is equivalent to creating a sequence and setting `DEFAULT nextval('sequence_name')`. Each new row automatically gets the next integer value.

---

### **Q62. Why `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` for the date field?**

**Answer:** It automatically records when a transaction was created without requiring the frontend to send a timestamp. This ensures consistent server-time dates regardless of the user's local timezone or clock settings.

---

### **Q63. Why is `note` nullable in the expenses table?**

**Answer:** Notes are optional additional information. Not every expense needs a note. Making it nullable (`VARCHAR(200)` without `NOT NULL`) allows flexibility — users can add notes when relevant (e.g., "Shared with Rahul") or leave it empty.

---

### **Q64. Why store `month` as VARCHAR(20) instead of DATE in the budgets table?**

**Answer:** We store month as a string in `YYYY-MM` format (e.g., "2026-04") because budgets are monthly aggregates, not daily. String comparison (`WHERE month = '2026-04'`) is simpler and avoids date arithmetic. VARCHAR(20) gives room for formats like "2026-04" (7 chars).

---

### **Q65. What is the `deadline` field type in goals?**

**Answer:** `deadline DATE` stores only the date (no time component). This is appropriate because savings goals have deadlines measured in days, not hours. The DATE type uses 4 bytes and supports date arithmetic (`deadline - CURRENT_DATE` gives days remaining).

---

# **Section 5 — Authentication (JWT, OAuth, Bcrypt)**

---

### **Q66. Explain how JWT authentication works in Trackify.**

**Answer:**
JWT (JSON Web Token) provides **stateless authentication**:

1. **Login:** User sends `{email, password}` to `POST /login`
2. **Verification:** Backend verifies password hash with `bcrypt.check_password_hash()`
3. **Token Generation:** Backend creates a JWT token: `create_access_token(identity=str(user['id']))`. The token payload contains the user's ID, creation time, and expiration time, signed with `JWT_SECRET_KEY` using HS256 algorithm.
4. **Token Storage:** Frontend stores the token in `localStorage` under key `trackify_token`
5. **Authenticated Requests:** Frontend sends token in the `Authorization: Bearer <token>` header for every protected API call
6. **Token Verification:** `@jwt_required()` decorator on protected routes extracts and verifies the token. `get_jwt_identity()` retrieves the user ID from the token payload.

**Why stateless?** No session is stored on the server. The server verifies the token's signature and expiration on every request. This allows horizontal scaling — any server instance can verify any token.

---

### **Q67. What is Bcrypt and how is it used for password security?**

**Answer:**
Bcrypt is a **cryptographic password hashing function** designed to be computationally expensive:

1. **Registration:** `bcrypt.generate_password_hash(data['password']).decode('utf-8')` generates a hash with a random salt
2. **Login:** `bcrypt.check_password_hash(user['password'], data['password'])` verifies the password against the stored hash

**Why Bcrypt?**
- **Salted:** Each password gets a unique random salt (embedded in the hash), so identical passwords produce different hashes
- **Adaptive:** The cost factor (12 rounds by default) makes hashing deliberately slow (~200-300ms). This prevents brute-force attacks — even if the database is compromised, cracking hashes is extremely slow.
- **One-way:** Cannot reverse-engineer the original password from the hash

**Example hash:** `$2b$12$LJGs7aT3sLPJHK3kW3T5C.sREgvqT2X93jnXhj5V3v6T7V5xK/2Gy`
- `$2b$` — Bcrypt version
- `12$` — Cost factor (2^12 = 4096 iterations)
- Next 22 chars — Salt
- Remaining 31 chars — Hash

---

### **Q68. How does Google OAuth 2.0 login work in Trackify?**

**Answer:**
**Step-by-step flow:**

1. **Frontend:** User clicks "Sign in with Google" → `@react-oauth/google` SDK opens a Google consent popup
2. **Google:** User authenticates with their Google account → Google returns a **credential token** (JWT issued by Google)
3. **Frontend:** Sends the credential token to `POST /auth/google` on the backend
4. **Backend:** Verifies the Google token using `google.oauth2.id_token.verify_oauth2_token()`:
   ```python
   id_info = id_token.verify_oauth2_token(
       token,
       google_requests.Request(),
       os.getenv("GOOGLE_CLIENT_ID")  # Must match our Google Cloud project
   )
   ```
5. **Extract Info:** Gets `email` and `name` from the verified token
6. **User Lookup:** Checks if a user with this email exists in the database
7. **Auto-Registration:** If no user exists, creates one with a random password: `secrets.token_hex(16)` → bcrypt hash
8. **JWT Generation:** Creates a Trackify JWT and returns it to the frontend
9. **Frontend:** Stores the JWT and user info in context/localStorage

**Why server-side verification?** Google tokens must be verified server-side to prevent token forgery. The `GOOGLE_CLIENT_ID` check ensures the token was issued for our application.

---

### **Q69. Why is `Cross-Origin-Opener-Policy: same-origin-allow-popups` needed?**

**Answer:**
This header is configured in `vercel.json`:
```json
{"key": "Cross-Origin-Opener-Policy", "value": "same-origin-allow-popups"}
```

**Why?** Google OAuth uses a **popup window** for the consent screen. By default, modern browsers set `Cross-Origin-Opener-Policy: same-origin` which prevents popups from communicating back to the opener window.

`same-origin-allow-popups` allows the Google OAuth popup to:
1. Open from our application
2. Complete authentication on Google's domain
3. Send the credential token back to our opener window

Without this header, the OAuth popup would silently fail or the credential would not be passed back.

---

### **Q70. How is the JWT token stored on the frontend?**

**Answer:**
The token is stored in two places:

1. **React State** — `const [token, setToken] = useState<string | null>()` in AuthContext for runtime access
2. **localStorage** — `localStorage.setItem('trackify_token', token)` for persistence across page refreshes

On app load, AuthContext initializes from localStorage:
```typescript
const [token, setToken] = useState<string | null>(() => {
  try { return localStorage.getItem('trackify_token'); }
  catch { return null; }
});
```

**Security considerations:**
- localStorage is accessible to any JavaScript on the same origin (XSS risk)
- However, React's JSX auto-escaping provides XSS protection
- For higher security, `httpOnly` cookies would be preferred (tokens inaccessible to JavaScript)

---

### **Q71. What happens when a user registers via Google OAuth who already has an email/password account?**

**Answer:**
The system handles this gracefully:

```python
user = get_user_by_email(email)
if not user:
    # New user — create with random password
    hashed = bcrypt.generate_password_hash(secrets.token_hex(16)).decode('utf-8')
    create_user(name, email, hashed)
    user = get_user_by_email(email)
```

If a user already exists with that email (registered via email/password), the code **skips user creation** and proceeds directly to JWT generation. The existing user can now login via **both** methods — email/password and Google OAuth — because they share the same email-based account.

---

### **Q72. What is `secrets.token_hex(16)` used for?**

**Answer:**
When a user signs up via Google OAuth, they don't provide a password. But the `users` table requires a password (NOT NULL constraint). So we generate a **cryptographically secure random password**:

```python
secrets.token_hex(16)  # Generates 32-character random hex string
# Example: "a1b2c3d4e5f67890a1b2c3d4e5f67890"
```

This password is then bcrypt-hashed and stored. The user never sees or uses this password — they always login via Google OAuth. If they ever want to use email/password login, they'd need a "forgot password" feature (not yet implemented).

---

### **Q73. What is the `get_jwt_identity()` function?**

**Answer:**
`get_jwt_identity()` is a Flask-JWT-Extended function that extracts the **identity** (user ID) from the current JWT token.

During login, we set the identity:
```python
token = create_access_token(identity=str(user['id']))
```

In protected routes, we retrieve it:
```python
@jwt_required()
def add_expense_route():
    user_id = get_jwt_identity()  # Returns the str(user_id)
    add_expense(user_id, ...)     # Use it to associate data with the user
```

This is how we know which user is making a request without requiring them to send their ID explicitly. The identity is embedded in the JWT payload and cryptographically verified.

---

### **Q74. What algorithm does JWT use for signing?**

**Answer:** HS256 (HMAC-SHA256) — a symmetric algorithm where the same `JWT_SECRET_KEY` is used for both signing and verification. It generates a 256-bit signature. This is appropriate for a single-server setup. For distributed systems, RS256 (asymmetric, public/private key pair) would be more suitable.

---

### **Q75. What happens if the JWT token expires?**

**Answer:** Flask-JWT-Extended returns a `401 Unauthorized` or `422 Unprocessable Entity` response. The frontend doesn't currently handle token expiry gracefully — the user would experience API failures until they manually logout and login again. Implementing token refresh is planned for future work.

---

### **Q76. Why do you store the user ID as a string in the JWT identity?**

**Answer:** `create_access_token(identity=str(user['id']))` converts the integer ID to string because Flask-JWT-Extended serializes it as JSON, and strings are the safest serializable type. On retrieval, `get_jwt_identity()` returns a string, which works with our parameterized SQL queries since psycopg2 handles the type conversion.

---

### **Q77. Can a user change their password?**

**Answer:** Currently, no. There is no "change password" or "forgot password" functionality. This is listed as a future improvement. To implement it, we'd add a `PUT /auth/password` endpoint that verifies the old password and updates with the new bcrypt hash.

---

### **Q78. How do you handle login failures?**

**Answer:**
```python
if not user or not bcrypt.check_password_hash(user['password'], data['password']):
    return jsonify({"message": "Invalid credentials"}), 401
```
We intentionally use the same vague message ("Invalid credentials") for both "email not found" and "wrong password" scenarios. This prevents attackers from enumerating which emails are registered.

---

### **Q79. Is the JWT token ever sent back to the server?**

**Answer:** Yes, on every authenticated API request. The frontend sends it in the HTTP header: `Authorization: Bearer eyJhbG...`. The `@jwt_required()` decorator extracts and validates it automatically.

---

### **Q80. What is the difference between `SECRET_KEY` and `JWT_SECRET_KEY`?**

**Answer:** `SECRET_KEY` is Flask's general secret used for session signing and CSRF protection. `JWT_SECRET_KEY` is specifically used by Flask-JWT-Extended for signing JWT tokens. They should be different values for defense-in-depth — compromising one doesn't compromise the other.

---

# **Section 6 — Auto-Categorization Engine**

---

### **Q81. How does the auto-categorization engine work?**

**Answer:**
The categorization engine (`utils/categorizer.py`) uses **keyword-based string matching**:

1. User enters a transaction description (e.g., "Swiggy Orders")
2. The description is converted to lowercase: `"swiggy orders"`
3. The system iterates through `CATEGORY_KEYWORDS` dictionary:
   - Each key is a category (Food, Travel, Shopping, etc.)
   - Each value is a list of keywords
4. For each keyword in each category, checks if the keyword exists in the description using Python's `in` operator
5. Returns the first matching category (e.g., "swiggy" matches → returns "Food")
6. If no keyword matches, returns "Other"

```python
def categorize_expense(description: str) -> str:
    d = description.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for k in keywords:
            if k in d:
                return category
    return "Other"
```

---

### **Q82. What are the 8 expense categories and their keywords?**

**Answer:**

| Category | Example Keywords |
|----------|-----------------|
| **Food** | swiggy, zomato, restaurant, cafe, food, pizza, burger, biryani, starbucks, bigbasket, blinkit, zepto |
| **Travel** | uber, ola, rapido, petrol, flight, irctc, metro, makemytrip, toll, parking |
| **Shopping** | amazon, flipkart, myntra, ajio, nykaa, clothes, shoes, electronics, laptop |
| **Bills** | electricity, wifi, rent, emi, loan, insurance, recharge, airtel, jio |
| **Entertainment** | netflix, spotify, movie, pvr, gaming, bookmyshow, concert, party |
| **Health** | hospital, doctor, medicine, gym, yoga, apollo, pharmeasy, 1mg |
| **Education** | school, college, udemy, coursera, books, coaching, exam, certification |
| **Other** | Empty keyword list — acts as the fallback |

---

### **Q83. What are the 4 income sources?**

**Answer:**

| Source | Keywords |
|--------|----------|
| **Salary** | salary, ctc, payroll, company, employer, office |
| **Freelance** | freelance, client, project, upwork, fiverr, consulting |
| **Investment** | dividend, interest, returns, mutual fund, stocks, profit |
| **Gift** | gift, birthday, wedding, bonus, reward |

Default: **"Other"** if no keywords match.

---

### **Q84. Why keyword-based approach instead of ML/AI?**

**Answer:**
1. **Deterministic** — Keywords produce consistent, predictable results. ML models can give inconsistent outputs for similar inputs.
2. **No Training Data Required** — ML requires labeled training datasets. We'd need thousands of categorized Indian transaction descriptions.
3. **Instant Performance** — String matching is O(n*m) where n=categories, m=keywords. ML inference adds latency.
4. **India-Specific** — Keywords include India-specific merchants (Swiggy, Zomato, Ola, Flipkart, IRCTC, BigBasket, Blinkit, Zepto) that generic ML models might not know.
5. **Easy to Extend** — Adding a new keyword is a one-line code change vs retraining an ML model.
6. **Academic Scope** — Keeps the project focused on full-stack development rather than ML.

---

### **Q85. What is a limitation of the keyword-based approach?**

**Answer:**
1. **Ambiguity** — "Amazon Prime" could be Shopping (the e-commerce site) or Entertainment (the streaming service). The current system would match "amazon" first and categorize it as Shopping.
2. **First-Match Bias** — The system returns the first matching category due to dictionary iteration order. This means the order of categories matters.
3. **False Positives** — Short keywords can cause incorrect categorization. E.g., "bar" matches Entertainment (intended for bar/pub), but "barber shop" would also match Entertainment.
4. **Unseen Merchants** — New merchants/services not in the keyword list default to "Other".
5. **Language** — Only works with English text. Hindi or regional language descriptions would all be categorized as "Other".

---

### **Q86. How is the categorize endpoint exposed via the API?**

**Answer:**
Two separate endpoints:
```
POST /expenses/categorize → { "description": "Swiggy order" } → { "category": "Food" }
POST /income/categorize   → { "description": "Monthly salary" } → { "source": "Salary" }
```

Both endpoints are **unauthenticated** (no JWT required) because they're pure utility functions that don't access user data. The frontend calls these endpoints in real-time as the user types a description, providing instant category suggestions.

---

### **Q87. How would you improve the categorization system?**

**Answer:**
1. **Machine Learning** — Train a text classifier (e.g., Naive Bayes, BERT) on a corpus of Indian transaction descriptions
2. **User Feedback Loop** — Let users correct wrong categories, then use those corrections to improve the system
3. **Fuzzy Matching** — Use Levenshtein distance for approximate keyword matching (handles typos)
4. **Multi-Language Support** — Add Hindi and regional language keywords
5. **Context-Aware** — Consider amount ranges (e.g., ₹500 at McDonald's is Food, not Shopping)
6. **Merchant Database** — Maintain a curated database of Indian merchant-to-category mappings

---

### **Q88. Does categorization happen on the frontend or backend?**

**Answer:**
**Both:**
- **Backend** — The `/expenses/categorize` and `/income/categorize` API endpoints accept a description and return a suggested category. This is the primary categorization mechanism.
- **Frontend** — The `AddTransactionPage` calls the categorization API as the user types, and pre-fills the category dropdown with the suggestion. The user can override the suggestion by manually selecting a different category.

The final category sent to the creation endpoint (`POST /expenses`) is whatever the user chose — auto-suggested or manually selected.

---

# **Section 7 — Live Market Data Pipeline**

---

### **Q89. How does the live market data pipeline work?**

**Answer:**
The market data pipeline (`routes/market_routes.py`) fetches real-time financial data:

1. **Single Endpoint** — `GET /market/all` triggers the entire pipeline
2. **Concurrent Fetching** — Uses `ThreadPoolExecutor(max_workers=10)` to fetch all data concurrently
3. **17 External API Calls** made simultaneously:
   - 11 Yahoo Finance calls (2 indices, 5 stocks, 1 gold, 2 REITs, 1 index)
   - 7 MFAPI calls (5 SIPs, 2 ELSS funds)
4. **Timeout Handling** — Each call has a 5-second HTTP timeout; each future has an 8-second result timeout
5. **Graceful Degradation** — If any individual fetch fails, it returns `{price: null, change: null}` but remaining data is still served
6. **Response Aggregation** — Results are organized into categories: `indices`, `stocks`, `sips`, `gold`, `elss`, `reits`

---

### **Q90. What is `ThreadPoolExecutor` and why is it used?**

**Answer:**
`ThreadPoolExecutor` is Python's built-in concurrent execution framework from `concurrent.futures`.

**Why threading?** Without concurrency, 17 sequential API calls with 5-second timeouts each could take up to 85 seconds. With `ThreadPoolExecutor(max_workers=10)`, all calls run simultaneously, completing in the time of the slowest call (~3-5 seconds).

```python
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = {
        key: executor.submit(func, *args)
        for key, (func, args) in tasks.items()
    }
    for key, future in futures.items():
        try:
            results[key] = future.result(timeout=8)
        except Exception:
            results[key] = {"name": args[1], "price": None, ...}
```

**Why 10 workers?** We have 17 tasks. 10 workers means the first 10 tasks start immediately, and as each completes, the remaining 7 are picked up. This balances concurrency with resource usage.

---

### **Q91. What data sources are used for market data?**

**Answer:**

| Source | Data | URL Pattern |
|--------|------|-------------|
| **Yahoo Finance** | Stock/index prices, gold, REITs | `https://query2.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=2d` |
| **MFAPI.in** | Mutual fund NAVs (Indian funds) | `https://api.mfapi.in/mf/{code}/latest` |

**Yahoo Finance symbols used:**
- `^NSEI` (Nifty 50), `^BSESN` (Sensex)
- `RELIANCE.NS`, `TCS.NS`, `HDFCBANK.NS`, `INFY.NS`, `ICICIBANK.NS`
- `GC=F` (Gold Futures)
- `EMBASSY.NS`, `MINDSPACE.NS` (REITs)

**MFAPI scheme codes used:**
- 119551 (Mirae Asset Large Cap), 120503 (Axis Bluechip), 125354 (Parag Parikh Flexi Cap)
- 118989 (SBI Small Cap), 120594 (Motilal Oswal Nasdaq 100)
- 127042 (Mirae Asset ELSS), 119913 (DSP Tax Saver ELSS)

---

### **Q92. How is price change calculated?**

**Answer:**
**For Yahoo Finance (stocks/indices):**
```python
meta = data["chart"]["result"][0]["meta"]
price = meta["regularMarketPrice"]      # Current price
prev = meta["previousClose"]             # Previous day's closing price
change = round(price - prev, 2)          # Absolute change
change_pct = round((change / prev) * 100, 2)  # Percentage change
```

**For MFAPI (mutual funds):**
```python
entries = data["data"]
nav = float(entries[0]["nav"])       # Latest NAV
prev_nav = float(entries[1]["nav"])  # Previous day's NAV
change = round(nav - prev_nav, 2)
change_pct = round((change / prev_nav) * 100, 2)
```

Both return `change` (absolute) and `change_pct` (percentage), displayed in the frontend as green (positive) or red (negative).

---

### **Q93. Why is SSL verification disabled in market data fetches?**

**Answer:**
```python
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
```

SSL verification is disabled because:
1. **Corporate/Proxy Environments** — Some corporate networks and proxies intercept HTTPS traffic with custom certificates that Python's `certifi` bundle doesn't trust
2. **Render Hosting** — Some hosting environments don't have up-to-date CA certificate bundles
3. **Yahoo Finance** — Yahoo Finance's API sometimes uses certificates from CDN providers that fail strict validation

**Security Note:** This is acceptable for **public market data** (non-sensitive, publicly available information). We would NOT disable SSL for authentication or personal data transfers. This is a trade-off between reliability and security for non-sensitive data.

---

### **Q94. Why is a `User-Agent` header sent with market data requests?**

**Answer:**
```python
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
}
```

Many APIs (especially Yahoo Finance) **block requests without a User-Agent** or with Python's default user agent (`python-urllib/3.x`). By mimicking a real browser, we:
1. Avoid being flagged as a bot
2. Avoid HTTP 403 Forbidden responses
3. Ensure consistent access to the API

This is a common technique for accessing publicly available API endpoints that don't require authentication keys.

---

### **Q95. How does the frontend auto-refresh market data?**

**Answer:**
In `LiveMarketData.tsx`:
```typescript
useEffect(() => {
  fetchData();                              // Initial fetch on component mount
  const id = setInterval(fetchData, 60_000); // Refresh every 60 seconds
  return () => clearInterval(id);            // Cleanup on unmount
}, []);
```

- Data fetches on component mount
- Auto-refreshes every **60 seconds** (60,000 ms)
- The cleanup function (`clearInterval`) runs when the component unmounts (user navigates away), preventing memory leaks and unnecessary network requests

---

### **Q96. What are the market data categories in the API response?**

**Answer:**
```json
{
  "indices": ["Nifty 50", "Sensex"],
  "stocks": ["Reliance", "TCS", "HDFC Bank", "Infosys", "ICICI Bank"],
  "sips": ["Mirae Asset Large Cap", "Axis Bluechip", "Parag Parikh Flexi Cap", "SBI Small Cap", "Motilal Oswal Nasdaq 100"],
  "gold": ["International Gold"],
  "elss": ["Mirae Asset Tax Saver ELSS", "DSP Tax Saver ELSS"],
  "reits": ["Embassy REIT", "Mindspace REIT"],
  "updated_at": "2026-04-20T15:30:00Z"
}
```

Each item has: `name`, `price`, `change`, `change_pct`, `updated_at`.

---

### **Q97. What happens if Yahoo Finance or MFAPI is down?**

**Answer:**
**Graceful degradation at multiple levels:**

1. **Individual Fetch Failure** — `fetch_json()` catches all exceptions and returns `None`. The caller checks for `None` and returns an empty result object (`{name, price: null, change: null, ...}`).

2. **Future Timeout** — `future.result(timeout=8)` throws `TimeoutError` after 8 seconds. The except block returns an empty result.

3. **Entire Pipeline Failure** — `market_all()` wraps everything in try-except. If the concurrent pipeline fails catastrophically, it returns empty arrays for all categories with a 200 status:
```python
return jsonify({
    "indices": [], "stocks": [], "sips": [],
    "gold": [], "elss": [], "reits": [],
    "updated_at": datetime.utcnow().isoformat() + "Z"
}), 200
```

4. **Frontend Handling** — If any item has `price: null`, the UI shows "₹—" instead of a price. An error banner with "Retry" button is shown if the entire fetch fails.

---

### **Q98. Why `urllib` instead of `requests` library?**

**Answer:**
The market routes use Python's built-in `urllib.request` instead of the popular `requests` library:
1. **Zero Dependencies** — `urllib` is part of Python's standard library, adding no extra package
2. **Sufficient Functionality** — We only need simple GET requests with custom headers and timeouts
3. **Thread-Safe** — `urlopen` is thread-safe for concurrent use with `ThreadPoolExecutor`
4. **Lower Overhead** — No session management, no connection pooling overhead for simple fire-and-forget requests

---

### **Q99. What stock symbols are tracked and what does `.NS` suffix mean?**

**Answer:**
`.NS` indicates the stock is listed on the **National Stock Exchange (NSE)** of India:
- `RELIANCE.NS` — Reliance Industries
- `TCS.NS` — Tata Consultancy Services
- `HDFCBANK.NS` — HDFC Bank
- `INFY.NS` — Infosys
- `ICICIBANK.NS` — ICICI Bank
- `EMBASSY.NS` — Embassy Office Parks REIT
- `MINDSPACE.NS` — Mindspace Business Parks REIT

For BSE Sensex, the symbol is `^BSESN`, and for Nifty 50, it's `^NSEI` (these are index symbols, not individual stocks).

`GC=F` represents Gold Futures (international gold price in USD per troy ounce).

---

### **Q100. How are MFAPI scheme codes determined?**

**Answer:**
Each mutual fund scheme in India has a unique AMFI scheme code assigned by the Association of Mutual Funds in India. We use these codes in the API URL:

| Code | Fund Name |
|------|-----------|
| 119551 | Mirae Asset Large Cap Fund |
| 120503 | Axis Bluechip Fund |
| 125354 | Parag Parikh Flexi Cap Fund |
| 118989 | SBI Small Cap Fund |
| 120594 | Motilal Oswal Nasdaq 100 Fund |
| 127042 | Mirae Asset Tax Saver (ELSS) |
| 119913 | DSP Tax Saver (ELSS) |

These codes are publicly available on the AMFI website. MFAPI.in provides a simple REST API: `https://api.mfapi.in/mf/{code}/latest` returns the latest NAV data.

---

# **Section 8 — AI Chatbot (Gemini Integration)**

---

### **Q101. How does the AI chatbot work?**

**Answer:**
The chatbot (`components/ChatBot.tsx`) uses Google's **Gemini 2.5 Flash** model:

1. **Initialization** — `new GoogleGenerativeAI(apiKey)` creates the AI client with the API key injected at build time via Vite's `define` config
2. **Context Building** — Before each message, `getFinancialContext()` builds a prompt with the user's actual data:
   - Username, current month
   - Total income and expenses (from `getMonthlySummary()`)
   - Net savings
   - Top 5 expenses (sorted by amount)
3. **Prompt Engineering** — The system prompt instructs Gemini to act as "a helpful Indian personal finance assistant for Trackify", respond concisely, use ₹ for currency, and give practical advice based on the user's data
4. **API Call** — `model.generateContent(prompt)` sends the context + user question to Gemini
5. **Response Display** — The AI response is displayed in a chat bubble with bot avatar

---

### **Q102. What is the prompt engineering approach?**

**Answer:**
```typescript
const getFinancialContext = () => `
  User: ${user?.username}
  Current Month: ${currentMonth}
  Total Income: ₹${income}
  Total Expenses: ₹${expenses}
  Net Savings: ₹${netBalance}
  Top Expenses: ${topExpenses}
  You are a helpful Indian personal finance assistant for Trackify.
  Always respond in a friendly, concise way. Use ₹ for currency.
  Give practical advice based on the user's actual financial data above.
`;
```

The prompt template:
1. **Injects real user data** — income, expenses, savings, top spending
2. **Sets the persona** — Indian finance assistant for Trackify
3. **Sets constraints** — Friendly, concise, use ₹, practical advice
4. **Appends user question** — `User question: ${userMessage}`

This makes responses **personalized** — e.g., "Based on your ₹2,200 Swiggy spend, try cooking at home 3 days/week..."

---

### **Q103. Why Gemini 2.5 Flash specifically?**

**Answer:**
1. **Speed** — Flash is optimized for low-latency responses (<2 seconds), crucial for conversational chat
2. **Cost** — Significantly cheaper than Gemini Pro/Ultra. The free tier provides sufficient quota for academic use.
3. **Quality** — Despite being the "lite" model, Flash provides good quality financial advice
4. **API Simplicity** — Simple `generateContent()` API, no streaming or complex setup needed
5. **Free Tier** — Google provides a generous free tier for Gemini API access

---

### **Q104. How is rate limiting handled?**

**Answer:**
```typescript
catch (err: any) {
  if (err?.status === 429) {
    setMessages(prev => [...prev, {
      role: 'bot',
      text: 'Too many requests. Please wait a few seconds.'
    }]);
  } else {
    setMessages(prev => [...prev, {
      role: 'bot',
      text: 'Sorry, I could not process your request.'
    }]);
  }
}
```

When Gemini's API returns HTTP 429 (Too Many Requests), the chatbot shows a user-friendly message asking them to wait. For other errors (network, API issues), a generic error message is shown. The chat remains functional — the user can try again after a brief pause.

---

### **Q105. Where is the Gemini API key stored?**

**Answer:**
The API key flow:
1. **Source** — Stored in `frontend/.env` as `GEMINI_API_KEY`
2. **Build-Time Injection** — `vite.config.ts` uses `define` to inject it:
   ```typescript
   define: {
     'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
   }
   ```
3. **Runtime Access** — `import.meta.env.VITE_GEMINI_API_KEY` in `ChatBot.tsx`
4. **Production** — Set as an environment variable in Vercel's project settings

**Security Note:** The API key is embedded in the client-side JavaScript bundle. For production use, the Gemini API call should be proxied through the backend to hide the key. This is an accepted trade-off for the academic scope.

---

### **Q106. Does the chatbot maintain conversation history?**

**Answer:**
**Partially.** The chat maintains visual history in the `messages` state array:
```typescript
const [messages, setMessages] = useState<Message[]>([
  { role: 'bot', text: 'Hi! I am your Trackify financial assistant.' }
]);
```

However, each Gemini API call only sends the **current question plus financial context** — not the full conversation history. This means:
- The chatbot doesn't remember previous questions in the same session
- Each question is answered independently with fresh financial context
- This simplifies the implementation but limits multi-turn conversation capabilities

To add true multi-turn conversation, we'd need to send the message history array in the Gemini prompt.

---

### **Q107. How is the chatbot UI positioned?**

**Answer:**
- **Floating Button** — Fixed at bottom-right of viewport (`fixed bottom-6 right-6 z-50`)
- **Chat Window** — Opens above the button with a width that's responsive:
  - Desktop: `380px` width
  - Mobile: Nearly full-width with margins
- **Rendered via `createPortal`** — Into `document.body` to avoid z-index and overflow clipping issues
- **AnimatePresence** — Smooth open/close animations via Framer Motion
- **Always Accessible** — The floating button appears on every authenticated page (rendered inside the Router)

---

### **Q108. What are the top 5 expenses used in the context?**

**Answer:**
```typescript
const topExpenses = transactions
  .filter(t => t.type === 'expense')
  .sort((a, b) => b.amount - a.amount)  // Sort descending by amount
  .slice(0, 5)                           // Take top 5
  .map(t => `${t.description}: ₹${t.amount}`)
  .join(', ');
```
This gives Gemini visibility into the user's biggest spending areas for targeted advice.

---

### **Q109. Can the chatbot work in Demo Mode?**

**Answer:** Yes. In demo mode, `getMonthlySummary()` returns data from mock transactions, and the chatbot uses this mock data as context. However, Gemini API calls still require a valid API key.

---

### **Q110. What model parameters are configured?**

**Answer:**
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
```
We use default parameters (temperature, top-p, top-k). No custom safety settings or max_tokens are configured. For production, setting `temperature: 0.7` and `maxOutputTokens: 500` would provide more predictable, concise responses.

---

# **Section 9 — Deployment & DevOps**

---

### **Q111. Describe the deployment architecture.**

**Answer:**
```
User Browser → Vercel CDN (Frontend) → HTTPS → Render (Backend) → Neon PostgreSQL
    ↓                                                    ↓
Google OAuth (Popup)                          Yahoo Finance + MFAPI.in
Google Gemini (AI Chat)
```

- **Frontend:** Deployed on **Vercel** — static SPA files served from global CDN edge nodes
- **Backend:** Deployed on **Render** — containerized Flask app with Gunicorn
- **Database:** Hosted on **Neon** — serverless PostgreSQL
- All communication is over **HTTPS**

---

### **Q112. How is the frontend deployed on Vercel?**

**Answer:**
1. Push code to GitHub
2. Vercel automatically detects the Vite project and runs `npm run build`
3. The `dist/` folder is deployed to Vercel's global CDN
4. `vercel.json` configures:
   - **COOP Header** — `Cross-Origin-Opener-Policy: same-origin-allow-popups` for Google OAuth
   - **SPA Rewrite** — All routes redirect to `index.html` (handled by React Router)
5. Environment variables (`VITE_API_URL`, `GEMINI_API_KEY`, `VITE_GOOGLE_CLIENT_ID`) are set in Vercel's dashboard
6. Automatic deployments on every `git push`

---

### **Q113. How is the backend deployed on Render?**

**Answer:**
1. Push code to GitHub
2. Render detects the Python project via `requirements.txt`
3. Start command: `gunicorn app:app`
4. Environment variables set in Render dashboard: `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, `GOOGLE_CLIENT_ID`
5. Render provides automatic HTTPS with managed SSL certificates
6. Auto-deploys on every `git push`

**Free Tier Limitation:** Render's free tier spins down after 15 minutes of inactivity. The frontend's keep-alive ping mitigates this.

---

### **Q114. What is the `vercel.json` configuration doing?**

**Answer:**
```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [{
      "key": "Cross-Origin-Opener-Policy",
      "value": "same-origin-allow-popups"
    }]
  }],
  "rewrites": [{
    "source": "/(.*)",
    "destination": "/"
  }]
}
```

Two configurations:
1. **Headers** — Sets `Cross-Origin-Opener-Policy: same-origin-allow-popups` on all responses. Required for Google OAuth popup to communicate back with the opener window.
2. **Rewrites** — All URL paths are rewritten to serve `index.html`. This enables client-side routing — when a user directly visits `/dashboard`, Vercel serves `index.html` instead of returning 404, and React Router handles the routing client-side.

---

### **Q115. What is Neon and how does it differ from a regular PostgreSQL setup?**

**Answer:**
Neon is a **serverless PostgreSQL** platform:

| Feature | Regular PostgreSQL | Neon |
|---------|-------------------|------|
| Server | Always running | Auto-suspends after inactivity |
| Scaling | Manual | Automatic |
| Storage | Fixed disk | Elastic, pay-per-use |
| Branching | Not available | Git-like DB branches |
| Cost | Fixed monthly | Free tier + usage-based |
| Cold Start | None | 2-3 second wake-up |

**Connection string:** `postgres://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`

The `?sslmode=require` ensures encrypted connections. Our `connect_timeout=30` in `get_db()` accommodates the cold start delay.

---

### **Q116. How does the keep-alive ping prevent backend sleep?**

**Answer:** A `setInterval` in `main.tsx` sends `GET /` to the backend every 10 minutes. Render's free tier sleeps after 15 minutes of no requests. The 10-minute interval ensures there's always a request within the 15-minute window, keeping the container active.

---

### **Q117. What is a CDN and why does Vercel use one?**

**Answer:** A CDN (Content Delivery Network) distributes static files across global edge servers. When a user in India requests the app, they're served from the nearest edge node (e.g., Mumbai) instead of a distant origin server. This reduces latency from ~200ms to ~20ms for static assets.

---

### **Q118. What is WSGI?**

**Answer:** WSGI (Web Server Gateway Interface) is a specification for Python web servers to communicate with web applications. Gunicorn is a WSGI server that receives HTTP requests and forwards them to the Flask application. Flask implements the WSGI interface.

---

### **Q119. Can the frontend work if the backend is down?**

**Answer:** Partially. The landing page, login/register UI, and theme toggle work. Demo mode works (uses local mock data). But all authenticated features (real transactions, budgets, goals, market data) require the backend.

---

### **Q120. How are environment variables managed?**

**Answer:** Development: `.env` files loaded via `dotenv`. Production: Set in Vercel/Render dashboards. The `.env` files are in `.gitignore` to prevent committing secrets to version control.

---

### **Q121. What build command does Vite use?**

**Answer:** `npm run build` runs `tsc -b && vite build`. First transpiles TypeScript, then Vite bundles with Rollup, outputting optimized files to `dist/`.

---

### **Q122. What is the production bundle size?**

**Answer:** ~450 KB gzipped. Vite's tree-shaking removes unused code, and Rollup's code splitting creates smaller chunks.

---

### **Q123. How is Git used in this project?**

**Answer:** Git is used for version control with a single `main` branch. The repository contains both `frontend/` and `expense-tracker-backend/` directories. Vercel and Render each watch specific directory paths for auto-deployment.

---

### **Q124. Are there any CI/CD pipelines?**

**Answer:** Vercel and Render provide built-in CI/CD. On every `git push`, both platforms automatically build and deploy. No custom GitHub Actions or Jenkins pipelines are configured.

---

### **Q125. How would you scale this application for thousands of users?**

**Answer:**
1. Add connection pooling (`psycopg2.pool.ThreadedConnectionPool`)
2. Implement server-side pagination for transactions
3. Add Redis caching for market data (currently fetched fresh every request)
4. Upgrade Render to paid tier with multiple workers
5. Add database indexes on `user_id` columns
6. Implement API rate limiting with Flask-Limiter
7. Consider horizontal scaling with load balancing

---

# **Section 10 — Security**

---

### **Q126. How is SQL injection prevented?**

**Answer:**
All database queries use **parameterized queries** with `%s` placeholders:

```python
# SAFE — parameterized query
cur.execute("SELECT * FROM users WHERE email = %s", (email,))

# UNSAFE — string concatenation (NOT used in Trackify)
cur.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

psycopg2 automatically escapes any special characters in the parameters, preventing an attacker from injecting malicious SQL. For example, if `email = "'; DROP TABLE users; --"`, the parameterized query treats it as a literal string, not SQL.

---

### **Q127. How is XSS (Cross-Site Scripting) prevented?**

**Answer:**
React provides built-in XSS protection through JSX:
- All values rendered in JSX are **automatically escaped**
- `{userInput}` renders `<script>alert('xss')</script>` as plain text, not executable HTML
- We never use `dangerouslySetInnerHTML`
- React DOM escapes `<`, `>`, `&`, `"`, `'` characters

---

### **Q128. How are passwords stored securely?**

**Answer:**
1. **Never stored in plain text** — Always bcrypt-hashed before storage
2. **Salted** — Each password has a unique random salt (prevents rainbow table attacks)
3. **Computationally Expensive** — 12 rounds (2^12 iterations) makes brute-force infeasible
4. **One-Way** — Cannot derive the original password from the hash
5. **VARCHAR(200)** — Ample storage for the 60-char bcrypt hash

---

### **Q129. How is HTTPS enforced?**

**Answer:**
- **Vercel** — Automatically provisions and renews SSL certificates. All HTTP requests are redirected to HTTPS.
- **Render** — Provides managed SSL with automatic HTTPS.
- **Neon** — Connection string includes `?sslmode=require`, enforcing encrypted database connections.

All three layers enforce encryption in transit, protecting user data, JWT tokens, and credentials.

---

### **Q130. What are the known security limitations?**

**Answer:**
1. **No Rate Limiting** — APIs can be abused with rapid requests (no Flask-Limiter)
2. **JWT in localStorage** — Vulnerable to XSS (httpOnly cookies would be more secure)
3. **No Token Refresh** — Expired tokens require re-login (no refresh token mechanism)
4. **No Input Validation** — Server-side validation is basic (no length checks, format validation)
5. **No Ownership Verification** — DELETE endpoints don't verify the resource belongs to the requesting user
6. **Gemini API Key Exposed** — Client-side JavaScript contains the AI API key
7. **No CSRF Protection** — JWT in headers provides some protection, but no CSRF tokens
8. **SSL Disabled for Market API** — `ssl.CERT_NONE` for Yahoo Finance fetches

---

### **Q131. What is CORS and why is it needed?**

**Answer:** CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to different domains. Since our frontend (vercel.app) and backend (onrender.com) are on different domains, CORS headers must explicitly allow cross-origin requests.

---

### **Q132. What is a JWT and what does it contain?**

**Answer:** A JWT has three parts: Header (algorithm, type), Payload (user_id, expiration time, creation time), and Signature (HMAC-SHA256 hash of header+payload using the secret key). Example: `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjg5...}.signature`

---

### **Q133. What is HTTPS and how does it protect data?**

**Answer:** HTTPS encrypts HTTP traffic using TLS (Transport Layer Security). It protects: data in transit (credentials, JWT tokens), prevents man-in-the-middle attacks, ensures server identity (certificate verification).

---

### **Q134. What is bcrypt's cost factor?**

**Answer:** Cost factor 12 means 2^12 = 4,096 iterations of the hashing algorithm. Higher cost = slower hashing = harder to brute-force. At cost 12, one hash takes ~200-300ms — acceptable for login but infeasible for attackers trying millions of passwords.

---

### **Q135. How would you implement rate limiting?**

**Answer:** Use Flask-Limiter: `@limiter.limit("5 per minute")` on login/register endpoints. This would prevent brute-force attacks and API abuse.

---

### **Q136. What is the difference between authentication and authorization?**

**Answer:** Authentication: Verifying who the user is (login). Authorization: Verifying what the user can do (access control). Trackify implements authentication (JWT) but has minimal authorization (no role-based access).

---

### **Q137. Could someone forge a JWT token?**

**Answer:** No. Forging requires knowing the `JWT_SECRET_KEY`. Without it, the signature won't verify. The HMAC-SHA256 algorithm cryptographically binds the payload to the secret.

---

### **Q138. What happens if the JWT_SECRET_KEY is compromised?**

**Answer:** An attacker could create valid tokens for any user. Mitigation: Rotate the key immediately (all existing tokens become invalid, forcing re-login), use a longer/more complex key.

---

### **Q139. How do parameterized queries differ from prepared statements?**

**Answer:** Both prevent SQL injection. Parameterized queries send the query template and parameters separately. Prepared statements are pre-compiled on the server for reuse. psycopg2 uses parameterized queries which are compiled on each execution.

---

### **Q140. Is the application GDPR/data-privacy compliant?**

**Answer:** Partially. User data is encrypted in transit (HTTPS) and passwords are hashed. However, there's no data deletion feature (right to erasure), no data export feature for users (right to portability), and no privacy policy page. These would be needed for full compliance.

---

# **Section 11 — Testing & Performance**

---

### **Q141. What testing approach was used?**

**Answer:**
Manual testing across all features:

| Test Area | Cases Tested | Status |
|-----------|-------------|--------|
| User Registration | Valid input, duplicate email, empty fields | ✅ |
| User Login | Correct password, wrong password, non-existent user | ✅ |
| Google OAuth | Valid Google account, token verification | ✅ |
| Add Expense/Income | All categories, edge amounts | ✅ |
| Delete Transaction | Expense and income deletion | ✅ |
| Budget Management | Set new, update existing | ✅ |
| Goal CRUD | Create, update, delete | ✅ |
| Market Data | Concurrent fetch, timeout handling | ✅ |
| AI Chatbot | Financial questions, rate limiting | ✅ |
| Demo Mode | Mock data loading, navigation | ✅ |
| Theme Toggle | Persistence across sessions | ✅ |
| Responsive Design | Mobile (375px), Tablet (768px), Desktop (1440px) | ✅ |
| Excel Export | Data accuracy, download | ✅ |
| CORS | Cross-origin requests | ✅ |

**No automated tests** — documented as a future improvement (pytest for backend, Vitest for frontend).

---

### **Q142. What are the backend performance metrics?**

**Answer:**

| Metric | Value |
|--------|-------|
| Cold start (Neon DB) | ~2-3 seconds |
| Warm API response | ~50-100ms |
| Market data fetch | ~3-5 seconds |
| JWT generation | ~5ms |
| Bcrypt hashing | ~200-300ms |
| Keep-alive interval | 10 minutes |

---

### **Q143. What are the frontend performance metrics?**

**Answer:**

| Metric | Value |
|--------|-------|
| Vite dev startup | <500ms |
| Production bundle | ~450 KB gzipped |
| First Contentful Paint | ~1.2 seconds |
| Time to Interactive | ~2.1 seconds |
| Lighthouse Score | 90+ |

---

### **Q144. Why are there no automated tests?**

**Answer:**
Given the academic timeline and single-developer scope, manual testing was prioritized over writing test suites. However, automated tests are the top-priority future improvement:
- **Backend:** pytest with test fixtures for each API endpoint
- **Frontend:** Vitest + React Testing Library for component tests
- **Integration:** Cypress or Playwright for end-to-end browser tests

---

### **Q145. How would you test the categorization engine?**

**Answer:** Write pytest tests with known input-output pairs: `assert categorize_expense("swiggy order") == "Food"`, `assert categorize_expense("uber ride") == "Travel"`, `assert categorize_expense("random text") == "Other"`.

---

### **Q146. How do you handle browser compatibility?**

**Answer:** The app is tested on Chrome, Firefox, and Safari. React's virtual DOM abstracts browser differences. TailwindCSS uses autoprefixer for CSS compatibility.

---

### **Q147. What is Lighthouse and what does a 90+ score mean?**

**Answer:** Lighthouse is Google's web performance audit tool. A 90+ score (out of 100) indicates excellent performance, accessibility, best practices, and SEO. Factors include fast load times, proper heading structure, responsive design.

---

### **Q148. How is the 3-5 second market data latency acceptable?**

**Answer:** Market data is fetched concurrently (not blocking the UI). The dashboard shows loading skeletons while data loads. After initial load, data is cached in React state and refreshes in the background every 60 seconds.

---

### **Q149. What performance optimizations exist?**

**Answer:** Concurrent data fetching (Promise.all, ThreadPoolExecutor), useMemo for computed market data filtering, localStorage for state persistence (avoids re-fetching on navigation), Vite's tree-shaking and code splitting, lazy loading potential.

---

### **Q150. How would you add monitoring to production?**

**Answer:** Backend: Add logging with Python's `logging` module, integrate Sentry for error tracking. Frontend: Add Google Analytics or PostHog for user analytics, Sentry for JavaScript error tracking.

---

# **Section 12 — Future Scope & Limitations**

---

### **Q151. What are the main limitations of Trackify?**

**Answer:**
1. **No Automated Tests** — Entirely manual testing
2. **No Connection Pooling** — Fresh DB connection per request
3. **No Pagination** — Fetches all transactions at once (performance issue at scale)
4. **No Rate Limiting** — APIs vulnerable to abuse
5. **No Input Validation** — Basic server-side validation
6. **No Ownership Verification** — DELETE doesn't verify resource ownership
7. **No Token Refresh** — Expired JWT requires re-login
8. **No Migration System** — Schema changes require manual SQL
9. **Float for Money** — Should use DECIMAL for financial precision
10. **Client-Side API Keys** — Gemini API key exposed in JavaScript bundle

---

### **Q152. What are the planned future improvements?**

**Answer:**

**Short-Term:**
- Automated tests (pytest, Vitest)
- Input validation, rate limiting
- Connection pooling, pagination
- Recurring transactions (rent, EMI, subscriptions)

**Medium-Term:**
- PDF report generation
- SMS parsing (opt-in) for UPI/credit card auto-import
- Multi-currency support
- Bill reminders / push notifications
- Investment portfolio tracking (personal holdings)

**Long-Term:**
- React Native mobile app (sharing same backend)
- Bank API integration (Account Aggregator framework)
- Tax planning module (Section 80C/80D deductions)
- Family finance (shared household budgets)
- ML-based expense forecasting
- Gamification (badges, streaks, health scores)

---

### **Q153. How would you add recurring transactions?**

**Answer:**
1. Add a `recurring_transactions` table with fields: `user_id`, `title`, `amount`, `category`, `frequency` (monthly/weekly/yearly), `next_due_date`
2. Create a cron job (or scheduled task) that runs daily and checks for due recurring transactions
3. Auto-create expense records for each due recurring transaction
4. Update `next_due_date` based on frequency

---

### **Q154. How would you implement connection pooling?**

**Answer:**
Replace `get_db()` with:
```python
from psycopg2.pool import ThreadedConnectionPool

pool = ThreadedConnectionPool(
    minconn=2,
    maxconn=10,
    dsn=os.getenv("DATABASE_URL"),
    connect_timeout=30
)

def get_db():
    return pool.getconn()

def return_db(conn):
    pool.putconn(conn)
```

This reuses existing connections instead of creating new ones per request, reducing connection overhead from ~50ms to ~1ms.

---

### **Q155. How would you add pagination?**

**Answer:** Backend: `SELECT * FROM expenses WHERE user_id = %s ORDER BY date DESC LIMIT %s OFFSET %s`. Frontend: Add page number state and "Load More" / page navigation buttons.

---

### **Q156. How would you implement a mobile app?**

**Answer:** Use React Native with the same REST API backend. The backend requires zero changes — only the frontend needs to be rebuilt for mobile.

---

### **Q157. How would you add real-time notifications?**

**Answer:** Use WebSockets (Flask-SocketIO) for real-time budget alerts when spending exceeds 80% of the budget limit.

---

### **Q158. Could the backend be rewritten in Node.js?**

**Answer:** Yes. The RESTful API design is technology-agnostic. Express.js could replace Flask with equivalent functionality. The database queries and market data pipeline would remain similar.

---

### **Q159. How would you make the app offline-capable?**

**Answer:** Implement a Service Worker with Workbox for the offline cache. Use IndexedDB for local data storage. Sync with the backend when connectivity resumes.

---

### **Q160. How would you add multi-language support?**

**Answer:** Use react-i18next for frontend internationalization. Store translations in JSON files. Add Hindi, Marathi, and other regional language support for both UI and categorization keywords.

---

# **Section 13 — Theoretical / Conceptual Questions**

---

### **Q161. What is REST API?**

**Answer:**
REST (Representational State Transfer) is an architectural style for web APIs. Key principles:
1. **Client-Server** — Frontend and backend are separate
2. **Stateless** — Each request contains all info needed (JWT token); server stores no session
3. **Uniform Interface** — Resources are accessed via standard HTTP methods (GET, POST, PUT, DELETE) on consistent URL patterns
4. **Resource-Based** — URLs represent resources (`/expenses`, `/goals/:id`)

Trackify follows REST conventions: `GET /expenses` (list), `POST /expenses` (create), `DELETE /expenses/:id` (delete).

---

### **Q162. What is the difference between SQL and NoSQL?**

**Answer:**

| Aspect | SQL (PostgreSQL) | NoSQL (MongoDB) |
|--------|-----------------|-----------------|
| Schema | Fixed, predefined | Flexible, dynamic |
| Relationships | Strong (JOIN, FK) | Weak (embedded documents) |
| Transactions | ACID compliant | Eventual consistency (mostly) |
| Query Language | SQL | Document queries |
| Best For | Structured, relational data | Unstructured, rapidly changing data |

We chose SQL (PostgreSQL) because our data is highly relational (users → expenses, income, budgets, goals).

---

### **Q163. What is ACID?**

**Answer:**
ACID properties of PostgreSQL:
- **Atomicity** — Transactions either fully complete or fully rollback (our `commit()` calls)
- **Consistency** — Database constraints (FK, UNIQUE, NOT NULL) are always enforced
- **Isolation** — Concurrent transactions don't interfere with each other
- **Durability** — Once committed, data persists even if the server crashes

---

### **Q164. What is the difference between `useEffect` and `useLayoutEffect`?**

**Answer:**
- **`useEffect`** — Runs asynchronously after the browser paints. Used for data fetching, subscriptions, timers.
- **`useLayoutEffect`** — Runs synchronously after DOM mutations but **before** the browser paints. Used for DOM measurements and visual changes that need to be applied before the user sees the screen.

In Trackify, `useLayoutEffect` is used in `ThemeProvider` to set the theme class before painting, preventing a "flash of wrong theme."

---

### **Q165. What is the difference between `useState` and `useContext`?**

**Answer:**
- **`useState`** — Local state within a single component. Cannot be accessed by other components.
- **`useContext`** — Shared state across multiple components via a Provider. Any component in the Provider's tree can access and consume the state.

In Trackify, authentication state needs to be accessed by Navbar (for user name), PrivateRoute (for access control), Dashboard (for user greeting), etc. Using `useContext` via AuthContext allows all these components to share the same state.

---

### **Q166. What is Virtual DOM?**

**Answer:**
The Virtual DOM is React's in-memory representation of the actual DOM. When state changes:
1. React creates a new Virtual DOM tree
2. Compares it with the previous tree (diffing)
3. Calculates the minimum changes needed
4. Applies only those changes to the actual DOM (reconciliation)

This is why React is performant — instead of re-rendering the entire page, it only updates what changed.

---

### **Q167. What is `useMemo` and where is it used?**

**Answer:**
`useMemo` memoizes (caches) a computed value, only recalculating when dependencies change.

In `LiveMarketData.tsx`:
```typescript
const { stocksAndIndices, mutualFunds } = useMemo(() => {
  // Complex filtering logic based on savingsTier
  // ...
}, [data, savingsTier]);
```

This ensures the expensive filtering/mapping of market data only runs when `data` or `savingsTier` changes, not on every render.

---

### **Q168. What is the difference between `let`, `const`, and `var`?**

**Answer:**

| Feature | `var` | `let` | `const` |
|---------|------|------|--------|
| Scope | Function | Block | Block |
| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Reassignment | Yes | Yes | No |
| Redeclaration | Yes | No | No |

In Trackify, we use `const` for values that don't change and `let` for loop variables. `var` is never used (modern best practice).

---

### **Q169. What is TypeScript's `Omit` utility type?**

**Answer:**
`Omit<Type, Keys>` creates a new type by removing specified keys.

In GoalContext:
```typescript
const addGoal = async (g: Omit<Goal, 'id' | 'progress'>) => { ... }
```

This means `addGoal` accepts a Goal object without `id` and `progress` fields (since these are generated server-side), but still requires `name`, `target_amount`, `saved_amount`, and `deadline`.

---

### **Q170. What is the Single Responsibility Principle and how is it applied?**

**Answer:**
SRP states each module/component should have one reason to change:
- `AuthContext` — Only handles authentication
- `ExpenseContext` — Only handles transactions and budgets
- `GoalContext` — Only handles savings goals
- `categorizer.py` — Only handles categorization logic
- `db.py` — Only handles database connections
- Each model file — Only handles one table's CRUD

---

### **Q171. What is HTTPS/TLS?**

**Answer:**
HTTPS = HTTP + TLS (Transport Layer Security). TLS provides:
1. **Encryption** — Data is encrypted during transmission (prevents eavesdropping)
2. **Authentication** — SSL certificates verify the server's identity (prevents impersonation)
3. **Integrity** — Data cannot be tampered with during transmission (prevents modification)

In Trackify, HTTPS protects login credentials, JWT tokens, and financial data in transit.

---

### **Q172. What is the difference between synchronous and asynchronous programming?**

**Answer:**
- **Synchronous** — Code executes line by line, blocking until each operation completes
- **Asynchronous** — Operations start and continue without waiting; results are handled via callbacks/promises/async-await

Trackify uses **async/await** in the frontend (`fetch()` calls are asynchronous) and **threading** in the backend (`ThreadPoolExecutor` for concurrent market data fetches).

---

### **Q173. What is the Agile methodology?**

**Answer:**
Agile is an iterative, incremental software development approach:
1. **Sprints** — Short development cycles (1-2 weeks)
2. **Iterative** — Build, test, and refine in cycles
3. **Flexible** — Adapt to changing requirements
4. **Working Software** — Deliver functional increments regularly

Trackify was built in 6-month Agile sprints: Planning (Oct) → Backend (Nov-Jan) → Frontend (Nov-Feb) → Testing and Deployment (Feb-Mar).

---

### **Q174. What is the MVC pattern and does Trackify follow it?**

**Answer:**
MVC = Model-View-Controller:
- **Model** — `models/` folder (user.py, expense.py, etc.) — data and business logic
- **View** — React components and pages — UI rendering
- **Controller** — `routes/` folder (expense_routes.py, etc.) — handles requests and coordinates Model and View

Trackify follows MVC loosely. The backend has clear Model and Controller separation. The frontend uses React's component-based approach (View + Controller combined) with Context API for Model-like state management.

---

### **Q175. What is a CDN and how does Vercel use it?**

**Answer:**
A CDN (Content Delivery Network) distributes content across geographically distributed servers. Vercel's CDN:
1. Deploys static files to **edge nodes** worldwide (Mumbai, Singapore, Frankfurt, etc.)
2. When a user requests the app, they're served from the **nearest edge node**
3. Reduces latency from ~200ms to ~20ms
4. Handles high traffic without single-point-of-failure
5. Caches static assets with proper cache headers

---

### **Q176. What is the difference between a SPA and MPA?**

**Answer:**

| Aspect | SPA (Trackify) | MPA (Traditional) |
|--------|------------|-----------|
| Navigation | Client-side (React Router) | Full page reload |
| Server Load | Low (serves static files) | High (renders HTML per request) |
| Initial Load | Slower (JS bundle) | Faster (pre-rendered HTML) |
| Subsequent Navigation | Instant | Slow (new page load) |
| SEO | Challenging | Better |
| User Experience | App-like, smooth | Website-like, jerky |

Trackify is a SPA — React Router handles all navigation client-side.

---

### **Q177. What is `Promise.all` and where is it used?**

**Answer:**
`Promise.all()` executes multiple promises concurrently and waits for all to complete.

In ExpenseContext:
```typescript
Promise.all([fetchExpenses(), fetchIncome(), fetchBudgets()]);
```

This fetches expenses, income, and budgets **simultaneously** instead of sequentially, reducing total load time from ~300ms to ~100ms (time of slowest fetch).

---

### **Q178. What is the difference between PUT and PATCH HTTP methods?**

**Answer:**
- **PUT** — Replaces the entire resource (all fields)
- **PATCH** — Updates specific fields only

Trackify uses PUT for goal updates: `PUT /goals/:id` with `{saved_amount}`. Technically, this is a PATCH operation (updating one field), but PUT is used for simplicity. The distinction is semantic in REST APIs.

---

### **Q179. What is environment variable management and why is it important?**

**Answer:**
Environment variables store configuration that differs between environments (development vs production):

**Development (.env files):**
```
DATABASE_URL=postgres://localhost/trackify
JWT_SECRET_KEY=dev_secret
```

**Production (Vercel/Render dashboards):**
```
DATABASE_URL=postgres://neon.tech/trackify_prod
JWT_SECRET_KEY=<long_random_production_key>
```

**Why important:**
1. **Security** — Secrets (API keys, DB passwords) never enter version control
2. **Flexibility** — Same code works in different environments
3. **12-Factor App** — Configuration in environment, not code

---

### **Q180. Summarize why Trackify is a comprehensive project.**

**Answer:**
Trackify demonstrates mastery across the full software development lifecycle:

1. **Full-Stack Development** — React 19 + TypeScript frontend, Flask REST API backend, PostgreSQL database
2. **Modern Architecture** — Decoupled client-server, Context-based state management, Blueprint-based API organization
3. **Real-Time Data** — Concurrent market data fetching with ThreadPoolExecutor from Yahoo Finance and MFAPI
4. **AI Integration** — Google Gemini chatbot with dynamic prompt engineering using real user data
5. **Secure Authentication** — Dual auth (email/password + Google OAuth), JWT, bcrypt hashing
6. **Cloud Deployment** — Vercel CDN + Render + Neon PostgreSQL, fully deployed production system
7. **Indian Market Focus** — Keyword categorization for Indian merchants, Indian stock tracking, INR currency, ELSS/REIT/SIP tracking
8. **User Experience** — Dark/light theme, responsive design, animations (Framer Motion), demo mode, Excel export
9. **Software Engineering** — REST API design, CORS configuration, error handling, keep-alive mechanisms, graceful degradation
10. **Academic Rigor** — Complete documentation (blackbook), diagrams (ER, Use Case, Sequence, State, Flow, Class), performance analysis

---

> **Best of luck for your viva!**
