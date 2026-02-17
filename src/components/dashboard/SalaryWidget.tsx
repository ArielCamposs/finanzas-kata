'use client';

import { usePreferences, useTransactions } from '@/hooks/use-finance';
import { utils } from '@/lib/utils';
import { Plus, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';

export function SalaryWidget() {
    const { preferences } = usePreferences();
    const { transactions, addTransaction } = useTransactions();

    const currentMonth = utils.getLocalDateISO().slice(0, 7); // YYYY-MM

    const hasSalaryRecorded = useMemo(() => {
        return transactions.some(t =>
            t.type === 'income' &&
            t.date.startsWith(currentMonth) &&
            (t.description.toLowerCase().includes('sueldo') || t.categoryId === 'cat_income') &&
            t.amount >= (preferences.baseSalary || 1) // Heuristic: it's likely the salary if it's substantial
        );
    }, [transactions, currentMonth, preferences.baseSalary]);

    const handleRegisterSalary = () => {
        if (!preferences.baseSalary) {
            alert('Primero configura tu sueldo base en Ajustes');
            return;
        }

        addTransaction({
            id: crypto.randomUUID(),
            date: utils.getLocalDateISO(),
            amount: preferences.baseSalary,
            description: 'Sueldo Mensual',
            categoryId: 'cat_income', // Default income category
            type: 'income',
            notes: 'Registrado automáticamente desde Dashboard'
        });
    };

    if (!preferences.baseSalary) return null; // Don't show if not configured

    if (hasSalaryRecorded) return null; // Don't show if already done (cleaner dashboard)

    return (
        <div className="bg-purple-600 dark:bg-purple-700 rounded-xl p-4 text-white shadow-lg shadow-purple-900/20 mb-6 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-lg">¿Ya recibiste tu sueldo?</h3>
                <p className="text-purple-100 text-sm">Regístralo con un click para actualizar tu presupuesto.</p>
            </div>
            <button
                onClick={handleRegisterSalary}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-50 transition-colors shadow-sm"
            >
                <Plus size={18} />
                Registrar
            </button>
        </div>
    );
}
