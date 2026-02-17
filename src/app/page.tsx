'use client';

import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SalaryWidget } from '@/components/dashboard/SalaryWidget';
import { useTransactions, useCategories } from '@/hooks/use-finance';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

export default function Dashboard() {
  const { transactions } = useTransactions();
  const { categories } = useCategories();

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Resumen Mensual</h1>
        <p className="text-zinc-500 text-sm">Estado financiero actual</p>
      </header>

      {/* Quick Actions for Non-Tech Users */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/add?type=income" className="bg-green-100 dark:bg-[#363259] p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-[#403c66] transition-colors">
          <div className="bg-green-600 text-white p-2 rounded-full">
            <TrendingUp size={24} />
          </div>
          <span className="font-semibold text-green-700 dark:text-green-400">Nuevo Ingreso</span>
        </Link>

        <Link href="/add?type=expense" className="bg-red-100 dark:bg-[#363259] p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-[#403c66] transition-colors">
          <div className="bg-red-600 text-white p-2 rounded-full">
            <TrendingDown size={24} />
          </div>
          <span className="font-semibold text-red-700 dark:text-red-400">Nuevo Gasto</span>
        </Link>
      </div>

      <SalaryWidget />

      <SummaryCards transactions={transactions} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryChart transactions={transactions} categories={categories} />
        <RecentTransactions transactions={transactions} categories={categories} />
      </div>
    </div>
  );
}
