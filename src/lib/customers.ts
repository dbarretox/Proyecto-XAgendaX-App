import { supabase } from './supabase'
import type { Customer, CustomerInsert, CustomerUpdate } from '@/types'

// Obtener todos los clientes del negocio
export async function getCustomers(businessId: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }
  return data || []
}

// Obtener clientes por ID
export async function getCustomerById(id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching customer:', error)
    return null
  }
  return data
}


// Crear cliente
export async function createCustomer(customer: CustomerInsert): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single()

  if (error) {
    console.error('Error creating customer:', error)
    return null
  }
  return data
}

// Actualizar cliente
export async function updateCustomer(
  id: string,
  updates: CustomerUpdate
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.log('Error updating customer:', error)
    return null
  }
  return data
}

// Elimimnar cliente
export async function deleteCustomer(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting service:', error)
    return false
  }
  return true
}