-- Migration: 002_create_business_users.sql
-- Relación entre usuarios autenticados y negocios
-- Permite definir roles como 'owner', 'employee', etc.

CREATE TABLE business_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  role VARCHAR(50) DEFAULT 'employee',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

  CONSTRAINT unique_user_per_business UNIQUE (business_id, user_id)
);

CREATE INDEX idx_business_users_business_id ON business_users(business_id);
CREATE INDEX idx_business_users_user_id ON business_users(user_id);