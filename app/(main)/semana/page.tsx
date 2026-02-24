export const dynamic = 'force-dynamic'

import { obtenerPresupuestoSemanal, obtenerGastosSemanales } from '@/lib/action'
import { PresupuestoForm } from '@/components/semana/PresupuestoForm'
import { BarraProgreso } from '@/components/semana/BarraProgreso'
import { GastosSemanales } from '@/components/semana/GastosSemanales'

/** Devuelve el número de semana ISO (1-53) para una fecha dada */
function getSemanaISO(fecha: Date): number {
    const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/** Devuelve el lunes y domingo de la semana ISO dada */
function getRangoDeSemana(semana: number, anio: number): { inicio: Date; fin: Date } {
    // Encuentra el primer lunes de la semana ISO
    const simple = new Date(anio, 0, 1 + (semana - 1) * 7)
    const dow = simple.getDay()
    const lunes = new Date(simple)
    lunes.setDate(simple.getDate() - (dow === 0 ? 6 : dow - 1))
    const domingo = new Date(lunes)
    domingo.setDate(lunes.getDate() + 6)
    return { inicio: lunes, fin: domingo }
}

function toISO(fecha: Date): string {
    return fecha.toISOString().split('T')[0]
}

export default async function SemanaPage() {
    const hoy = new Date()
    const semana = getSemanaISO(hoy)
    const anio = hoy.getFullYear()

    const { inicio, fin } = getRangoDeSemana(semana, anio)

    const [presupuesto, gastos] = await Promise.all([
        obtenerPresupuestoSemanal(semana, anio),
        obtenerGastosSemanales(toISO(inicio), toISO(fin)),
    ])

    const totalGastado = gastos.reduce((s: number, g: any) => s + Number(g.monto), 0)
    const diasRestantes = Math.max(0, Math.ceil((fin.getTime() - hoy.getTime()) / 86400000))

    const nombreSemana = `${inicio.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })} – ${fin.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}`

    return (
        <div className="flex flex-col gap-6">

            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-semibold">Esta semana 📅</h1>
                <p className="text-muted-foreground text-sm mt-1 capitalize">
                    Semana {semana} · {nombreSemana}
                </p>
            </div>

            {/* Definir presupuesto */}
            <PresupuestoForm
                semana={semana}
                anio={anio}
                montoActual={presupuesto}
            />

            {/* Barra de progreso */}
            <BarraProgreso
                gastado={totalGastado}
                limite={presupuesto}
                diasRestantes={diasRestantes}
            />

            {/* Lista de gastos de la semana */}
            <GastosSemanales gastos={gastos} />

        </div>
    )
}
