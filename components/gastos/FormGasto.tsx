'use client'
import { useState } from 'react'
import { agregarGasto } from '../../lib/action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MinusCircle } from 'lucide-react'

const categorias = [
    'Arriendo', 'Supermercado', 'Transporte', 'Salud',
    'Belleza', 'Ropa', 'Entretenimiento', 'Educación',
    'Servicios', 'Restaurantes', 'Otro',
]

export function FormGasto() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const form = e.currentTarget
        const data = new FormData(form)

        await agregarGasto({
            monto: Number(data.get('monto')),
            descripcion: data.get('descripcion') as string,
            categoria: data.get('categoria') as string,
            fecha: data.get('fecha') as string,
        })

        form.reset()
        setLoading(false)
    }

    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MinusCircle className="h-4 w-4 text-primary" />
                    Nuevo Gasto
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="monto-g">Monto ($)</Label>
                            <Input
                                id="monto-g"
                                name="monto"
                                type="number"
                                placeholder="25000"
                                required
                                className="rounded-xl"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="fecha-g">Fecha</Label>
                            <Input
                                id="fecha-g"
                                name="fecha"
                                type="date"
                                required
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Categoría</Label>
                        <Select name="categoria" required>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-border shadow-md">
                                {categorias.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="desc-g">Descripción (opcional)</Label>
                        <Input
                            id="desc-g"
                            name="descripcion"
                            placeholder="Ej: Supermercado Líder"
                            className="rounded-xl"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-primary hover:bg-primary/90 text-white"
                    >
                        {loading ? 'Guardando...' : 'Registrar Gasto'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
