'use client'
import {
    PieChart, Pie, Cell, Tooltip,
    ResponsiveContainer, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORES = [
    'hsl(340 60% 65%)',
    'hsl(152 35% 52%)',
    'hsl(262 60% 65%)',
    'hsl(30 80% 60%)',
    'hsl(200 70% 55%)',
    'hsl(0 60% 65%)',
    'hsl(50 80% 55%)',
    'hsl(180 50% 50%)',
]

interface Props {
    datos: { categoria: string; total: number }[]
}

function formatCLP(n: number) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(n)
}

export function GraficoCategorias({ datos }: Props) {
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
                    <div className="flex flex-col gap-6">
                        {/* Gráfico torta */}
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={datos}
                                    dataKey="total"
                                    nameKey="categoria"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={3}
                                >
                                    {datos.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={COLORES[i % COLORES.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(v: any) => formatCLP(Number(v))}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: '1px solid hsl(340 20% 90%)',
                                        background: 'white',
                                        fontSize: '13px',
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px' }}
                                    formatter={(value) => value}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Lista detallada */}
                        <ul className="flex flex-col gap-2">
                            {datos.map((d, i) => (
                                <li
                                    key={d.categoria}
                                    className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="h-3 w-3 rounded-full shrink-0"
                                            style={{ background: COLORES[i % COLORES.length] }}
                                        />
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
