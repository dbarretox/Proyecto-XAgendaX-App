// src/lib/customers.ts
import { supabase } from '@/lib/supabase'
import type { Customer } from '@/types/database'

export async function getCustomers(businessId: string): Promise<Customer[]> {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(error.message)
    } 
    return data as Customer[]
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }
    return data as Customer
}

export async function updateCustomer(id: string, updates: Partial<Omit<Customer, 'id' | 'business_id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }
    return data as Customer
}

export async function deleteCustomer(id:string) {
    const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }
}