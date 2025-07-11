-- Migration: 005_create_appointments.sql
-- Tabla para gestionar citas/appointments

CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,

    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,

    status VARCHAR(50) DEFAULT 'scheduled',
    
    notes TEXT,
    price DECIMAL(10,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    CONSTRAINT check_time_order CHECK (end_time > start_time)
);

CREATE INDEX idx_appointments_business_id ON appointments(business_id);
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

CREATE INDEX idx_appointments_business_date ON appointments(business_id, appointment_date);

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE UNIQUE INDEX idx_unique_customer_appointment
    ON appointments(customer_id, appointment_date, start_time)
    WHERE status != 'canceled';