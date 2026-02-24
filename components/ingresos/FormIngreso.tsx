'use client'
import { useState } from 'react'
import { agregarIngreso } from '../../lib/action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'

const categorias = ['Sueldo', 'Freelance', 'Arriendo', 'Inversión', 'Regalo', 'Otro']

export function FormIngreso() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const form = e.currentTarget
        const data = new FormData(form)

        await agregarIngreso({
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
                    <PlusCircle className="h-4 w-4 text-[hsl(var(--ingreso))]" />
                    Nuevo Ingreso
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="monto-i">Monto ($)</Label>
                            <Input
                                id="monto-i"
                                name="monto"
                                type="number"
                                placeholder="150000"
                                required
                                className="rounded-xl"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="fecha-i">Fecha</Label>
                            <Input
                                id="fecha-i"
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
                        <Label htmlFor="desc-i">Descripción (opcional)</Label>
                        <Input
                            id="desc-i"
                            name="descripcion"
                            placeholder="Ej: Sueldo febrero"
                            className="rounded-xl"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-[hsl(var(--ingreso))] hover:bg-[hsl(var(--ingreso))]/90 text-white"
                    >
                        {loading ? 'Guardando...' : 'Registrar Ingreso'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
