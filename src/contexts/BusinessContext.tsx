'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from "@/lib/supabase"
import type { ReactNode } from 'react'

interface BusinessContextType {
    businessId: string | null
    businessName: string | null
    userRole: 'owner' | 'employee' | null
    loading: boolean
    error: string | null
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: ReactNode }) {
    const [businessId, setBusinessId] = useState<string | null>(null)
    const [businessName, setBusinessName] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<'owner' | 'employee' | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        async function loadBusinessData() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new Error('No user')

                const { data, error } = await supabase
                    .from('business_users')
                    .select('business_id, role, businesses(id, name)')
                    .eq('user_id', user.id)
                    .single()

                if (error) throw error
                if (!data) throw new Error('No business found')

                setBusinessId(data.business_id)
                setBusinessName(data.businesses[0]?.name || null)
                setUserRole(data.role as 'owner' | 'employee')
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        loadBusinessData()
    }, [])

    return (
        <BusinessContext.Provider value={{ businessId, businessName, userRole, loading, error }}>
            {children}
        </BusinessContext.Provider>
    )
}

export function useBusinessContext() {
    const context = useContext(BusinessContext)
    if (!context) throw new Error('useBusinessContext must be used within BusinessProvider')
    return context
}