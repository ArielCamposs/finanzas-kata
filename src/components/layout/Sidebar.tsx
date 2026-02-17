'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, PieChart, Target, Settings, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/', icon: Home, label: 'Inicio' },
        { href: '/transactions', icon: List, label: 'Movimientos' },
        { href: '/budget', icon: PieChart, label: 'Presupuesto' },
        { href: '/goals', icon: Target, label: 'Metas' },
        { href: '/settings', icon: Settings, label: 'Ajustes' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-[#322e4d] border-r border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    Finanzas<span className="text-purple-600">Kata</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link
                    href="/add"
                    className="flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mb-6 font-medium shadow-sm shadow-purple-500/30"
                >
                    <PlusCircle size={20} />
                    Registrar
                </Link>

                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-purple-50 dark:hover:bg-zinc-800'
                            )}
                        >
                            <Icon size={20} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-center text-zinc-400">
                    v0.1.0 • Local Storage
                </p>
            </div>
        </aside>
    );
}
