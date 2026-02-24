import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { eliminarGasto } from '@/lib/action'
import { Trash2, Receipt } from 'lucide-react'

interface Gasto {
    id: string
    monto: number
    descripcion: string | null
    categoria: string
    fecha: string
}

interface Props {
    gastos: Gasto[]
}

function formatCLP(n: number) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)
}

export function GastosSemanales({ gastos }: Props) {
    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    Gastos de esta semana
                    <Badge variant="secondary" className="ml-auto text-xs font-normal">
                        {gastos.length} {gastos.length === 1 ? 'gasto' : 'gastos'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {gastos.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-8">
                        Sin gastos esta semana 🌸
                    </p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {gastos.map((g) => (
                            <li
                                key={g.id}
                                className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <Badge
                                        variant="secondary"
                                        className="bg-primary/15 text-primary shrink-0"
                                    >
                                        -
                                    </Badge>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {g.descripcion || g.categoria}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {g.categoria} · {new Date(g.fecha).toLocaleDateString('es-CL', {
                                                weekday: 'short', day: 'numeric', month: 'short'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-sm font-semibold text-primary">
                                        -{formatCLP(g.monto)}
                                    </span>
                                    <form action={eliminarGasto.bind(null, g.id)}>
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
