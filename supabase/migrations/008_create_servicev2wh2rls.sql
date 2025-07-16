-- Crear tabla services
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- duración en minutos
  price DECIMAL(10,2) NOT NULL
);

-- Agregar campos adicionales a services
ALTER TABLE services 
ADD COLUMN category VARCHAR(100),
ADD COLUMN active BOOLEAN DEFAULT true,


-- Política para UPDATE
CREATE POLICY "Users can update services for their business" 
ON services FOR UPDATE 
USING (
  business_id IN (
    SELECT business_id FROM business_users 
    WHERE user_id = auth.uid()
  )
);

-- Política para SELECT
CREATE POLICY "Users can view services for their business" 
ON services FOR SELECT 
USING (
  business_id IN (
    SELECT business_id FROM business_users 
    WHERE user_id = auth.uid()
  )
);


-- Política para DELETE
CREATE POLICY "Users can delete services for their business" 
ON services FOR DELETE 
USING (
  business_id IN (
    SELECT business_id FROM business_users 
    WHERE user_id = auth.uid()
  )
);

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';