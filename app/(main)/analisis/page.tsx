export const dynamic = 'force-dynamic'

import { obtenerDatosMes, obtenerGastosPorCategoria, obtenerResumenMesAnterior } from '@/lib/action'
import { Regla502030 } from '@/components/Regla502030'
import { GraficoCategorias } from '@/components/charts/GraficoCategorias'
import { ComparativaMes } from '@/components/ComparativaMes'

export default async function AnalisisPage() {
    const hoy = new Date()
    const mes = hoy.getMonth() + 1
    const anio = hoy.getFullYear()

    const [{ ingresos, gastos }, categorias, anterior] = await Promise.all([
        obtenerDatosMes(mes, anio),
        obtenerGastosPorCategoria(mes, anio),
        obtenerResumenMesAnterior(mes, anio),
    ])

    const totalIngresos = ingresos.reduce((s: number, r: any) => s + r.monto, 0)
    const totalGastos = gastos.reduce((s: number, r: any) => s + r.monto, 0)

    return (
        <div className="flex flex-col gap-6">

            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-semibold">Análisis 📊</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Desglose detallado de tus finanzas del mes actual
                </p>
            </div>

            {/* Regla 50/30/20 */}
            <Regla502030
                totalIngresos={totalIngresos}
                totalGastos={totalGastos}
            />

            {/* Categorías + Comparativa en grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <GraficoCategorias datos={categorias} />
                <ComparativaMes
                    totalIngresos={totalIngresos}
                    totalGastos={totalGastos}
                    ingresosAnterior={anterior.totalIngresos}
                    gastosAnterior={anterior.totalGastos}
                />
            </div>

        </div>
    )
}
