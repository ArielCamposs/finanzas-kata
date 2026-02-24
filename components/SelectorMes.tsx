'use client'
import { useRouter } from 'next/navigation'
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const ANIOS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

interface Props {
    mesActual: number
    anioActual: number
}

export function SelectorMes({ mesActual, anioActual }: Props) {
    const router = useRouter()

    function navegar(mes: number, anio: number) {
        router.push(`/historial?mes=${mes}&anio=${anio}`)
    }

    function anterior() {
        if (mesActual === 1) navegar(12, anioActual - 1)
        else navegar(mesActual - 1, anioActual)
    }

    function siguiente() {
        if (mesActual === 12) navegar(1, anioActual + 1)
        else navegar(mesActual + 1, anioActual)
    }

    return (
        <Card className="rounded-2xl border border-border shadow-sm">
            <CardContent className="flex items-center gap-3 py-4">

                {/* Botón anterior */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={anterior}
                    className="rounded-xl shrink-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Selector de mes */}
                <Select
                    value={String(mesActual)}
                    onValueChange={(v) => navegar(Number(v), anioActual)}
                >
                    <SelectTrigger className="rounded-xl flex-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-border shadow-md">
                        {MESES.map((nombre, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                                {nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Selector de año */}
                <Select
                    value={String(anioActual)}
                    onValueChange={(v) => navegar(mesActual, Number(v))}
                >
                    <SelectTrigger className="rounded-xl w-28 shrink-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-border shadow-md">
                        {ANIOS.map((a) => (
                            <SelectItem key={a} value={String(a)}>
                                {a}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Botón siguiente */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={siguiente}
                    className="rounded-xl shrink-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

            </CardContent>
        </Card>
    )
}
