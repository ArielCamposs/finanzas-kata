import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Suspense } from 'react';

export default function AddTransactionPage() {
    return (
        <div className="pb-20">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Nuevo Movimiento</h1>
            </header>
            <Suspense fallback={<div>Cargando formulario...</div>}>
                <TransactionForm />
            </Suspense>
        </div>
    );
}
