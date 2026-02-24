'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    History,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Sparkles,
} from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Historial', href: '/historial', icon: History },
    { label: 'Análisis', href: '/analisis', icon: BarChart3 },
]

const accionItems = [
    { label: 'Nuevo Ingreso', href: '/dashboard?modal=ingreso', icon: TrendingUp },
    { label: 'Nuevo Gasto', href: '/dashboard?modal=gasto', icon: TrendingDown },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            {/* Logo */}
            <SidebarHeader className="border-b border-border px-4 py-5">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-foreground tracking-tight">
                        Mis Finanzas
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Navegación principal */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                        Menú
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        className={cn(
                                            'rounded-xl transition-all',
                                            pathname === item.href &&
                                            'bg-primary/10 text-primary font-medium'
                                        )}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Acciones rápidas */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                        Registrar
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accionItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        asChild
                                        className="rounded-xl"
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer del sidebar */}
            <SidebarFooter className="border-t border-border px-4 py-4">
                <p className="text-xs text-muted-foreground text-center">
                    ✨ Mis Finanzas Katita
                </p>
            </SidebarFooter>
        </Sidebar>
    )
}
