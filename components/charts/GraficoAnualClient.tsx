'use client'
import { useEffect, useState, ComponentType } from 'react'

interface DatoMes {
    mes: number
    ingresos: number
    gastos: number
}

export function GraficoAnualClient({ datos }: { datos: DatoMes[] }) {
    const [Chart, setChart] = useState<ComponentType<{ datos: DatoMes[] }> | null>(null)

    useEffect(() => {
        import('./GraficoAnual').then(m => setChart(() => m.GraficoAnual))
    }, [])

    if (!Chart) return (
        <div className="h-[300px] rounded-2xl border border-border bg-card animate-pulse" />
    )

    return <Chart datos={datos} />
}
