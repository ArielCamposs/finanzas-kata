import { Transaction, Category, Budget, Goal } from '@/types';

const STORAGE_KEYS = {
    TRANSACTIONS: 'finance_transactions',
    CATEGORIES: 'finance_categories',
    BUDGETS: 'finance_budgets',
    GOALS: 'finance_goals',
    PREFERENCES: 'finance_preferences',
};

export interface UserPreferences {
    baseSalary: number;
}

// Default Categories Seed
{ id: 'cat_rent', name: 'Arriendo', type: 'expense', icon: 'Home', color: '#ef4444' },
{ id: 'cat_bills', name: 'Cuentas', type: 'expense', icon: 'Zap', color: '#f97316' },
{ id: 'cat_grocery', name: 'Supermercado', type: 'expense', icon: 'ShoppingCart', color: '#84cc16' },
{ id: 'cat_transport', name: 'Transporte', type: 'expense', icon: 'Bus', color: '#06b6d4' },
{ id: 'cat_subs', name: 'Suscripciones', type: 'expense', icon: 'CreditCard', color: '#6366f1' },
{ id: 'cat_plan', name: 'Plan Celular', type: 'expense', icon: 'Calendar', color: '#8b5cf6' },
{ id: 'cat_savings', name: 'Ahorro', type: 'expense', icon: 'PiggyBank', color: '#10b981' },
{ id: 'cat_income', name: 'Ingreso', type: 'income', icon: 'DollarSign', color: '#22c55e', isDefault: true },
];

export const storage = {
    // Generic helper to get/set
    getItem: <T>(key: string): T[] => {
        if (typeof window === 'undefined') return [];
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : [];
        } catch (e) {
            console.error(`Error reading ${key}`, e);
            return [];
        }
    },

    setItem: <T>(key: string, value: T[]) => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            // Dispatch storage event for cross-tab sync or hook updates
            window.dispatchEvent(new Event('storage'));
        } catch (e) {
            console.error(`Error writing ${key}`, e);
        }
    },

    // Transactions
    getTransactions: () => storage.getItem<Transaction>(STORAGE_KEYS.TRANSACTIONS),
    saveTransaction: (transaction: Transaction) => {
        const items = storage.getTransactions();
        const index = items.findIndex((i) => i.id === transaction.id);
        if (index >= 0) items[index] = transaction;
        else items.push(transaction);
        storage.setItem(STORAGE_KEYS.TRANSACTIONS, items);
    },
    deleteTransaction: (id: string) => {
        const items = storage.getTransactions().filter((i) => i.id !== id);
        storage.setItem(STORAGE_KEYS.TRANSACTIONS, items);
    },

    // Categories
    getCategories: () => {
        const items = storage.getItem<Category>(STORAGE_KEYS.CATEGORIES);
        if (items.length === 0) {
            // Seed if empty
            storage.setItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
            return DEFAULT_CATEGORIES;
        }
        return items;
    },
    saveCategory: (category: Category) => {
        const items = storage.getCategories();
        const index = items.findIndex((i) => i.id === category.id);
        if (index >= 0) items[index] = category;
        else items.push(category);
        storage.setItem(STORAGE_KEYS.CATEGORIES, items);
    },

    // Budgets
    getBudgets: () => storage.getItem<Budget>(STORAGE_KEYS.BUDGETS),
    saveBudget: (budget: Budget) => {
        const items = storage.getBudgets();
        const index = items.findIndex((i) => i.id === budget.id);
        if (index >= 0) items[index] = budget;
        else items.push(budget);
        storage.setItem(STORAGE_KEYS.BUDGETS, items);
    },

    // Goals
    getGoals: () => storage.getItem<Goal>(STORAGE_KEYS.GOALS),
    saveGoal: (goal: Goal) => {
        const items = storage.getGoals();
        const index = items.findIndex((i) => i.id === goal.id);
        if (index >= 0) items[index] = goal;
        else items.push(goal);
        storage.setItem(STORAGE_KEYS.GOALS, items);
    },

    // Preferences
    getPreferences: (): UserPreferences => {
        const prefs = storage.getItem<UserPreferences>(STORAGE_KEYS.PREFERENCES);
        // localStorage stores arrays by default in our helper, but for a single object we might need to adjust or just take index 0
        // actually our helper getItem<T> returns T[] which is maybe not ideal for single object but we can work with it.
        // Let's assume we store it as an array of 1 object for consistency with current helper
        return prefs[0] || { baseSalary: 0 };
    },
    savePreferences: (prefs: UserPreferences) => {
        storage.setItem(STORAGE_KEYS.PREFERENCES, [prefs]);
    },
};
