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


type ButtonVariant = 'primary' | 'outline' | 'smooth' | 'warning' | 'warningSmooth' | 'light' | 'closeX'
type ButtonSize = 'sm' | 'md' | 'lg'