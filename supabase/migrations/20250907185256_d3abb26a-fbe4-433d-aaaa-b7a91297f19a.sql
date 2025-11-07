-- Add missing columns to machine_bookings table
ALTER TABLE machine_bookings 
ADD COLUMN duration_hours INTEGER,
ADD COLUMN field_size_acres NUMERIC;