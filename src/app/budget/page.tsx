'use client';

import { useBudgets, useTransactions, useCategories } from '@/hooks/use-finance';
import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { Edit2 } from 'lucide-react';

export default function BudgetPage() {
    const { budgets, setBudget } = useBudgets();
    const { transactions } = useTransactions();
    const { categories } = useCategories();
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState<string>('');

    const currentMonth = new Date().toISOString().slice(0, 7);

    // Calculate spending per category
    const spending = useMemo(() => {
        return transactions
            .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
            .reduce((acc, t) => {
                acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);
    }, [transactions, currentMonth]);

    const handleEdit = (categoryId: string, currentAmount: number) => {
        setEditingCategory(categoryId);
        setEditAmount(currentAmount.toString());
    };

    const handleSave = (() => {
        if (!editingCategory) return;
        const amount = parseInt(editAmount) || 0;

        // Find existing budget ID or create new one
        const existing = budgets.find(b => b.categoryId === editingCategory && b.month === currentMonth);

        setBudget({
            id: existing?.id || crypto.randomUUID(),
            categoryId: editingCategory,
            amount,
            month: currentMonth
        });

        setEditingCategory(null);
    });

    return (
        <div className="pb-20 space-y-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Presupuesto Mensual</h1>
                <p className="text-zinc-500 text-sm">Gestiona tus límites de gasto por categoría</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {categories
                    .filter(c => c.type === 'expense')
                    .map((cat) => {
                        const budget = budgets.find(b => b.categoryId === cat.id && b.month === currentMonth);
                        const limit = budget?.amount || 0;
                        const spent = spending[cat.id] || 0;
                        const progress = limit > 0 ? (spent / limit) * 100 : 0;
                        const isOver = spent > limit && limit > 0;

                        const isEditing = editingCategory === cat.id;

                        return (
                            <div key={cat.id} className="bg-white dark:bg-[#363259] p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                        <span className="font-medium text-zinc-900 dark:text-white">{cat.name}</span>
                                    </div>

                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={editAmount}
                                                onChange={(e) => setEditAmount(e.target.value)}
                                                className="w-24 p-1 border rounded text-right dark:bg-zinc-800 dark:text-white"
                                                autoFocus
                                            />
                                            <button onClick={handleSave} className="text-sm text-purple-600 font-medium">Guardar</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                                ${spent.toLocaleString('es-CL')}
                                                <span className="text-zinc-400 font-normal"> / {limit > 0 ? `$${limit.toLocaleString('es-CL')}` : 'Sin límite'}</span>
                                            </span>
                                            <button onClick={() => handleEdit(cat.id, limit)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                                <Edit2 size={14} className="text-zinc-400" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={clsx(
                                            "h-full rounded-full transition-all duration-500",
                                            isOver ? "bg-red-500" : "bg-purple-500"
                                        )}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                {isOver && <p className="text-xs text-red-500 mt-1 font-medium">¡Has excedido tu presupuesto!</p>}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
