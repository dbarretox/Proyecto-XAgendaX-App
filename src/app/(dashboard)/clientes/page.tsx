'use client'

import { useEffect, useState } from 'react'
import { getCustomers, createCustomer, deleteCustomer, updateCustomer } from '@/lib/customers'
import type { Customer } from '@/types/database'
import { Plus, Trash2, Pencil } from 'lucide-react'
import CustomerForm from '@/components/customers/CustomerForm'
import { getCurrentUserBusinessId } from '@/lib/business'
import Button from '@/components/ui/Button'

export default function ClientesPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [businessId, setBusinessId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

    const loadCustomers = async () => {
        if (!businessId) return

        setLoading(true)
        setError(null)
        try {
            const data = await getCustomers(businessId)
            setCustomers(data)
        } catch (err: any) {
            setError(err.message)
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

    // Cargar clientes
    useEffect(() => {
        if (!businessId) return
        loadCustomers()
    }, [businessId])

    // Manejar creación de cliente
    const handleAddCustomer = async (formData: { name: string; email?: string; phone?: string; notes?: string }) => {
        setFormLoading(true)
        setFormError(null)
        try {
            await createCustomer({
                ...formData,
                business_id: businessId!  // businessId ya está validado arriba
            })
            setShowForm(false)
            await loadCustomers()
        } catch (err: any) {
            setFormError(err.message)
        } finally {
            setFormLoading(false)
        }
    }


    // Eliminar cliente
    const handleDeleteCustomer = async (id: string) => {
        if (!window.confirm('¿Seguro que deseas eliminar este cliente?')) return

        setDeleting(id)
        try {
            await deleteCustomer(id)
            await loadCustomers() // Usar loadCustomers en lugar de código duplicado
        } catch (err: any) {
            alert('Error al eliminar: ' + err.message)
        } finally {
            setDeleting(null)
        }
    }

    // Filtro lista antes del render
    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        (customer.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (customer.phone || '').includes(search)
    )

    return (
        <div className="p-6">
            {/* Header con titulo y boton */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
                {/* Barra de busqueda de lista */}
                <div className="space-x-5 flex justify-end">

                    <input
                        type="text"
                        className="w-full md:w-1/3 px-3 py-2 text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Buscar cliente por nombre, correo o teléfono"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => setShowForm(true)}
                    >

                        <Plus className="w-4 h-4" />
                        Agregar Cliente
                    </Button>
                </div>
            </div>





            {/* Cargando / error / lista */}
            {loading && <div className="py-4 text-gray-500 text-center">Cargando clientes...</div>}
            {error && <div className="text-red-500">Error: {error}</div>}
            {!loading && !error && (
                <ul className="divide-y divide-gray-200">
                    {filteredCustomers.length === 0 ? (
                        <li className="py-4 text-gray-500 text-center">
                            {search
                                ? 'No hay resultados para la búsqueda.'
                                : 'No hay clientes registrados.'}
                        </li>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <li key={customer.id} className="py-4 flex items-center justify-between text-gray-500">
                                <div className="font-medium text-gray-900 font-semibold">{customer.name}</div>
                                <div className="text-sm">{customer.email || 'Sin correo'}</div>
                                <div className="text-sm">{customer.phone}</div>

                                {/*Buton de editar */}
                                <button
                                    onClick={() => setEditingCustomer(customer)}
                                    className="ml-2 text-blue-500 hover:text-blue-700 p-2 rounded-full transition-colors"
                                    title="Editar cliente"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>

                                {/*Buton de eliminar */}
                                <button
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                    className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-full transition-colors disabled:opacity-60"
                                    title="Eliminar cliente"
                                    disabled={Boolean(deleting)}
                                >
                                    {deleting === customer.id ? (
                                        <svg className="animate-spin h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                </button>
                            </li>
                        ))
                    )}
                </ul>

            )}

            {/* Modal formulario */}
            {showForm && (
                <CustomerForm
                    businessId={businessId!}
                    onSubmit={handleAddCustomer}
                    onClose={() => setShowForm(false)}
                    loading={formLoading}
                    error={formError}
                />
            )}

            {editingCustomer && (
                <CustomerForm
                    businessId={businessId!}
                    onSubmit={async (formData) => {
                        setFormLoading(true)
                        setFormError(null)
                        try {
                            await updateCustomer(editingCustomer.id, formData)
                            setEditingCustomer(null)
                            await loadCustomers() // Usar loadCustomers en lugar de código duplicado
                        } catch (err: any) {
                            setFormError(err.message)
                        } finally {
                            setFormLoading(false)
                        }
                    }}
                    onClose={() => setEditingCustomer(null)}
                    loading={formLoading}
                    error={formError}
                    initialValues={{
                        name: editingCustomer.name,
                        email: editingCustomer.email || '',
                        phone: editingCustomer.phone || '',
                        notes: editingCustomer.notes || ''
                    }}
                />
            )}
        </div>
    )
}