'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, Budget, Goal } from '@/types';
import { storage } from '@/lib/storage';

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const refresh = useCallback(() => {
        setTransactions(storage.getTransactions());
    }, []);

    useEffect(() => {
        refresh();
        // Simple way to listen for changes from other components
        window.addEventListener('storage', refresh);
        // Custom event for same-tab updates if we dispatch it manually
        window.addEventListener('finance-update', refresh);
        return () => {
            window.removeEventListener('storage', refresh);
            window.removeEventListener('finance-update', refresh);
        };
    }, [refresh]);

    const addTransaction = (t: Transaction) => {
        storage.saveTransaction(t);
        refresh();
        window.dispatchEvent(new Event('finance-update'));
    };

    const removeTransaction = (id: string) => {
        storage.deleteTransaction(id);
        refresh();
        window.dispatchEvent(new Event('finance-update'));
    };

    return { transactions, addTransaction, removeTransaction, refresh };
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);

    const refresh = useCallback(() => {
        setCategories(storage.getCategories());
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('finance-update', refresh);
        return () => window.removeEventListener('finance-update', refresh);
    }, [refresh]);

    const addCategory = (c: Category) => {
        storage.saveCategory(c);
        refresh();
        window.dispatchEvent(new Event('finance-update'));
    };

    return { categories, addCategory, refresh };
}

// Similar wrappers for Budget and Goal
export function useBudgets() {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    const refresh = useCallback(() => {
        setBudgets(storage.getBudgets());
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('finance-update', refresh);
        return () => window.removeEventListener('finance-update', refresh);
    }, [refresh]);

    const setBudget = (b: Budget) => {
        storage.saveBudget(b);
        refresh();
        window.dispatchEvent(new Event('finance-update'));
    };

    return { budgets, setBudget, refresh };
}

export function useGoals() {
    const [goals, setGoals] = useState<Goal[]>([]);

    const refresh = useCallback(() => {
        setGoals(storage.getGoals());
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('finance-update', refresh);
        return () => window.removeEventListener('finance-update', refresh);
    }, [refresh]);

    const addGoal = (g: Goal) => {
        storage.saveGoal(g);
        refresh();
        window.dispatchEvent(new Event('finance-update'));
    };

    return { goals, addGoal, refresh };
}

export function usePreferences() {
    const [preferences, setPreferences] = useState<{ baseSalary: number }>({ baseSalary: 0 });

    const loadData = () => {
        setPreferences(storage.getPreferences());
    };

    useEffect(() => {
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    const savePreferences = (prefs: { baseSalary: number }) => {
        storage.savePreferences(prefs);
        loadData();
    };

    return { preferences, savePreferences };
}
