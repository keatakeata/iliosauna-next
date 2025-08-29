-- SIMPLE WORKING SCHEMA - JUST COPY AND PASTE THIS ENTIRE THING

-- Add missing column to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50),
  customer_id UUID,
  clerk_user_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID,
  product_id VARCHAR(255),
  product_name VARCHAR(255),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shipping table
CREATE TABLE IF NOT EXISTS shipping_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID,
  tracking_number VARCHAR(255),
  status VARCHAR(50) DEFAULT 'preparing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create installations table
CREATE TABLE IF NOT EXISTS installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID,
  customer_id UUID,
  status VARCHAR(50) DEFAULT 'scheduled',
  scheduled_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  ticket_number VARCHAR(50),
  subject VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Done! All tables created
SELECT 'All tables created successfully!' as status;