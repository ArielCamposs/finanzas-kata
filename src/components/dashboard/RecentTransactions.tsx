import { Transaction, Category } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowUpLeft, ArrowDownRight, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { utils } from '@/lib/utils';

interface RecentTransactionsProps {
    transactions: Transaction[];
    categories: Category[];
}

export function RecentTransactions({ transactions, categories }: RecentTransactionsProps) {
    // Get last 5 transactions sorted by date desc
    const recent = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // String sort YYYY-MM-DD works too but sticking to time
        .slice(0, 5);

    const getCategory = (id: string) => categories.find((c) => c.id === id);

    return (
        <div className="bg-white dark:bg-[#363259] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <h2 className="font-semibold text-zinc-900 dark:text-white">Movimientos Recientes</h2>
                <Link href="/transactions" className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                    Ver todo <ArrowRight size={14} />
                </Link>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recent.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-sm">
                        No hay movimientos recientes. <br />
                        ¡Comienza registrando tus gastos o ingresos!
                    </div>
                ) : (
                    recent.map((t) => {
                        const category = getCategory(t.categoryId);
                        const isExpense = t.type === 'expense';
                        const isIncome = t.type === 'income';

                        return (
                            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
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
                                            {format(utils.parseLocalDate(t.date), "d 'de' MMMM", { locale: es })} • {category?.name || 'Sin categoría'}
                                        </p>
                                    </div>
                                </div>
                                <div className={clsx(
                                    "font-semibold text-sm",
                                    isIncome ? "text-green-600" : "text-zinc-900 dark:text-zinc-100"
                                )}>
                                    {isExpense ? '- ' : '+ '}
                                    ${t.amount.toLocaleString('es-CL')}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
