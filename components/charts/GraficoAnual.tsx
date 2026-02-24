'use client'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MESES_CORTOS = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

interface DatoMes {
    mes: number
    ingresos: number
    gastos: number
}

function formatCLP(valor: number) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
        notation: 'compact',
    }).format(valor)
}

export function GraficoAnual({ datos }: { datos: DatoMes[] }) {
    const data = datos.map((d) => ({
        mes: MESES_CORTOS[d.mes - 1],
        Ingresos: d.ingresos,
        Gastos: d.gastos,
    }))

    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold">
                    Ingresos vs Gastos — Año {new Date().getFullYear()}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data} barCategoryGap="30%">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(340 20% 92%)" />
                        <XAxis
                            dataKey="mes"
                            tick={{ fontSize: 12, fill: 'hsl(340 10% 55%)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={formatCLP}
                            tick={{ fontSize: 11, fill: 'hsl(340 10% 55%)' }}
                            axisLine={false}
                            tickLine={false}
                            width={70}
                        />
                        <Tooltip
                            formatter={(value: any) => formatCLP(Number(value))}
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid hsl(340 20% 90%)',
                                background: 'white',
                                fontSize: '13px',
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
                        />
                        <Bar
                            dataKey="Ingresos"
                            fill="var(--ingreso)"
                            radius={[6, 6, 0, 0]}
                        />
                        <Bar
                            dataKey="Gastos"
                            fill="var(--primary)"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
