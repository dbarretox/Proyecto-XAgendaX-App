import { supabase } from '@/lib/supabase'

export async function getCurrentUserBusinessId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
        .from('business_users')
        .select('business_id')
        .eq('user_id', user.id)
        .single()

    if (error) {
        throw new Error(`Error obteniendo business_id: ${error.message}`)
    }

    return data.business_id
}