-- Migration: 003_create_customers.sql
-- Tabla para almacenar clientes finales de cada negocio

CREATE TABLE customers (

    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),

    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

    CONSTRAINT unique_email_per_business UNIQUE (business_id, email)
);

CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_customers_email ON customers(email);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;

END;
$$ LANGUAGE plpgsql;

--Trigger que ejecuta la funcion en cada UPDATE
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();