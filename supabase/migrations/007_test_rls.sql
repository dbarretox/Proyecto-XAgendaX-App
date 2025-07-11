-- Migration: 007_test_rls.sql
-- Script para probar las políticas RLS

-- 1. Crear usuario de prueba (esto normalmente lo hace Supabase Auth)
-- Simulamos con una función que cambia el contexto
CREATE OR REPLACE FUNCTION test_rls_as_user(test_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Configurar el user_id para esta sesión
  PERFORM set_config('request.jwt.claim.sub', test_user_id::text, true);
END;
$$ LANGUAGE plpgsql;

-- 2. Insertar datos de prueba
BEGIN;

-- Crear dos negocios de prueba
INSERT INTO businesses (id, name, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Barbería Juan', 'juan@test.com'),
  ('22222222-2222-2222-2222-222222222222', 'Salón María', 'maria@test.com');

-- Crear usuarios de prueba (IDs ficticios)
INSERT INTO business_users (business_id, user_id, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'b7d745d4-90e5-4680-89fc-3c93d9ba26c8', 'owner'),
  ('11111111-1111-1111-1111-111111111111', '4317407e-d136-4cb1-bf8d-d731231222f3', 'employee'),
  ('22222222-2222-2222-2222-222222222222', 'b4de9068-eb55-4a49-8c31-fc57d30cb359', 'owner');

COMMIT;

-- 3. Probar políticas SELECT
-- Test como Juan (owner de Barbería)
SELECT test_rls_as_user('b7d745d4-90e5-4680-89fc-3c93d9ba26c8');

-- Debería ver solo su negocio
SELECT name FROM businesses;
-- Esperado: Solo 'Barbería Juan'

-- Test como empleado de Juan  
SELECT test_rls_as_user('4317407e-d136-4cb1-bf8d-d731231222f3');

-- También debería ver el negocio
SELECT name FROM businesses;
-- Esperado: Solo 'Barbería Juan'

-- Test como María (owner de Salón)
SELECT test_rls_as_user('b4de9068-eb55-4a49-8c31-fc57d30cb359');

-- Debería ver solo su negocio
SELECT name FROM businesses;
-- Esperado: Solo 'Salón María'


-- 4. Probar políticas INSERT/UPDATE
-- Test INSERT como empleado (no owner)
SELECT test_rls_as_user('4317407e-d136-4cb1-bf8d-d731231222f3');

-- Intentar crear un servicio (debería fallar)
INSERT INTO services (business_id, name, duration_minutes, price)
VALUES ('11111111-1111-1111-1111-111111111111', 'Corte básico', 30, 15.00);
-- Esperado: ERROR - no es owner

-- Test INSERT como owner
SELECT test_rls_as_user('b7d745d4-90e5-4680-89fc-3c93d9ba26c8');

-- Crear servicio (debería funcionar)
INSERT INTO services (business_id, name, duration_minutes, price)
VALUES ('11111111-1111-1111-1111-111111111111', 'Corte premium', 45, 25.00);
-- Esperado: SUCCESS

-- Intentar crear servicio en negocio ajeno (debería fallar)
INSERT INTO services (business_id, name, duration_minutes, price)
VALUES ('22222222-2222-2222-2222-222222222222', 'Corte pirata', 30, 20.00);
-- Esperado: ERROR - no es su negocio

-- 4. Probar políticas INSERT/UPDATE
-- Test INSERT como empleado (no owner)
SELECT test_rls_as_user('4317407e-d136-4cb1-bf8d-d731231222f3');

-- Intentar crear un servicio (debería fallar)
INSERT INTO services (business_id, name, duration_minutes, price)
VALUES ('11111111-1111-1111-1111-111111111111', 'Corte básico', 30, 15.00);
-- Esperado: ERROR - no es owner

-- Test INSERT como owner
SELECT test_rls_as_user('b7d745d4-90e5-4680-89fc-3c93d9ba26c8');

-- Crear servicio (debería funcionar)
INSERT INTO services (business_id, name, duration_minutes, price)
VALUES ('11111111-1111-1111-1111-111111111111', 'Corte premium', 45, 25.00);
-- Esperado: SUCCESS

-- Intentar crear servicio en negocio ajeno (debería fallar)
INSERT INTO services (business_id, name, duration_minutes, price)
VALUES ('22222222-2222-2222-2222-222222222222', 'Corte pirata', 30, 20.00);
-- Esperado: ERROR - no es su negocio