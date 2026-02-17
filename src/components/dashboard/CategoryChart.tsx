'use client';

import { Transaction, Category } from '@/types';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryChartProps {
    transactions: Transaction[];
    categories: Category[];
}

export function CategoryChart({ transactions, categories }: CategoryChartProps) {
    const data = useMemo(() => {
        const currentMonth = new Date().toISOString().slice(0, 7);

        // Aggregate expenses by category
        const expenseMap = transactions
            .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
            .reduce((acc, t) => {
                acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        return Object.entries(expenseMap)
            .map(([catId, amount]) => {
                const category = categories.find((c) => c.id === catId);
                return {
                    name: category?.name || 'Otros',
                    value: amount,
                    color: category?.color || '#94a3b8',
                };
            })
            .sort((a, b) => b.value - a.value); // Sort desc
    }, [transactions, categories]);

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-[#363259] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-center h-[300px]">
                <p className="text-zinc-500 text-sm">No hay gastos este mes</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#363259] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 h-[300px]">
            <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Gastos por Categoría</h2>
            <div className="h-[220px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => [`$${value.toLocaleString('es-CL')}`, 'Monto']}
                        />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
