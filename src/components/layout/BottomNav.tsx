'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, PieChart, Target, Settings, Plus } from 'lucide-react';
import { clsx } from 'clsx';

export function BottomNav() {
    const pathname = usePathname();

    const links = [
        { href: '/', icon: Home, label: 'Inicio' },
        { href: '/transactions', icon: List, label: 'Movimientos' },
        { href: '/add', icon: Plus, label: 'Agregar', isAction: true },
        { href: '/budget', icon: PieChart, label: 'Presupuesto' },
        { href: '/goals', icon: Target, label: 'Ahorros' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#322e4d] border-t border-zinc-200 dark:border-zinc-800 pb-safe md:hidden">
            <div className="flex justify-around items-center h-16">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    if (link.isAction) {
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex flex-col items-center justify-center -mt-6"
                            >
                                <div className="bg-purple-600 text-white p-3 rounded-full shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition-colors">
                                    <Icon size={24} />
                                </div>
                                <span className="text-xs mt-1 font-medium text-zinc-600 dark:text-zinc-400">
                                    {link.label}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                'flex flex-col items-center justify-center w-full h-full transition-colors',
                                isActive
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                            )}
                        >
                            <Icon size={24} />
                            <span className="text-[10px] sm:text-xs mt-1">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
