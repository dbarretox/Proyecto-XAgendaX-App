import { supabase } from './supabase'
import { Service, ServiceInsert, ServiceUpdate } from '@/types/database'

// Crear servicio
export async function createService(service: ServiceInsert): Promise<Service | null> {
    const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single()

    if (error) {
        console.error('Error creating service:', error)
        return null
    }
    return data
}

// Obtener todos los servicios del negocio
export async function getServices(businessId: string): Promise<Service[]> {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .order('name', { ascending: true })
    
    if (error) {
        console.error('Error fetching services:', error)
        return []
    }
    return data || []
}

// Obtener servicios por ID
export async function getServiceById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching service:', error)
        return null
    }
    return data
}

// Actualizar servicio
export async function updateService(
    id: string,
    updates: ServiceUpdate
): Promise<Service | null> {
    const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.log('Error updating service:', error)
        return null
    }
    return data
}

// Elimimnar servicio
export async function deleteService(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting service:', error)
        return false
    }
    return true
}