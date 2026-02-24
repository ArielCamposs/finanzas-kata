'use client'
import dynamic from 'next/dynamic'

const GraficoAnual = dynamic(
    () => import('./GraficoAnual').then(m => m.GraficoAnual),
    {
        ssr: false,
        loading: () => (
            <div className="h-[300px] rounded-2xl border border-border bg-card animate-pulse" />
        ),
    }
)

interface DatoMes {
    mes: number
    ingresos: number
    gastos: number
}

export function GraficoAnualClient({ datos }: { datos: DatoMes[] }) {
    return <GraficoAnual datos={datos} />
}
