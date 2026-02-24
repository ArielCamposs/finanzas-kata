'use client'
import { useState } from 'react'
import { guardarPresupuestoSemanal } from '@/lib/action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'

interface Props {
    semana: number
    anio: number
    montoActual: number | null
}

export function PresupuestoForm({ semana, anio, montoActual }: Props) {
    const [loading, setLoading] = useState(false)
    const [editando, setEditando] = useState(!montoActual)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const form = e.currentTarget
        const data = new FormData(form)
        const monto = Number(data.get('monto'))
        await guardarPresupuestoSemanal(monto, semana, anio)
        setLoading(false)
        setEditando(false)
    }

    if (!editando && montoActual) {
        return (
            <Card className="rounded-2xl border border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4" style={{ color: 'var(--ingreso)' }} />
                        Presupuesto de esta semana
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Límite definido</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--ingreso)' }}>
                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(montoActual)}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setEditando(true)}
                    >
                        Cambiar
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4" style={{ color: 'var(--ingreso)' }} />
                    {montoActual ? 'Cambiar presupuesto' : 'Definir presupuesto semanal'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="monto-semana">¿Cuánto quiero gastar esta semana? ($)</Label>
                        <Input
                            id="monto-semana"
                            name="monto"
                            type="number"
                            placeholder="Ej: 80000"
                            defaultValue={montoActual ?? undefined}
                            required
                            className="rounded-xl"
                        />
                        <p className="text-xs text-muted-foreground">
                            Semana {semana} de {anio}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-xl text-white"
                            style={{ backgroundColor: 'var(--ingreso)' }}
                        >
                            {loading ? 'Guardando...' : 'Guardar presupuesto'}
                        </Button>
                        {montoActual && (
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => setEditando(false)}
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
