import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
    totalIngresos: number
    totalGastos: number
}

function formatCLP(n: number) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(n)
}

export function Regla502030({ totalIngresos, totalGastos }: Props) {
    const reglas = [
        {
            label: 'Necesidades',
            descripcion: 'Arriendo, comida, transporte, salud',
            porcentaje: 50,
            limite: totalIngresos * 0.5,
            color: 'bg-rose-300',
            textColor: 'text-rose-500',
        },
        {
            label: 'Deseos',
            descripcion: 'Ropa, entretenimiento, restaurantes',
            porcentaje: 30,
            limite: totalIngresos * 0.3,
            color: 'bg-[var(--ingreso)]',
            textColor: 'text-[var(--ingreso)]',
        },
        {
            label: 'Ahorro',
            descripcion: 'Fondo de emergencia, metas, inversión',
            porcentaje: 20,
            limite: totalIngresos * 0.2,
            color: 'bg-violet-300',
            textColor: 'text-violet-500',
        },
    ]

    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    💡 Regla 50/30/20
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Distribución recomendada basada en tus ingresos del mes
                </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {totalIngresos === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Registra un ingreso para ver tu distribución 🌸
                    </p>
                ) : (
                    reglas.map((r) => {
                        const progreso = Math.min((totalGastos / r.limite) * 100, 100)
                        const excede = totalGastos > r.limite

                        return (
                            <div key={r.label} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-medium">{r.label}</span>
                                        <p className="text-xs text-muted-foreground">{r.descripcion}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-semibold ${r.textColor}`}>
                                            {r.porcentaje}%
                                        </span>
                                        {excede && (
                                            <Badge variant="destructive" className="text-xs px-2 py-0.5">
                                                Excedido
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Barra de progreso */}
                                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${excede ? 'bg-destructive' : r.color
                                            }`}
                                        style={{ width: `${progreso}%` }}
                                    />
                                </div>

                                {/* Montos */}
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Límite: {formatCLP(r.limite)}</span>
                                    <span>Disponible: {formatCLP(Math.max(r.limite - totalGastos, 0))}</span>
                                </div>
                            </div>
                        )
                    })
                )}
            </CardContent>
        </Card>
    )
}
