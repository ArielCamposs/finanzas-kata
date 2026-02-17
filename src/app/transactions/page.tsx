'use client';

import { useTransactions, useCategories } from '@/hooks/use-finance';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowUpLeft, ArrowDownRight, ArrowRight, Trash2, PlusCircle, List } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { utils } from '@/lib/utils';

export default function TransactionsPage() {
    const { transactions, removeTransaction } = useTransactions();
    const { categories } = useCategories();

    const getCategory = (id: string) => categories.find((c) => c.id === id);

    // Group by month
    const grouped = transactions.reduce((acc, t) => {
        const month = t.date.slice(0, 7); // YYYY-MM
        if (!acc[month]) acc[month] = [];
        acc[month].push(t);
        return acc;
    }, {} as Record<string, typeof transactions>);

    const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return (
        <div className="pb-20 space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Movimientos</h1>
            </header>

            {sortedMonths.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center space-y-4">
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full">
                        <List size={48} className="text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <div>
                        <p className="text-zinc-500 font-medium">No tienes movimientos registrados.</p>
                        <p className="text-zinc-400 text-sm">Tus ingresos y gastos aparecerán aquí.</p>
                    </div>
                    <Link
                        href="/add"
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
                    >
                        <PlusCircle size={18} />
                        Registrar primer movimiento
                    </Link>
                </div>
            ) : (
                sortedMonths.map((month) => (
                    <div key={month} className="space-y-3">
                        <h3 className="text-sm font-semibold text-zinc-500 bg-zinc-50 dark:bg-zinc-800 py-1 px-3 rounded-md w-fit">
                            {format(utils.parseLocalDate(month + '-01'), 'MMMM yyyy', { locale: es })}
                        </h3>

                        <div className="bg-white dark:bg-[#363259] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
                            {grouped[month]
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((t) => {
                                    const category = getCategory(t.categoryId);
                                    const isExpense = t.type === 'expense';
                                    const isIncome = t.type === 'income';

                                    return (
                                        <div key={t.id} className="p-4 flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "p-2 rounded-full",
                                                    isExpense ? "bg-red-100 text-red-600 dark:bg-red-900/20" :
                                                        isIncome ? "bg-green-100 text-green-600 dark:bg-green-900/20" :
                                                            "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                                                )}>
                                                    {isIncome ? <ArrowUpLeft size={18} /> :
                                                        isExpense ? <ArrowDownRight size={18} /> :
                                                            <ArrowRight size={18} />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-white text-sm">{t.description}</p>
                                                    <p className="text-xs text-zinc-500">
                                                        {format(utils.parseLocalDate(t.date), "d 'de' MMM", { locale: es })} • {category?.name || 'Sin categoría'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className={clsx(
                                                    "font-semibold text-sm",
                                                    isIncome ? "text-green-600" : "text-zinc-900 dark:text-zinc-100"
                                                )}>
                                                    {isExpense ? '- ' : '+ '}
                                                    ${t.amount.toLocaleString('es-CL')}
                                                </span>

                                                <button
                                                    onClick={() => {
                                                        if (confirm('¿Eliminar este movimiento?')) removeTransaction(t.id);
                                                    }}
                                                    className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
