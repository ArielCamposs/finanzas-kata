'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TransactionType, Category } from '@/types';
import { useTransactions, useCategories, useGoals } from '@/hooks/use-finance';
import { utils } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, PiggyBank } from 'lucide-react';
// Using crypto.randomUUID() is built-in for modern browsers/node

const schema = z.object({
    amount: z.number().min(1, 'El monto debe ser mayor a 0'),
    description: z.string().min(3, 'La descripción es muy corta').max(50, 'Máximo 50 caracteres'),
    categoryId: z.string().min(1, 'Selecciona una categoría'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
    type: z.enum(['income', 'expense', 'transfer', 'goal_contribution']),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function TransactionForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialType = searchParams.get('type') as any;

    const { addTransaction } = useTransactions();
    const { categories } = useCategories();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: initialType && ['income', 'expense', 'goal_contribution'].includes(initialType) ? initialType : 'expense',
            date: utils.getLocalDateISO(),
            amount: 0,
        },
    });

    const { goals } = useGoals();
    const [selectedGoalId, setSelectedGoalId] = useState<string>('');

    const type = watch('type');

    // Auto-select 'Ahorro' category when type is 'goal_contribution'
    useEffect(() => {
        if (type === 'goal_contribution') {
            const savingsCat = categories.find(c => c.id === 'cat_savings' || c.name === 'Ahorro');
            if (savingsCat) {
                setValue('categoryId', savingsCat.id);
            }
        }
    }, [type, categories, setValue]);

    const filteredCategories = categories.filter(c => c.type === (type === 'goal_contribution' ? 'expense' : type));

    const onSubmit = (data: FormData) => {
        addTransaction({
            id: crypto.randomUUID(),
            ...data,
            // Ensure numeric amount is saved
            amount: Number(data.amount),
            notes: type === 'goal_contribution' ? `Aporte a meta: ${selectedGoalId}` : data.notes,
        });

        // Optional: Update goal currentAmount here if we wanted to be explicit, but we'll derive it.
        router.back();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">

            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                {[
                    { val: 'expense', label: 'Gasto', icon: TrendingDown, color: 'text-red-600' },
                    { val: 'income', label: 'Ingreso', icon: TrendingUp, color: 'text-green-600' },
                    { val: 'goal_contribution', label: 'Meta', icon: Target, color: 'text-blue-600' }
                ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = type === t.val;
                    return (
                        <button
                            key={t.val}
                            type="button"
                            onClick={() => setValue('type', t.val as any)}
                            className={clsx(
                                'flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all',
                                isSelected
                                    ? 'bg-white dark:bg-zinc-700 shadow ring-1 ring-zinc-200 dark:ring-zinc-600'
                                    : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700/50'
                            )}
                        >
                            <Icon size={20} className={clsx("mb-1", isSelected ? t.color : "text-zinc-400")} />
                            <span className={clsx("text-xs font-medium", isSelected ? "text-zinc-900 dark:text-white" : "text-zinc-500")}>
                                {t.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Goal Selector */}
            {type === 'goal_contribution' && (
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Seleccionar Meta</label>
                    <select
                        value={selectedGoalId}
                        onChange={(e) => setSelectedGoalId(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent outline-none dark:text-white dark:bg-zinc-900"
                    >
                        <option value="">Selecciona una meta...</option>
                        {goals.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Amount */}
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Monto (CLP)</label>
                <input
                    type="number"
                    step="1"
                    {...register('amount', { valueAsNumber: true })}
                    className="w-full text-3xl font-bold bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-purple-500 outline-none py-2 text-zinc-900 dark:text-white placeholder-zinc-300"
                    placeholder="0"
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descripción</label>
                <input
                    {...register('description')}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                    placeholder="Ej: Compras del super"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Category - Hide if goal_contribution */}
            {type !== 'goal_contribution' && (
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Categoría</label>
                    <div className="grid grid-cols-2 gap-2">
                        {filteredCategories.map((cat) => (
                            <label
                                key={cat.id}
                                className={clsx(
                                    "cursor-pointer border rounded-lg p-3 flex items-center gap-2 transition-all",
                                    watch('categoryId') === cat.id
                                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-500"
                                        : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                <input
                                    type="radio"
                                    value={cat.id}
                                    {...register('categoryId')}
                                    className="sr-only"
                                />
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                    {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                </div>
            )}

            {/* Date */}
            <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fecha</label>
                <input
                    type="date"
                    {...register('date')}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-purple-600/20"
            >
                Guardar Movimiento
            </button>
        </form>
    );
}
