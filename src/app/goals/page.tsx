'use client';

import { useGoals, useTransactions } from '@/hooks/use-finance';
import { useState } from 'react';
import { Plus, Target, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

export default function GoalsPage() {
    const { goals, addGoal } = useGoals();
    const { transactions } = useTransactions();
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');

    const calculateProgress = (goalId: string) => {
        // Current amount from transactions linked to this goal (by notes convention we set up)
        // "Aporte a meta: goalId"
        // OR we could have a simpler 'manual' currentAmount in the Goal object itself if we edited it.
        // The prompt suggested "Registrar aportes manuales ... como transacciones"
        // So we iterate transactions to sum up contributions.
        return transactions
            .filter(t => t.type === 'goal_contribution' && t.notes?.includes(goalId))
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        addGoal({
            id: crypto.randomUUID(),
            name,
            targetAmount: Number(target),
            currentAmount: 0, // Will be calculated dynamically or we can update this field too.
        });
        setName('');
        setTarget('');
        setShowForm(false);
    };

    return (
        <div className="pb-20 space-y-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Metas de Ahorro</h1>
                    <p className="text-zinc-500 text-sm">Visualiza y alcanza tus objetivos</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg"
                >
                    <Plus size={24} />
                </button>
            </header>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-white dark:bg-[#363259] p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Nombre de la Meta</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            placeholder="Ej: Vacaciones"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-zinc-300">Monto Objetivo</label>
                        <input
                            type="number"
                            value={target}
                            onChange={e => setTarget(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            placeholder="0"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium">Crear Meta</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-zinc-500">
                        No tienes metas activas. ¡Crea una para empezar!
                    </div>
                ) : (
                    goals.map(goal => {
                        const current = calculateProgress(goal.id);
                        const progress = (current / goal.targetAmount) * 100;
                        const isCompleted = current >= goal.targetAmount;

                        return (
                            <div key={goal.id} className="bg-white dark:bg-[#363259] p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
                                {isCompleted && (
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-yellow-500">
                                        <Trophy size={100} />
                                    </div>
                                )}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400">
                                        <Target size={24} />
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xl font-bold text-zinc-900 dark:text-white">${current.toLocaleString('es-CL')}</span>
                                        <span className="text-xs text-zinc-500">de ${goal.targetAmount.toLocaleString('es-CL')}</span>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">{goal.name}</h3>

                                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={clsx("h-full rounded-full transition-all duration-1000", isCompleted ? "bg-green-500" : "bg-purple-600")}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <p className="text-right text-xs text-zinc-500 mt-1">{progress.toFixed(0)}% completado</p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
