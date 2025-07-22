'use client'

import { useEffect, useState } from 'react'
import type { Customer } from '@/types'
import { getCustomers, deleteCustomer } from '@/lib/customers'
import { getCurrentUserBusinessId } from '@/lib/business'
import { CustomerForm } from '@/components/customers/CustomerForm'
import Button from '@/components/ui/CustomButton'
import { Plus, Trash2, Pencil, Loader2Icon } from 'lucide-react'

export default function ClientesPage() {
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const loadCustomers = async () => {
    if (!businessId) return

    setLoading(true)
    try {
      const data = await getCustomers(businessId)
      setCustomers(data)
    } catch (error) {
      console.error('Error loading customers:', error)
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
      } catch (error) {
        console.error('Error al obtener empresa:', error)
      }
    }
    fetchBusinessId()
  }, [])

  // Cargar Clientes
  useEffect(() => {
    if (!businessId) return 
      loadCustomers()
  }, [businessId])

  // Manejo de Handles
  const handleCreate = () => {
    setSelectedCustomer(null)
    setShowForm(true)
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return
    try {
      await deleteCustomer(id)
      await loadCustomers()
    } catch (error) {
      alert('Error al eliminar el cliente')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedCustomer(null)
    loadCustomers()
  }

  if (!businessId || loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 space-x-1">
        <Loader2Icon className="animate-spin text-blue-600" />
        <p className="text-gray-500">Cargando clientes</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <Button
          variant="primary"
          size="md"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.email || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.phone || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="warningSmooth"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
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
        <CustomerForm
          businessId={businessId}
          customer={selectedCustomer}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false)
            setSelectedCustomer(null)
          }}
        />
      )}
    </div>
  )
}
