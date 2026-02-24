import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORES = [
    'hsl(340 60% 65%)', 'hsl(152 35% 52%)', 'hsl(262 60% 65%)',
    'hsl(30 80% 60%)', 'hsl(200 70% 55%)', 'hsl(0 60% 65%)',
    'hsl(50 80% 55%)', 'hsl(180 50% 50%)',
]

interface Dato { categoria: string; total: number }

function formatCLP(n: number) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
    }).format(n)
}

function DonutChart({ datos, total }: { datos: Dato[]; total: number }) {
    const radio = 70
    const circunferencia = 2 * Math.PI * radio
    let offset = 0

    const segmentos = datos.map((d, i) => {
        const porcentaje = d.total / total
        const largo = porcentaje * circunferencia
        const segmento = { offset, largo, color: COLORES[i % COLORES.length] }
        offset += largo
        return segmento
    })

    return (
        <svg width={180} height={180} viewBox="0 0 180 180" className="mx-auto">
            <circle cx={90} cy={90} r={radio} fill="none"
                stroke="hsl(340 20% 93%)" strokeWidth={22} />
            {segmentos.map((s, i) => (
                <circle
                    key={i} cx={90} cy={90} r={radio}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={22}
                    strokeDasharray={`${s.largo} ${circunferencia - s.largo}`}
                    strokeDashoffset={-s.offset + circunferencia * 0.25}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
            ))}
            <text x={90} y={86} textAnchor="middle" fontSize={11}
                fill="hsl(340 10% 55%)">Total</text>
            <text x={90} y={102} textAnchor="middle" fontSize={12}
                fontWeight={600} fill="hsl(340 15% 15%)">
                {new Intl.NumberFormat('es-CL', {
                    notation: 'compact', maximumFractionDigits: 0
                }).format(total)}
            </text>
        </svg>
    )
}

export function GraficoCategorias({ datos }: { datos: Dato[] }) {
    const total = datos.reduce((s, d) => s + d.total, 0)

    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    🗂️ Gastos por Categoría
                </CardTitle>
            </CardHeader>
            <CardContent>
                {datos.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Sin gastos registrados este mes 🌸
                    </p>
                ) : (
                    <div className="flex flex-col gap-5">
                        <DonutChart datos={datos} total={total} />
                        <ul className="flex flex-col gap-2">
                            {datos.map((d, i) => (
                                <li key={d.categoria}
                                    className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5">
                                    <div className="flex items-center gap-3">
                                        <span className="h-3 w-3 rounded-full shrink-0"
                                            style={{ background: COLORES[i % COLORES.length] }} />
                                        <span className="text-sm">{d.categoria}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-muted-foreground">
                                            {Math.round((d.total / total) * 100)}%
                                        </span>
                                        <span className="text-sm font-semibold text-primary">
                                            {formatCLP(d.total)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
