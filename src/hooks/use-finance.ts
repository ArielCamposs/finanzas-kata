'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, Budget, Goal } from '@/types';
import { supabase } from '@/lib/supabase';

// NO AUTH REQUIRED - PUBLIC ACCESS MODE
// Added window events for cross-component sync

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (!error && data) {
            const mapped = data.map((t: any) => ({
                ...t,
                categoryId: t.category_id,
                userId: t.user_id,
            }));
            setTransactions(mapped);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('finance-update', refresh);
        return () => window.removeEventListener('finance-update', refresh);
    }, [refresh]);

    const addTransaction = async (t: Transaction) => {
        const { error } = await supabase.from('transactions').insert({
            id: t.id,
            date: t.date,
            amount: t.amount,
            description: t.description,
            category_id: t.categoryId,
            type: t.type,
            notes: t.notes
        });

        if (!error) {
            refresh();
            window.dispatchEvent(new Event('finance-update'));
        } else {
            console.error(error);
        }
    };

    const removeTransaction = async (id: string) => {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (!error) {
            refresh();
            window.dispatchEvent(new Event('finance-update'));
        }
    };

    return { transactions, addTransaction, removeTransaction, refresh, loading };
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);

    const refresh = useCallback(async () => {
        const { data, error } = await supabase.from('categories').select('*');
        if (!error && data) {
            setCategories(data);
        }
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('finance-update', refresh);
        return () => window.removeEventListener('finance-update', refresh);
    }, [refresh]);

    const addCategory = async (c: Category) => {
        const { error } = await supabase.from('categories').insert({
            id: c.id,
            name: c.name,
            type: c.type,
            color: c.color,
            icon: c.icon
        });
        if (!error) {
            refresh();
            window.dispatchEvent(new Event('finance-update'));
        }
    };

    return { categories, addCategory, refresh };
}

export function useBudgets() {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    const refresh = useCallback(async () => {
        const { data, error } = await supabase.from('budgets').select('*');
        if (!error && data) {
            const mapped = data.map((b: any) => ({
                ...b,
                categoryId: b.category_id,
            }));
            setBudgets(mapped);
        }
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('finance-update', refresh);
        return () => window.removeEventListener('finance-update', refresh);
    }, [refresh]);

    const setBudget = async (b: Budget) => {
        const payload = {
            id: b.id,
            category_id: b.categoryId,
            amount: b.amount,
            month: b.month
        };

        const { error } = await supabase.from('budgets').upsert(payload, { onConflict: 'id' });
        if (!error) {
            refresh();
            window.dispatchEvent(new Event('finance-update'));
        }
    };

    return { budgets, setBudget, refresh };
}

export function useGoals() {
    const [goals, setGoals] = useState<Goal[]>([]);

    const refresh = useCallback(async () => {
        const { data, error } = await supabase.from('goals').select('*');
        if (!error && data) {
            const mapped = data.map((g: any) => ({
                ...g,
                targetAmount: g.target_amount,
                currentAmount: g.current_amount
            }));
            setGoals(mapped);
        }
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener('finance-update', refresh);
        return () => window.removeEventListener('finance-update', refresh);
    }, [refresh]);

    const addGoal = async (g: Goal) => {
        const { error } = await supabase.from('goals').insert({
            id: g.id,
            name: g.name,
            target_amount: g.targetAmount,
            current_amount: g.currentAmount
        });
        if (!error) {
            refresh();
            window.dispatchEvent(new Event('finance-update'));
        }
    };

    return { goals, addGoal, refresh };
}

export function usePreferences() {
    const [preferences, setPreferences] = useState<{ baseSalary: number }>({ baseSalary: 0 });

    const loadData = () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('finanzas_preferences');
            if (saved) setPreferences(JSON.parse(saved));
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const savePreferences = (prefs: { baseSalary: number }) => {
        localStorage.setItem('finanzas_preferences', JSON.stringify(prefs));
        loadData();
    };

    return { preferences, savePreferences };
}
