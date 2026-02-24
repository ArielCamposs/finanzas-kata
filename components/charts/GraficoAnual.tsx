import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

interface DatoMes { mes: number; ingresos: number; gastos: number }

function formatCLP(n: number) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency', currency: 'CLP',
        maximumFractionDigits: 0, notation: 'compact',
    }).format(n)
}

export function GraficoAnual({ datos }: { datos: DatoMes[] }) {
    const maxValor = Math.max(...datos.flatMap(d => [d.ingresos, d.gastos]), 1)
    const altura = 180
    const anchoBarra = 14
    const espacio = 40

    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    Ingresos vs Gastos — {new Date().getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(152_35%_52%)]" />
                        Ingresos
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(340_60%_65%)]" />
                        Gastos
                    </span>
                </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <svg
                    width={datos.length * espacio + 40}
                    height={altura + 40}
                    className="min-w-full"
                >
                    {datos.map((d, i) => {
                        const x = i * espacio + 20
                        const hIngreso = (d.ingresos / maxValor) * altura
                        const hGasto = (d.gastos / maxValor) * altura

                        return (
                            <g key={d.mes}>
                                {/* Barra ingresos */}
                                <rect
                                    x={x}
                                    y={altura - hIngreso}
                                    width={anchoBarra}
                                    height={hIngreso}
                                    rx={4}
                                    fill="hsl(152 35% 52%)"
                                    opacity={0.85}
                                />
                                {/* Barra gastos */}
                                <rect
                                    x={x + anchoBarra + 2}
                                    y={altura - hGasto}
                                    width={anchoBarra}
                                    height={hGasto}
                                    rx={4}
                                    fill="hsl(340 60% 65%)"
                                    opacity={0.85}
                                />
                                {/* Etiqueta mes */}
                                <text
                                    x={x + anchoBarra}
                                    y={altura + 16}
                                    textAnchor="middle"
                                    fontSize={10}
                                    fill="hsl(340 10% 55%)"
                                >
                                    {MESES[d.mes - 1]}
                                </text>
                            </g>
                        )
                    })}
                    {/* Línea base */}
                    <line
                        x1={16} y1={altura}
                        x2={datos.length * espacio + 24} y2={altura}
                        stroke="hsl(340 20% 90%)"
                        strokeWidth={1}
                    />
                </svg>
            </CardContent>
        </Card>
    )
}
