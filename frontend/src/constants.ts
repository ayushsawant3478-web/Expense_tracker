/// <reference types="vite/client" />

export const API_URL = import.meta.env.VITE_API_URL || 'https://expense-tracker-89aa.onrender.com';

export const MARKET_API_URL = import.meta.env.VITE_API_URL || 'https://expense-tracker-89aa.onrender.com';

export const CATEGORIES = [
  'Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other'
];

export const INCOME_SOURCES = [
  'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
];

export const FINANCIAL_TIPS = [
  "Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
  "Small daily expenses add up. Track your coffee or snack habits!",
  "Emergency fund first: Aim to save 3-6 months of expenses.",
  "Invest in yourself: Knowledge is the best asset you can have.",
  "Automate your savings to ensure you pay yourself first.",
  "Review subscriptions monthly. Cancel what you don't use.",
  "Use cash for discretionary spending to feel the 'pain' of paying.",
  "Prioritize high-interest debt repayment to save on interest."
];

// Ping backend every 10 minutes to keep it awake
export const pingBackend = () => {
  setInterval(async () => {
    try {
      await fetch(`${API_URL}/`);
    } catch (e) {}
  }, 10 * 60 * 1000);
};