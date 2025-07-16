'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types'
import { getServices, deleteService } from '@/lib/services'
import { getCurrentUserBusinessId } from '@/lib/business'
import { ServiceForm } from '@/components/services/ServiceForm'
import Button from '@/components/ui/Button'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function ServicesPage() {
    const [businessId, setBusinessId] = useState<string | null>(null)
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selectedService, setSelectedService] = useState<Service | null>(null)

    const loadServices = async () => {
        if (!businessId) return
        
        setLoading(true)
        try {
            const data = await getServices(businessId)
            setServices(data)
        } catch (error) {
            console.error('Error loading services:', error)
        } finally {
            setLoading(false)
        }
    }

    // Cargar BusinessId
    useEffect(() => {
        async function fetchBusinessId() {
            try {
                const userBusinessId = await getCurrentUserBusinessId()
                setBusinessId(userBusinessId)
            } catch (err: any) {
                console.error('Error loading business:', err.message)
            }
        }
        fetchBusinessId()
    }, [])

    // Cargar servicios
    useEffect(() => {
        if (!businessId) return
        loadServices()
    }, [businessId])

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return

        const success = await deleteService(id)
        if (success) {
            loadServices()
        } else {
            alert('Error al eliminar el servicio')
        }
    }


    const handleEdit = (service: Service) => {
        setSelectedService(service)
        setShowForm(true)
    }

    const handleCreate = () => {
        setSelectedService(null)
        setShowForm(true)
    }

    const handleFormSuccess = () => {
        setShowForm(false)
        setSelectedService(null)
        loadServices()
    }


    if (!businessId) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Cargando servicios...</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Servicios</h1>
                <Button
                    variant="primary"
                    size="md"
                    onClick={handleCreate}
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Servicio
                </Button>
            </div>    

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Servicio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duración
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="relative px-6 py-3">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No hay servicios registrados
                                </td>
                            </tr>
                        ) : (
                            services.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                            {service.category && (
                                                <div className="text-sm text-gray-500">{service.category}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {service.duration} min
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${service.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            service.active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {service.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="light"
                                                size="sm"
                                                onClick={() => handleEdit(service)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="warningSmooth"
                                                size="sm"
                                                onClick={() => handleDelete(service.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {showForm && (
                <ServiceForm
                    service={selectedService}
                    businessId={businessId}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                        setShowForm(false)
                        setSelectedService(null)
                    }}
                />
            )}
        </div>
    )
}

