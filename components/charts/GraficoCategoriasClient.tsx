'use client'
import dynamic from 'next/dynamic'

const GraficoCategorias = dynamic(
    () => import('./GraficoCategorias').then(m => m.GraficoCategorias),
    {
        ssr: false,
        loading: () => (
            <div className="h-[400px] rounded-2xl border border-border bg-card animate-pulse" />
        ),
    }
)

interface Dato {
    categoria: string
    total: number
}

export function GraficoCategoriasClient({ datos }: { datos: Dato[] }) {
    return <GraficoCategorias datos={datos} />
}
