'use client'
import { useEffect, useState, ComponentType } from 'react'

interface Dato {
    categoria: string
    total: number
}

export function GraficoCategoriasClient({ datos }: { datos: Dato[] }) {
    const [Chart, setChart] = useState<ComponentType<{ datos: Dato[] }> | null>(null)

    useEffect(() => {
        import('./GraficoCategorias').then(m => setChart(() => m.GraficoCategorias))
    }, [])

    if (!Chart) return (
        <div className="h-[400px] rounded-2xl border border-border bg-card animate-pulse" />
    )

    return <Chart datos={datos} />
}
