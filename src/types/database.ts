export interface Customer {
    id: string;
    business_id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Service{
    id: string;
    business_id: string;
    name: string;
    description: string | null;
    duration: number; // en minutos
    price: number;
    category: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;

}

export interface ServiceInsert {
    business_id: string;
    name: string;
    description?: string;
    duration: number;
    category?: string;
    active?: boolean;
}

export interface ServiceUpdate {
    name?: string;
    description?: string;
    duration?: number;
    price?: number;
    category?: string;
    active?: boolean;
}