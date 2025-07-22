'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Calendar, AlertCircle } from 'lucide-react'
import { Button} from '@/components/ui/button'
import Buttons from '@/components/ui/CustomButton'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push('/')
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md">
                {/* Logo y titulo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
                        <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">XAgendaX</h1>
                    <p className="text-gray-500 mt-2">Gestión profesional de Citas</p>
                </div>
                {/* Tarjeta del formulario */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mx-4 sm:mx-0">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Mensaje de error */}
                        {error && (
                            <div className="flex items-start space-x-3 text-red-600 bg-red-50 p-4 rounded-lg">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        {/* Campo de email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                                               focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="tu@empresa.com"
                                />
                            </div>
                        </div>
                        {/* Campo de contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                                               focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="••••••••"

                                />
                            </div>
                        </div>
                        {/* Boton de submit */}
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                        >
                            Iniciar sesión
                        </Button>
                        {/*<Buttons
                            variant="primary"
                            type="submit"
                            size="md"
                            fullWidth
                            loading={loading}
                            disabled={loading}
                        >
                            Iniciar sesión
                        </Buttons> */}
                    </form>
                </div>
            </div >
        </div >
    )
}