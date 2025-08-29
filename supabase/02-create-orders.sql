-- PART 2: Create Orders Tables
-- Run this second to create the orders system

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  clerk_user_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  
  -- Order Details
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'CAD',
  
  -- Customer Info at time of order
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  
  -- Shipping Address
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city VARCHAR(100),
  shipping_province VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100) DEFAULT 'Canada',
  
  -- Billing Address
  billing_address_line1 TEXT,
  billing_address_line2 TEXT,
  billing_city VARCHAR(100),
  billing_province VARCHAR(100),
  billing_postal_code VARCHAR(20),
  billing_country VARCHAR(100) DEFAULT 'Canada',
  
  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_clerk_user_id ON orders(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);