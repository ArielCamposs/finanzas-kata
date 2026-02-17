import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';
import { Transaction } from '@/types';
import { useMemo } from 'react';

interface SummaryCardsProps {
    transactions: Transaction[];
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
    const summary = useMemo(() => {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        return transactions.reduce(
            (acc, t) => {
                if (!t.date.startsWith(currentMonth)) return acc;

                if (t.type === 'income') {
                    acc.income += t.amount;
                } else if (t.type === 'expense') {
                    acc.expense += t.amount;
                } else if (t.type === 'goal_contribution') {
                    acc.savings += t.amount;
                }
                return acc;
            },
            { income: 0, expense: 0, savings: 0 }
        );
    }, [transactions]);

    const balance = summary.income - summary.expense - summary.savings;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Balance */}
            <div className="col-span-2 md:col-span-1 bg-white dark:bg-[#363259] p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                    <Wallet size={16} />
                    <span>Saldo Mensual</span>
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                    ${balance.toLocaleString('es-CL')}
                </div>
            </div>

            {/* Income */}
            <div className="bg-white dark:bg-[#363259] p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                    <TrendingUp size={16} />
                    <span>Ingresos</span>
                </div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                    ${summary.income.toLocaleString('es-CL')}
                </div>
            </div>

            {/* Expense */}
            <div className="bg-white dark:bg-[#363259] p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
                    <TrendingDown size={16} />
                    <span>Gastos</span>
                </div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                    ${summary.expense.toLocaleString('es-CL')}
                </div>
            </div>

            {/* Savings */}
            <div className="bg-white dark:bg-[#363259] p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
                    <Target size={16} />
                    <span>Ahorro</span>
                </div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                    ${summary.savings.toLocaleString('es-CL')}
                </div>
            </div>
        </div>
    );
}
