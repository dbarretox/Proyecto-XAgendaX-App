- Migration: 006_enable_rls_updated.sql
-- Primero, eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view their own business" ON businesses;
DROP POLICY IF EXISTS "Only Owners can update business" ON businesses;
DROP POLICY IF EXISTS "Users can view business users" ON business_users;
DROP POLICY IF EXISTS "Owners can insert business users" ON business_users;
DROP POLICY IF EXISTS "Users can view customers" ON customers;
DROP POLICY IF EXISTS "Users can insert customers" ON customers;
DROP POLICY IF EXISTS "Users can update customers" ON customers;
DROP POLICY IF EXISTS "Users can view services" ON services;
DROP POLICY IF EXISTS "Owners can insert services" ON services;
DROP POLICY IF EXISTS "Owners can update services" ON services;
DROP POLICY IF EXISTS "Users can view appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create their first business" ON businesses;

-- Habilitar RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Función helper mejorada
CREATE OR REPLACE FUNCTION public.get_user_business_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    v_business_id UUID;
BEGIN
    SELECT business_id INTO v_business_id
    FROM public.business_users
    WHERE user_id = auth.uid()
    LIMIT 1;
    
    RETURN v_business_id;
END;
$$;

-- Función para verificar si el usuario es owner
CREATE OR REPLACE FUNCTION public.is_business_owner()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.business_users
        WHERE user_id = auth.uid()
        AND role = 'owner'
    );
END;
$$;

-- Grant permisos
GRANT EXECUTE ON FUNCTION public.get_user_business_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_business_owner() TO authenticated;

-- =====================================================
-- POLÍTICAS PARA BUSINESSES
-- =====================================================

-- Ver negocio propio
CREATE POLICY "Users can view their own business"
ON businesses FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM business_users
        WHERE business_users.business_id = businesses.id
        AND business_users.user_id = auth.uid()
    )
);

-- Actualizar solo si es owner
CREATE POLICY "Owners can update business"
ON businesses FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM business_users
        WHERE business_users.business_id = businesses.id
        AND business_users.user_id = auth.uid()
        AND business_users.role = 'owner'
    )
);

-- Crear primer negocio
CREATE POLICY "Users can create their first business"
ON businesses FOR INSERT
WITH CHECK (
    NOT EXISTS (
        SELECT 1 FROM business_users
        WHERE user_id = auth.uid()
    )
);

-- =====================================================
-- POLÍTICAS PARA BUSINESS_USERS
-- =====================================================

CREATE POLICY "Users can view business users"
ON business_users FOR SELECT
USING (business_id = public.get_user_business_id());

CREATE POLICY "Owners can manage business users"
ON business_users FOR INSERT
WITH CHECK (
    public.is_business_owner() 
    AND business_id = public.get_user_business_id()
);

-- =====================================================
-- POLÍTICAS PARA CUSTOMERS
-- =====================================================

CREATE POLICY "Users can view customers"
ON customers FOR SELECT
USING (business_id = public.get_user_business_id());

CREATE POLICY "Users can create customers"
ON customers FOR INSERT
WITH CHECK (
    business_id = public.get_user_business_id()
    AND business_id IS NOT NULL
);

CREATE POLICY "Users can update customers"
ON customers FOR UPDATE
USING (business_id = public.get_user_business_id())
WITH CHECK (business_id = public.get_user_business_id());

-- =====================================================
-- POLÍTICAS PARA SERVICES
-- =====================================================

CREATE POLICY "Users can view services"
ON services FOR SELECT
USING (business_id = public.get_user_business_id());

CREATE POLICY "Owners can create services"
ON services FOR INSERT
WITH CHECK (
    public.is_business_owner()
    AND business_id = public.get_user_business_id()
    AND business_id IS NOT NULL
);

CREATE POLICY "Owners can update services"
ON services FOR UPDATE
USING (
    public.is_business_owner()
    AND business_id = public.get_user_business_id()
);

-- =====================================================
-- POLÍTICAS PARA APPOINTMENTS
-- =====================================================

CREATE POLICY "Users can view appointments"
ON appointments FOR SELECT
USING (business_id = public.get_user_business_id());

CREATE POLICY "Users can create appointments"
ON appointments FOR INSERT
WITH CHECK (
    business_id = public.get_user_business_id()
    AND business_id IS NOT NULL
);

CREATE POLICY "Users can update appointments"
ON appointments FOR UPDATE
USING (business_id = public.get_user_business_id())
WITH CHECK (business_id = public.get_user_business_id());

CREATE POLICY "Users can delete appointments"
ON appointments FOR DELETE
USING (business_id = public.get_user_business_id());

-- =====================================================
-- TRIGGER AUTOMÁTICO PARA CREAR OWNER
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_business()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Crear registro de owner automáticamente
    INSERT INTO public.business_users (business_id, user_id, role)
    VALUES (NEW.id, auth.uid(), 'owner');
    
    RETURN NEW;
END;
$$;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS on_business_created ON businesses;

-- Crear trigger
CREATE TRIGGER on_business_created
    AFTER INSERT ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_business();

-- =====================================================
-- FUNCIONES DE UTILIDAD PARA DEBUGGING
-- =====================================================

CREATE OR REPLACE FUNCTION public.debug_user_access()
RETURNS TABLE(
    current_user_id UUID,
    user_email TEXT,
    business_id UUID,
    business_name TEXT,
    user_role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        auth.uid() as current_user_id,
        auth.jwt() ->> 'email' as user_email,
        bu.business_id,
        b.name as business_name,
        bu.role as user_role
    FROM business_users bu
    LEFT JOIN businesses b ON b.id = bu.business_id
    WHERE bu.user_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.debug_user_access() TO authenticated;

-- Versión corregida de la función debug_user_access
CREATE OR REPLACE FUNCTION public.debug_user_access()
RETURNS TABLE(
    current_user_id UUID,
    user_email TEXT,
    business_id UUID,
    business_name TEXT,
    user_role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        auth.uid() as current_user_id,
        (auth.jwt() ->> 'email')::TEXT as user_email,  -- Conversión explícita a TEXT
        bu.business_id,
        b.name as business_name,
        bu.role as user_role
    FROM business_users bu
    LEFT JOIN businesses b ON b.id = bu.business_id
    WHERE bu.user_id = auth.uid();
END;
$$;