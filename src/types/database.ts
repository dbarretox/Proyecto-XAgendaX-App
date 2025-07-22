// Business: Los negocios/salones de belleza que usan la plataforma
// BusinessUser: Relación entre usuarios y negocios (dueños y empleados)
// Customer: Clientes que visitan el negocio
// Service: Servicios que ofrece el negocio (corte, manicure, etc)
// Appointment: Citas agendadas entre cliente-servicio-empleado
// Payment: Pagos realizados por las citas
// StaffService: Qué servicios puede realizar cada empleado

export interface Customer {
    id: string
    business_id: string
    name: string
    email?: string
    phone?: string
    notes?: string
    created_at: string
    updated_at: string
}

export interface Service {
    id: string
    business_id: string
    name: string
    description: string | null
    duration: number // en minutos
    price: number
    currency: 'USD' | 'COP' | 'PAB'
    category: string | null
    active: boolean
    created_at: string
    updated_at: string

}

export interface Business {
    id: string
    name: string
    email: string
    phone: string
    address: string
    default_currency: 'USD' | 'COP' | 'PAB'
    created_at: string
    updated_at: string
}

export interface BusinessUser {
    id: string
    business_id: string
    user_id: string
    role: 'owner' | 'admin' | 'staff'
    commission_rate: number
    is_active: boolean
    created_at: string
}

export interface Appointment {
    id: string
    business_id: string
    customer_id: string
    service_id: string
    staff_id: string | null
    start_time: string
    end_time: string
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    payment_status: 'pending' | 'paid' | 'partial' | 'cancelled'
    total_amount: number | null
    commission_rate: number | null
    commission_amount: number | null
    notes: string | null
    created_at: string
    updated_at: string
}

export interface Payment {
    id: string
    business_id: string
    appointment_id: string
    amount: number
    currency: 'USD' | 'COP' | 'PAB'
    method: 'cash' | 'transfer' | 'qr' | 'yappy'
    receipt_url: string | null
    created_at: string
}

export interface StaffService {
    id: string
    business_id: string
    staff_id: string
    service_id: string
    is_active: boolean
    created_at: string
}

// Tipos Auxiliares
export type BusinessInsert = Omit<Business, 'id' | 'created_at' | 'updated_at'>
export type BusinessUpdate = Partial<Omit<Business, 'id' | 'created_at' | 'updated_at'>>

export type BusinessUserInsert = Omit<BusinessUser, 'id' | 'created_at'>
export type BusinessUserUpdate = Partial<Omit<BusinessUser, 'id' | 'created_at' | 'business_id' | 'user_id'>>

export type CustomerInsert = Omit<Customer, 'id' | 'created_at' | 'updated_at'>
export type CustomerUpdate = Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'business_id'>>

export type ServiceInsert = Omit<Service, 'id' | 'created_at' | 'updated_at'>
export type ServiceUpdate = Partial<Omit<Service, 'id' | 'created_at' | 'updated_at' | 'business_id'>>

export type AppointmentInsert = Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'commission_amount'>
export type AppointmentUpdate = Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'business_id'>>

export type PaymentInsert = Omit<Payment, 'id' | 'created_at'>
export type PaymentUpdate = Partial<Omit<Payment, 'id' | 'created_at' | 'business_id' | 'appointment_id'>>

export type StaffServiceInsert = Omit<StaffService, 'id' | 'created_at'>
export type StaffServiceUpdate = Partial<Omit<StaffService, 'id' | 'created_at' | 'business_id' | 'staff_id' | 'service_id'>>