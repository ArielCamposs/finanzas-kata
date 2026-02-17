'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, Budget, Goal } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const { user } = useAuth();

    const refresh = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (!error && data) {
            // Map DB snake_case columns to camelCase if necessary, 
            // but our types match mostly. category_id -> categoryId needs handling if we want strict typing
            // Actually, Supabase returns snake_case. We might need a transformer or update types.
            // For MVP, let's cast or map.
            const mapped = data.map((t: any) => ({
                ...t,
                categoryId: t.category_id,
                userId: t.user_id,
            }));
            setTransactions(mapped);
        }
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addTransaction = async (t: Transaction) => {
        if (!user) return;
        // Don't send 'id' if you want DB to generate it, or use crypto.randomUUID() client side
        // Our types say 'id' is required. Let's use it.
        const { error } = await supabase.from('transactions').insert({
            id: t.id,
            date: t.date,
            amount: t.amount,
            description: t.description,
            category_id: t.categoryId,
            type: t.type,
            notes: t.notes,
            user_id: user.id
        });

        if (!error) refresh();
        else console.error(error);
    };

    const removeTransaction = async (id: string) => {
        if (!user) return;
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (!error) refresh();
    };

    return { transactions, addTransaction, removeTransaction, refresh };
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const { user } = useAuth();

    const refresh = useCallback(async () => {
        if (!user) return;
        // Use standard seeding if empty? 
        // For now just fetch.
        const { data, error } = await supabase.from('categories').select('*');
        if (!error && data) {
            setCategories(data);
        }
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addCategory = async (c: Category) => {
        if (!user) return;
        const { error } = await supabase.from('categories').insert({
            id: c.id,
            name: c.name,
            type: c.type,
            color: c.color,
            icon: c.icon,
            user_id: user.id
        });
        if (!error) refresh();
    };

    return { categories, addCategory, refresh };
}

export function useBudgets() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const { user } = useAuth();

    const refresh = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase.from('budgets').select('*');
        if (!error && data) {
            const mapped = data.map((b: any) => ({
                ...b,
                categoryId: b.category_id,
            }));
            setBudgets(mapped);
        }
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const setBudget = async (b: Budget) => {
        if (!user) return;
        // Check if exists to update or insert
        // Or use 'upsert'
        // We need a unique constraint on (category_id, month, user_id) for upsert to work perfectly without ID
        // But our 'b' has an ID if it's an update.

        const payload = {
            id: b.id,
            category_id: b.categoryId,
            amount: b.amount,
            month: b.month,
            user_id: user.id
        };

        const { error } = await supabase.from('budgets').upsert(payload, { onConflict: 'id' });
        if (!error) refresh();
    };

    return { budgets, setBudget, refresh };
}

export function useGoals() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const { user } = useAuth();

    const refresh = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase.from('goals').select('*');
        if (!error && data) {
            const mapped = data.map((g: any) => ({
                ...g,
                targetAmount: g.target_amount,
                currentAmount: g.current_amount
            }));
            setGoals(mapped);
        }
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addGoal = async (g: Goal) => {
        if (!user) return;
        const { error } = await supabase.from('goals').insert({
            id: g.id,
            name: g.name,
            target_amount: g.targetAmount,
            current_amount: g.currentAmount,
            user_id: user.id
        });
        if (!error) refresh();
    };

    return { goals, addGoal, refresh };
}

export function usePreferences() {
    const [preferences, setPreferences] = useState<{ baseSalary: number }>({ baseSalary: 0 });
    // Note: We didn't create a 'preferences' table.
    // For MVP, we can treat 'Sueldo' category income as base salary? 
    // Or just store it in LocalStorage for now as it's less critical? 
    // OR create a profiles table. 
    // Let's stick to localStorage for preferences for this step to minimize complexity, 
    // OR create a quick profile table.

    // User asked to "persist". Preferences should persist.
    // Let's use localStorage for now to not block.

    const loadData = () => {
        const saved = localStorage.getItem('finanzas_preferences');
        if (saved) setPreferences(JSON.parse(saved));
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
