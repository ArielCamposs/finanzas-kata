'use server'
import { supabase } from './supabase'
import { revalidatePath } from 'next/cache'

// ─── INGRESOS ───────────────────────────────────────────

export async function agregarIngreso(data: {
    monto: number
    descripcion: string
    categoria: string
    fecha: string
}) {
    const fecha = new Date(data.fecha)
    const { error } = await supabase.from('ingresos').insert({
        ...data,
        mes: fecha.getMonth() + 1,
        anio: fecha.getFullYear(),
    })
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard')
}

export async function eliminarIngreso(id: string) {
    const { error } = await supabase.from('ingresos').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard')
}

// ─── GASTOS ─────────────────────────────────────────────

export async function agregarGasto(data: {
    monto: number
    descripcion: string
    categoria: string
    fecha: string
}) {
    const fecha = new Date(data.fecha)
    const { error } = await supabase.from('gastos').insert({
        ...data,
        mes: fecha.getMonth() + 1,
        anio: fecha.getFullYear(),
    })
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard')
}

export async function eliminarGasto(id: string) {
    const { error } = await supabase.from('gastos').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard')
}

// ─── CONSULTAS ──────────────────────────────────────────

export async function obtenerDatosMes(mes: number, anio: number) {
    const [{ data: ingresos }, { data: gastos }] = await Promise.all([
        supabase
            .from('ingresos')
            .select('*')
            .eq('mes', mes)
            .eq('anio', anio)
            .order('fecha', { ascending: false }),
        supabase
            .from('gastos')
            .select('*')
            .eq('mes', mes)
            .eq('anio', anio)
            .order('fecha', { ascending: false }),
    ])
    return { ingresos: ingresos ?? [], gastos: gastos ?? [] }
}

export async function obtenerResumenAnual(anio: number) {
    const [{ data: ingresos }, { data: gastos }] = await Promise.all([
        supabase.from('ingresos').select('monto, mes').eq('anio', anio),
        supabase.from('gastos').select('monto, mes').eq('anio', anio),
    ])

    // Agrupa por mes → [{mes: 1, ingresos: X, gastos: Y}, ...]
    const meses = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1
        const totalIngresos = ingresos
            ?.filter((r) => r.mes === m)
            .reduce((s, r) => s + r.monto, 0) ?? 0
        const totalGastos = gastos
            ?.filter((r) => r.mes === m)
            .reduce((s, r) => s + r.monto, 0) ?? 0
        return { mes: m, ingresos: totalIngresos, gastos: totalGastos }
    })

    return meses
}

// Gastos agrupados por categoría de un mes
export async function obtenerGastosPorCategoria(mes: number, anio: number) {
    const { data } = await supabase
        .from('gastos')
        .select('categoria, monto')
        .eq('mes', mes)
        .eq('anio', anio)

    if (!data || data.length === 0) return []

    const agrupado = data.reduce<Record<string, number>>((acc, item) => {
        acc[item.categoria] = (acc[item.categoria] ?? 0) + item.monto
        return acc
    }, {})

    return Object.entries(agrupado)
        .map(([categoria, total]) => ({ categoria, total }))
        .sort((a, b) => b.total - a.total)
}

// Resumen del mes anterior para comparativa
export async function obtenerResumenMesAnterior(mes: number, anio: number) {
    const mesAnterior = mes === 1 ? 12 : mes - 1
    const anioAnterior = mes === 1 ? anio - 1 : anio

    const [{ data: ingresos }, { data: gastos }] = await Promise.all([
        supabase.from('ingresos').select('monto').eq('mes', mesAnterior).eq('anio', anioAnterior),
        supabase.from('gastos').select('monto').eq('mes', mesAnterior).eq('anio', anioAnterior),
    ])

    return {
        totalIngresos: ingresos?.reduce((s: number, r: any) => s + r.monto, 0) ?? 0,
        totalGastos: gastos?.reduce((s: number, r: any) => s + r.monto, 0) ?? 0,
    }
}
