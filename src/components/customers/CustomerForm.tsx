import { useState, useEffect } from 'react'
import { Mail, Phone, User, StickyNote, AlertCircle, X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface CustomerFormProps {
    onSubmit: (data: {
        name: string
        email?: string
        phone?: string
        notes?: string
    }) => void
    onClose: () => void
    loading?: boolean
    error?: string | null
    initialValues?: {
        name: string
        email?: string
        phone?: string
        notes?: string
    }
}

export default function CustomerForm({
    onSubmit,
    onClose,
    loading = false,
    error = null,
    initialValues
}: CustomerFormProps) {
    const [name, setName] = useState(initialValues?.name || '')
    const [email, setEmail] = useState(initialValues?.email || '')
    const [phone, setPhone] = useState(initialValues?.phone || '')
    const [notes, setNotes] = useState(initialValues?.notes || '')

    const hasUnsavedChanges =
        name !== (initialValues?.name || '') ||
        email !== (initialValues?.email || '') ||
        phone !== (initialValues?.phone || '') ||
        notes !== (initialValues?.notes || '')

    const handleClose = () => {
        if (hasUnsavedChanges) {
            if(!window.confirm('Tienes cambios sin guardar, ¿seguro que quieres salir?')) return
        }
        onClose()
    }

    useEffect(() => {
        setName(initialValues?.name || '')
        setEmail(initialValues?.email || '')
        setPhone(initialValues?.phone || '')
        setNotes(initialValues?.notes || '')
    }, [initialValues])

    // Cerrar con ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 bg-gray-800/70 flex items-center justify-center"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mx-4 sm:mx-0">
                    <form
                        onSubmit={e => {
                            e.preventDefault()
                            onSubmit({ name, email, phone, notes })
                        }}
                        className="space-y-6"
                    >
                        {/* Mensaje de error */}
                        {error && (
                            <div className="flex items-start space-x-3 text-red-600 bg-red-50 p-4 rounded-lg">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{initialValues ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
                        <Button
                                variant="closeX"
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className=""
                            >
                                <X className="w-5 h-5" />
                            </Button>
                            </div>
                        {/* Nombre */}{/* Nombre */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Nombre del cliente"
                                />
                            </div>
                        </div>
                        {/* Email */}
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
                                    onChange={e => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="correo@cliente.com"
                                />
                            </div>
                        </div>
                        {/* Teléfono */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="phone"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Ej: 6611-2233"
                                />
                            </div>
                        </div>
                        {/* Notas */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                Notas
                            </label>
                            <div className="relative">
                                <div className="absolute top-2 left-0 pl-3 flex items-center pointer-events-none">
                                    <StickyNote className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Notas adicionales"
                                    rows={2}
                                />
                            </div>
                        </div>
                        {/* Acciones */}
                        <div className="grid gap-2 mt-4">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}