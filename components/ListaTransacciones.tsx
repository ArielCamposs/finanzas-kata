import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { eliminarIngreso, eliminarGasto } from '../lib/action'
import { Trash2 } from 'lucide-react'

interface Transaccion {
    id: string
    monto: number
    descripcion: string | null
    categoria: string
    fecha: string
}

interface Props {
    ingresos: Transaccion[]
    gastos: Transaccion[]
}

function formatCLP(monto: number) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(monto)
}

export function ListaTransacciones({ ingresos, gastos }: Props) {
    const todas = [
        ...ingresos.map((i) => ({ ...i, tipo: 'ingreso' as const })),
        ...gastos.map((g) => ({ ...g, tipo: 'gasto' as const })),
    ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    Últimas Transacciones
                </CardTitle>
            </CardHeader>
            <CardContent>
                {todas.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-8">
                        No hay registros este mes 🌸
                    </p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {todas.map((t) => (
                            <li
                                key={t.id}
                                className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant="secondary"
                                        className={
                                            t.tipo === 'ingreso'
                                                ? 'bg-[hsl(var(--ingreso))]/15 text-[hsl(var(--ingreso))]'
                                                : 'bg-primary/15 text-primary'
                                        }
                                    >
                                        {t.tipo === 'ingreso' ? '+' : '-'}
                                    </Badge>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {t.descripcion || t.categoria}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {t.categoria} ·{' '}
                                            {new Date(t.fecha).toLocaleDateString('es-CL')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`text-sm font-semibold ${t.tipo === 'ingreso'
                                            ? 'text-[hsl(var(--ingreso))]'
                                            : 'text-primary'
                                            }`}
                                    >
                                        {t.tipo === 'ingreso' ? '+' : '-'}
                                        {formatCLP(t.monto)}
                                    </span>
                                    <form
                                        action={
                                            t.tipo === 'ingreso'
                                                ? eliminarIngreso.bind(null, t.id)
                                                : eliminarGasto.bind(null, t.id)
                                        }
                                    >
                                        <button
                                            type="submit"
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
