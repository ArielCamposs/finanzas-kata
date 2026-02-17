export type TransactionType = 'income' | 'expense' | 'transfer' | 'goal_contribution';

export interface Transaction {
  id: string;
  date: string; // ISO 8601 YYYY-MM-DD
  amount: number;
  description: string;
  categoryId: string;
  type: TransactionType;
  notes?: string;
  projectId?: string; // Future proofing
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  transactionId?: string; // Link to transaction
}
