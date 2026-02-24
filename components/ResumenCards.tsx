import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'

interface Props {
    totalIngresos: number
    totalGastos: number
}

function formatCLP(monto: number) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(monto)
}

export function ResumenCards({ totalIngresos, totalGastos }: Props) {
    const balance = totalIngresos - totalGastos
    const porcentajeGasto =
        totalIngresos > 0 ? Math.round((totalGastos / totalIngresos) * 100) : 0
    const ahorro = totalIngresos > 0 ? totalIngresos * 0.2 : 0

    const cards = [
        {
            titulo: 'Ingresos del Mes',
            valor: formatCLP(totalIngresos),
            icono: TrendingUp,
            color: 'text-[var(--ingreso)]',
            bg: 'bg-[var(--ingreso)]/10',
            sub: 'Total recibido este mes',
        },
        {
            titulo: 'Gastos del Mes',
            valor: formatCLP(totalGastos),
            icono: TrendingDown,
            color: 'text-primary',
            bg: 'bg-primary/10',
            sub: `${porcentajeGasto}% de tus ingresos`,
        },
        {
            titulo: 'Balance',
            valor: formatCLP(balance),
            icono: Wallet,
            color: balance >= 0 ? 'text-[var(--ingreso)]' : 'text-destructive',
            bg: balance >= 0 ? 'bg-[var(--ingreso)]/10' : 'bg-destructive/10',
            sub: balance >= 0 ? 'Vas bien 🌸' : 'Cuidado con los gastos',
        },
        {
            titulo: 'Meta de Ahorro',
            valor: formatCLP(ahorro),
            icono: PiggyBank,
            color: 'text-primary',
            bg: 'bg-primary/10',
            sub: '20% recomendado del ingreso',
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <Card
                    key={card.titulo}
                    className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-2xl"
                >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.titulo}
                        </CardTitle>
                        <div className={`p-2 rounded-xl ${card.bg}`}>
                            <card.icono className={`h-4 w-4 ${card.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-semibold ${card.color}`}>
                            {card.valor}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
