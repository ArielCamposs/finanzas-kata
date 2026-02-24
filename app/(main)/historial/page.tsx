import { obtenerDatosMes, obtenerResumenAnual } from '@/lib/action'
import { ResumenCards } from '@/components/ResumenCards'
import { ListaTransacciones } from '@/components/ListaTransacciones'
import { SelectorMes } from '@/components/SelectorMes'
import { GraficoAnualClient } from '@/components/charts/GraficoAnualClient'

interface Props {
    searchParams: Promise<{ mes?: string; anio?: string }>
}

export default async function HistorialPage({ searchParams }: Props) {
    const params = await searchParams
    const hoy = new Date()
    const mes = Number(params.mes ?? hoy.getMonth() + 1)
    const anio = Number(params.anio ?? hoy.getFullYear())

    const { ingresos, gastos } = await obtenerDatosMes(mes, anio)
    const resumenAnual = await obtenerResumenAnual(anio)

    const totalIngresos = ingresos.reduce((s: number, r: any) => s + r.monto, 0)
    const totalGastos = gastos.reduce((s: number, r: any) => s + r.monto, 0)

    const nombreMes = new Date(anio, mes - 1).toLocaleDateString('es-CL', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="flex flex-col gap-6">

            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-semibold capitalize">
                    Historial 🗂️
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Navega entre tus registros de meses anteriores
                </p>
            </div>

            {/* Selector de mes */}
            <SelectorMes mesActual={mes} anioActual={anio} />

            {/* Resumen del mes seleccionado */}
            <div>
                <h2 className="text-base font-medium text-muted-foreground capitalize mb-3">
                    {nombreMes}
                </h2>
                <ResumenCards
                    totalIngresos={totalIngresos}
                    totalGastos={totalGastos}
                />
            </div>

            {/* Gráfico Anual */}
            <GraficoAnualClient datos={resumenAnual} />

            {/* Transacciones del mes */}
            <ListaTransacciones ingresos={ingresos} gastos={gastos} />

        </div>
    )
}
