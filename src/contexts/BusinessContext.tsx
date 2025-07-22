'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from "@/lib/supabase"
import type { ReactNode } from 'react'

interface BusinessContextType {
    businessId: string | null
    businessName: string | null
    userRole: 'owner' | 'admin' | 'staff' | null
    userCommissionRate: number | null
    defaultCurrency: 'USD' | 'COP' | 'PAB' | null
    loading: boolean
    error: string | null
    refresh: () => Promise<void>
}

interface BusinessData {
    business_id: string
    role: 'owner' | 'admin' | 'staff'
    commission_rate: number
    businesses: {
        id: string
        name: string
        default_currency: 'USD' | 'COP' | 'PAB'
    }[]
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: ReactNode }) {
    const [businessId, setBusinessId] = useState<string | null>(null)
    const [businessName, setBusinessName] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<'owner' | 'admin' | 'staff' | null>(null)
    const [userCommissionRate, setUserCommissionRate] = useState<number | null>(null)
    const [defaultCurrency, setDefaultCurrency] = useState<'USD' | 'COP' | 'PAB' | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function loadBusinessData() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { data, error } = await supabase
                .from('business_users')
                .select(`
                    business_id,
                    role,
                    commission_rate,
                    businesses (
                    id,
                    name,
                    default_currency
                    )
                `)
                .eq('user_id', user.id)
                .single<BusinessData>()

            if (error) throw error
            if (!data || !data.businesses.length) throw new Error('No business found')

            const businessInfo = data.businesses[0]

            setBusinessId(data.business_id)
            setBusinessName(businessInfo?.name || null)
            setUserRole(data.role as 'owner' | 'admin' | 'staff')
            setUserCommissionRate(data.commission_rate || 0)
            setDefaultCurrency(businessInfo?.default_currency || 'USD')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadBusinessData()
    }, [])

    const refreshBusinessData = async () => {
        setLoading(true)
        setError(null)
        await loadBusinessData()
    }

    const value = {
        businessId,
        businessName,
        userRole,
        userCommissionRate,
        defaultCurrency,
        loading,
        error,
        refresh: refreshBusinessData
    }

    return (
        <BusinessContext.Provider value={value}>
            {children}
        </BusinessContext.Provider>
    )
}

export function useBusinessContext() {
    const context = useContext(BusinessContext)
    if (!context) throw new Error('useBusinessContext must be used within BusinessProvider')
    return context
}