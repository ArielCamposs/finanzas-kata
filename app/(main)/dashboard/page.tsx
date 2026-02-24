export const dynamic = 'force-dynamic'

import { obtenerDatosMes } from '@/lib/action'
import { ResumenCards } from '@/components/ResumenCards'
import { FormIngreso } from '@/components/ingresos/FormIngreso'
import { FormGasto } from '@/components/gastos/FormGasto'
import { ListaTransacciones } from '@/components/ListaTransacciones'

export default async function DashboardPage() {
    const hoy = new Date()
    const mes = hoy.getMonth() + 1
    const anio = hoy.getFullYear()

    const { ingresos, gastos } = await obtenerDatosMes(mes, anio)

    const totalIngresos = ingresos.reduce((s: number, r: any) => s + r.monto, 0)
    const totalGastos = gastos.reduce((s: number, r: any) => s + r.monto, 0)

    const nombreMes = hoy.toLocaleDateString('es-CL', {
        month: 'long', year: 'numeric',
    })

    return (
        <div className="flex flex-col gap-6">

            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-semibold capitalize">
                    {nombreMes} 🌸
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Resumen de tus finanzas del mes actual
                </p>
            </div>

            {/* Tarjetas de resumen */}
            <ResumenCards
                totalIngresos={totalIngresos}
                totalGastos={totalGastos}
            />

            {/* Formularios */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <FormIngreso />
                <FormGasto />
            </div>

            {/* Últimas transacciones */}
            <ListaTransacciones ingresos={ingresos} gastos={gastos} />

        </div>
    )
}
