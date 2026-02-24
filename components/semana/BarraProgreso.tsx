import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

interface Props {
    gastado: number
    limite: number | null
    diasRestantes: number
}

function formatCLP(n: number) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)
}

export function BarraProgreso({ gastado, limite, diasRestantes }: Props) {
    if (!limite) {
        return (
            <Card className="rounded-2xl border border-border shadow-sm">
                <CardContent className="pt-6 pb-5 text-center">
                    <p className="text-muted-foreground text-sm">
                        Aún no definiste un presupuesto para esta semana 🌸
                    </p>
                </CardContent>
            </Card>
        )
    }

    const porcentaje = Math.min((gastado / limite) * 100, 100)
    const restante = limite - gastado
    const promedioDiarioPermitido = diasRestantes > 0 ? restante / diasRestantes : 0
    const promedioDiarioGastado = gastado / Math.max(1, 7 - diasRestantes)

    const color =
        porcentaje >= 90 ? '#dc2626' :
            porcentaje >= 70 ? '#f59e0b' :
                'var(--ingreso)'

    const estado =
        porcentaje >= 100 ? { label: 'Presupuesto agotado', icon: AlertTriangle, color: '#dc2626' } :
            porcentaje >= 70 ? { label: 'Casi en el límite', icon: TrendingUp, color: '#f59e0b' } :
                { label: 'Dentro del presupuesto', icon: CheckCircle2, color: 'var(--ingreso)' }

    const IconoEstado = estado.icon

    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <IconoEstado className="h-4 w-4" style={{ color: estado.color }} />
                    {estado.label}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {/* Barra de progreso */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{formatCLP(gastado)} gastados</span>
                        <span className="text-muted-foreground">de {formatCLP(limite)}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${porcentaje}%`, backgroundColor: color }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 text-right">
                        {porcentaje.toFixed(0)}% usado
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-muted/60 p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Disponible</p>
                        <p className="font-semibold text-sm" style={{ color: restante >= 0 ? 'var(--ingreso)' : '#dc2626' }}>
                            {restante >= 0 ? formatCLP(restante) : `-${formatCLP(Math.abs(restante))}`}
                        </p>
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3" /> Días
                        </p>
                        <p className="font-semibold text-sm">{diasRestantes} restantes</p>
                    </div>
                    <div className="rounded-xl bg-muted/60 p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Promedio/día</p>
                        <p className="font-semibold text-sm">
                            {diasRestantes > 0 ? formatCLP(promedioDiarioPermitido) : '—'}
                        </p>
                    </div>
                </div>

                {/* Alerta de gasto diario alto */}
                {promedioDiarioGastado > promedioDiarioPermitido && diasRestantes > 0 && (
                    <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
                        <TrendingDown className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-700">
                            Tu promedio diario actual es <strong>{formatCLP(promedioDiarioGastado)}</strong>, superior al permitido de <strong>{formatCLP(promedioDiarioPermitido)}</strong> para los {diasRestantes} días restantes.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
