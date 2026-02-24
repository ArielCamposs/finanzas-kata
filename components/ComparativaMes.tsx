import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
    totalIngresos: number
    totalGastos: number
    ingresosAnterior: number
    gastosAnterior: number
}

function formatCLP(n: number) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(n)
}

function Variacion({ actual, anterior, label, invertir = false }: {
    actual: number
    anterior: number
    label: string
    invertir?: boolean
}) {
    const diff = actual - anterior
    const pct = anterior > 0 ? Math.abs(Math.round((diff / anterior) * 100)) : null
    const subio = diff > 0
    const igual = diff === 0

    // Si invertir=true (gastos), subir es malo
    const esPositivo = invertir ? !subio : subio

    const Icon = igual ? Minus : subio ? TrendingUp : TrendingDown
    const color = igual
        ? 'text-muted-foreground'
        : esPositivo
            ? 'text-[var(--ingreso)]'
            : 'text-destructive'
    const bg = igual
        ? 'bg-muted'
        : esPositivo
            ? 'bg-[var(--ingreso)]/10'
            : 'bg-destructive/10'

    return (
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">
                    Mes anterior: {formatCLP(anterior)}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatCLP(actual)}</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${bg}`}>
                    <Icon className={`h-3 w-3 ${color}`} />
                    <span className={`text-xs font-medium ${color}`}>
                        {igual ? '=' : pct !== null ? `${pct}%` : 'Nuevo'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function ComparativaMes({ totalIngresos, totalGastos, ingresosAnterior, gastosAnterior }: Props) {
    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    📈 vs Mes Anterior
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Variacion
                    label="Ingresos"
                    actual={totalIngresos}
                    anterior={ingresosAnterior}
                />
                <Variacion
                    label="Gastos"
                    actual={totalGastos}
                    anterior={gastosAnterior}
                    invertir
                />
                <Variacion
                    label="Balance"
                    actual={totalIngresos - totalGastos}
                    anterior={ingresosAnterior - gastosAnterior}
                />
            </CardContent>
        </Card>
    )
}
