'use client';

import { useEffect, useState } from 'react';
import { PiggyBank, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Hide after 2.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500);

        // Remove from DOM after fade out animation
        const cleanupTimer = setTimeout(() => {
            setShouldRender(false);
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(cleanupTimer);
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={clsx(
                "fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-violet-500 to-purple-500 transition-opacity duration-500",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            <div className="relative animate-bounce mb-6">
                <PiggyBank size={80} className="text-white relative z-10" />
                <Sparkles size={40} className="text-yellow-300 absolute -top-4 -right-4 animate-pulse" />
            </div>

            <h1 className="text-3xl font-bold text-white text-center px-6 leading-relaxed max-w-md animate-pulse">
                AHORRA PARA EL DEPA!! <br />
                <span className="text-yellow-300">TE AMO</span>
            </h1>
        </div>
    );
}
