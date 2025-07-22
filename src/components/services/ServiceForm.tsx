'use client'

import { useState } from 'react'
import { Service, ServiceInsert, ServiceUpdate } from '@/types'
import { createService, updateService } from '@/lib/services'
import { X } from 'lucide-react'
import { Button } from '@/components/ui'

interface ServiceFormProps {
    service?: Service | null
    businessId: string
    onSuccess: () => void
    onCancel: () => void
}

export function ServiceForm({ 
    service, 
    businessId, 
    onSuccess, 
    onCancel 
}: ServiceFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: service?.name || '',
        description: service?.description || '',
        duration: service?.duration || 60,
        currency: (service?.currency || 'USD') as 'USD' | 'COP' | 'PAB',
        price: service?.price || 0,
        category: service?.category || '',
        active: service?.active ?? true
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (service) {
                // Modo edición
                const updates: ServiceUpdate = formData
                await updateService(service.id, updates)
            } else {
                // Modo creación
                const newService: ServiceInsert = {
                    ...formData,
                    business_id: businessId
                }
                await createService(newService)
            }

            onSuccess()
        } catch (error) {
            console.error('Error saving service:', error)
            alert('Error al guardar el servicio')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }))
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {service ? 'Editar Servicio' : 'Nuevo Servicio'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del servicio
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Corte de cabello"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe el servicio..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duración (minutos)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                min="15"
                                step="15"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio ($)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Cortes, Coloración, Tratamientos..."
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="active"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                            Servicio activo
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                        >
                            {service ? 'Guardar cambios' : 'Crear servicio'}
                        </Button>
                        <Button
                            type="button"
                            variant="light"
                            fullWidth
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                    </div>


                </form>
            </div>
        </div>
    )
}