'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Calendar, Users, DollarSign, Clock, Menu, X, LogOut, Briefcase } from 'lucide-react'
import { Button } from "@/components/ui"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        //Obtener usuario actual
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            setLoading(false)
        })

        //Escuchar cambios de autenticacion
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        // Cleanup: cancelar la suscripcion cuando el componente se desmonte
        return () => subscription.unsubscribe()
    }, [])

    // Si está cargando → mostrar "Cargando..."
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <p>Cargando...</p>
        </div>
    }
    // Si no hay usuario → redirigir a login
    if (!user) {
        window.location.href = '/login'
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Overlay para movil */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform
                      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      transition-transform duration-300 ease-in-out
                      lg:relative lg:translate-x-0 flex-shrink-0`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">XAgendaX</span>
                    </div>
                    <Button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Menu de navegacion */}
                <nav className="p-4 space-y-1">
                    <Link
                        href="/dashboard" 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                            pathname === '/dashboard'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                        href="/clientes" 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                            pathname === '/clientes'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Users className={`w-5 h-5 ${pathname === '/clientes' ? '' : 'text-gray-400'}`} />
                        <span>Clientes</span>
                    </Link>

                    <Link
                        href="/servicios" 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                            pathname === '/servicios'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Briefcase className={`w-5 h-5 ${pathname === '/servicios' ? '' : 'text-gray-400'}`} />
                        <span>Servicios</span>
                    </Link>

                    <Link
                        href="/citas" 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                            pathname === '/citas'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Clock className={`w-5 h-5 ${pathname === '/citas' ? '' : 'text-gray-400'}`} />
                        <span>Citas</span>
                    </Link>

                    <Link
                        href="/finanzas" 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                            pathname === '/finanzas'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <DollarSign className={`w-5 h-5 ${pathname === '/finanzas' ? '' : 'text-gray-400'}`} />
                        <span>Finanzas</span>
                    </Link>
                 </nav>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 sm:px-6 h-16">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5 text-gray-500" />
                        </button>

                        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
                            <button
                                onClick={() => supabase.auth.signOut()}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:block">Salir</span>
                            </button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}