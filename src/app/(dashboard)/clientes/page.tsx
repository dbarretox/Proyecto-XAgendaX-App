import { Plus } from 'lucide-react'

export default function ClientesPage() {
    return (
        <div className="space-y-6">
            {/* Header con titulo y boton */}
            <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                <span>Agregar Cliente</span>
            </button>
        </div>
    )
}