'use client';

import { Trash2, Database, Github, RefreshCw, Tags, Plus, X } from 'lucide-react';
import { useCategories, usePreferences } from '@/hooks/use-finance';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const { categories, addCategory } = useCategories();
    const { preferences, savePreferences } = usePreferences();

    const [showAddCat, setShowAddCat] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatType, setNewCatType] = useState<'expense' | 'income'>('expense');
    const [baseSalaryInput, setBaseSalaryInput] = useState('');

    useEffect(() => {
        if (preferences.baseSalary) {
            setBaseSalaryInput(preferences.baseSalary.toString());
        }
    }, [preferences]);

    const handleSaveSalary = () => {
        savePreferences({ baseSalary: Number(baseSalaryInput) });
        alert('Sueldo base actualizado');
    };

    const handleReset = () => {
        if (confirm('¿Estás seguro de borrar TODOS los datos? Esta acción no se puede deshacer.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleReload = () => {
        window.location.reload();
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName) return;
        addCategory({
            id: crypto.randomUUID(),
            name: newCatName,
            type: newCatType,
            color: newCatType === 'expense' ? '#ef4444' : '#22c55e', // Default colors
            icon: 'Tag'
        });
        setNewCatName('');
        setShowAddCat(false);
    };

    return (
        <div className="pb-20 space-y-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Ajustes</h1>
                <p className="text-zinc-500 text-sm">Configuración general y datos</p>
            </header>

            {/* Categories */}
            <section className="bg-white dark:bg-[#363259] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tags size={20} className="text-purple-600" />
                        <h2 className="font-semibold text-zinc-900 dark:text-white">Categorías</h2>
                    </div>
                    <button
                        onClick={() => setShowAddCat(!showAddCat)}
                        className="text-sm bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        {showAddCat ? <X size={16} /> : <Plus size={16} />}
                    </button>
                </div>

                {showAddCat && (
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                        <form onSubmit={handleAddCategory} className="flex gap-2 items-center">
                            <select
                                value={newCatType}
                                onChange={(e) => setNewCatType(e.target.value as any)}
                                className="p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="expense">Gasto</option>
                                <option value="income">Ingreso</option>
                            </select>
                            <input
                                value={newCatName}
                                onChange={e => setNewCatName(e.target.value)}
                                placeholder="Nombre categoría"
                                className="flex-1 p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                            />
                            <button type="submit" className="bg-purple-600 text-white p-2 rounded text-sm font-medium hover:bg-purple-700 transition-colors">Agregar</button>
                        </form>
                    </div>
                )}

                <div className="p-4 flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Data Management */}
            <section className="bg-white dark:bg-[#363259] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <Database size={20} className="text-purple-600" />
                    <h2 className="font-semibold text-zinc-900 dark:text-white">Gestión de Datos</h2>
                </div>

                <div className="p-4 space-y-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Los datos se guardan localmente en tu navegador. Si borras el caché, perderás tu información.
                    </p>

                    {/* Salary Config */}
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Sueldo Base Mensual</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={baseSalaryInput}
                                onChange={(e) => setBaseSalaryInput(e.target.value)}
                                placeholder="0"
                                className="flex-1 p-2 rounded border dark:bg-zinc-900 dark:border-zinc-700 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={handleSaveSalary}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                            >
                                Guardar
                            </button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                            Este monto se usará para registrar rápidamente tu ingreso mensual en el Dashboard.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleReload}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <RefreshCw size={16} /> Recargar App
                        </button>

                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                            <Trash2 size={16} /> Borrar Todo
                        </button>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="bg-white dark:bg-[#363259] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Sobre la App</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                        FinanzasKata v0.1.0
                        <br />
                        Desarrollado con Next.js 14, Tailwind y LocalStorage.
                    </p>

                    <a
                        href="https://github.com/tu-usuario/finanzas-kata"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-purple-600 hover:underline"
                    >
                        <Github size={16} /> Ver código fuente
                    </a>
                </div>
            </section>
        </div>
    );
}
