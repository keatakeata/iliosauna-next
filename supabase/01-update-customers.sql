-- PART 1: Update Customers Table
-- Run this first to add missing columns to your existing customers table

ALTER TABLE customers ADD COLUMN IF NOT EXISTS 
  phone VARCHAR(20),
  address_line1 TEXT,
  address_line2 TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Canada',
  profile_image_url TEXT,
  preferences JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();