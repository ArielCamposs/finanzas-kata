import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />

                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Header */}
                    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
                        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                        <div className="flex-1" />
                        <span className="text-sm text-muted-foreground font-medium capitalize">
                            {new Date().toLocaleDateString('es-CL', {
                                month: 'long',
                                year: 'numeric',
                            })}
                        </span>
                    </header>

                    {/* Contenido */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

