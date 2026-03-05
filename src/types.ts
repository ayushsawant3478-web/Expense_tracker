export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
}

export interface Budget {
  month: string; // YYYY-MM
  amount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}
