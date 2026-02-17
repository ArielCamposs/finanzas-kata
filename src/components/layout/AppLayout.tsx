'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { SplashScreen } from '@/components/ui/SplashScreen';

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex h-screen bg-purple-50 dark:bg-[#2a2740] text-zinc-900 dark:text-zinc-100">
            <SplashScreen />

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#322e4d] border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-center z-40 transition-colors">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    Finanzas<span className="text-purple-600">Kata</span>
                </h1>
            </header>

            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-20 pt-16 md:pt-0 md:pb-0 md:pl-64 transition-all">
                <div className="container mx-auto p-4 max-w-5xl">
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
