'use client'

import { useEffect, useState } from 'react'
import { getCustomers, createCustomer, deleteCustomer, updateCustomer } from '@/lib/customers'
import type { Customer } from '@/types/database'
import { Plus, Trash2, Pencil } from 'lucide-react'
import CustomerForm from '@/components/customers/CustomerForm'
import { getCurrentUserBusinessId } from '@/lib/business'

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

    //Cargar BusinessId
    useEffect(() => {
        async function fetchBusinessId() {
            try {
                const userBusinessId = await getCurrentUserBusinessId()
                setBusinessId(userBusinessId)
            } catch (err: any) {
                setError(err.message)
            }
        }
        fetchBusinessId()
    }, [])

    // Cargar clientes
    useEffect(() => {
        if (!businessId) return
        
        async function fetchCustomers() {
            setLoading(true)
            try {
                const data = await getCustomers(businessId!)
                setCustomers(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCustomers()
    }, [businessId])

    // Manejar creación de cliente
    const handleAddCustomer = async (formData: { name: string; email?: string; phone?: string; notes?: string }) => {
        if (!businessId) return
        
        setFormLoading(true)
        setFormError(null)
        try {
            await createCustomer({
                ...formData,
                business_id: businessId,
            })
            setShowForm(false)
            // Refrescar lista
            const data = await getCustomers(businessId)
            setCustomers(data)
        } catch (err: any) {
            setFormError(err.message)
        } finally {
            setFormLoading(false)
        }
    }

    // Eliminar cliente
    const handleDeleteCustomer = async (id: string) => {
        if (!businessId) return
        
        if (!window.confirm('¿Seguro que deseas eliminar este cliente?')) return
        setDeleting(id)
        try {
            await deleteCustomer(id)
            const data = await getCustomers(businessId)
            setCustomers(data)
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
        <div className="space-y-6">
            {/* Header con titulo y boton */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                    onClick={() => setShowForm(true)}
                >

                    <Plus className="w-4 h-4" />
                    <span>Agregar Cliente</span>
                </button>
            </div>

            {/* Barra de busqueda de lista */}
            <div>
                <input
                    type="text"
                    className="w-full md:w-1/3 px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
                    placeholder="Buscar cliente por nombre, correo o teléfono"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
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
                    onSubmit={handleAddCustomer}
                    onClose={() => setShowForm(false)}
                    loading={formLoading}
                    error={formError}
                />
            )}

            {editingCustomer && (
                <CustomerForm
                    onSubmit={async (formData) => {
                        if (!businessId) return
                        
                        setFormLoading(true)
                        setFormError(null)
                        try {
                            await updateCustomer(editingCustomer.id, formData)
                            setEditingCustomer(null)
                            const data = await getCustomers(businessId!)
                            setCustomers(data)
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