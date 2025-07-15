import { Clock, Users, DollarSign, Calendar } from 'lucide-react'

export default function DashboardPage() {
  return (
    <>
      {/* Cards de metricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card: Citas de hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Citas Hoy</h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">12</p>
          <p className="text-xs text-gray-500 mt-1">3 confirmadas</p>
        </div>
        {/* Mas cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Clientes</h3>
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">148</p>
          <p className="text-xs text-gray-500 mt-1">+5 este mes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Ingresos Hoy</h3>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">$425</p>
          <p className="text-xs text-gray-500 mt-1">6 servicios</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Tasa Ocupación</h3>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">78%</p>
          <p className="text-xs text-gray-500 mt-1">Esta semana</p>
        </div>
      </div>
    </>
  )
}