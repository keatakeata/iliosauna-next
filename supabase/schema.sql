-- SUPABASE DATABASE SCHEMA FOR ILIOSAUNA
-- Run this in your Supabase SQL editor

-- ============================================
-- CUSTOMERS TABLE (Already exists, updating)
-- ============================================
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

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
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
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  INDEX idx_orders_customer_id (customer_id),
  INDEX idx_orders_clerk_user_id (clerk_user_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created_at (created_at DESC)
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Product Info
  product_id VARCHAR(255) NOT NULL, -- Can be Stripe product ID or Sanity ID
  product_name VARCHAR(255) NOT NULL,
  product_variant VARCHAR(255),
  product_image_url TEXT,
  
  -- Pricing
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- Customizations (for saunas)
  customizations JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_order_items_order_id (order_id)
);

-- ============================================
-- SHIPPING TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shipping_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  
  carrier VARCHAR(100),
  tracking_number VARCHAR(255),
  tracking_url TEXT,
  status VARCHAR(50) DEFAULT 'preparing',
  
  -- Tracking Events
  events JSONB DEFAULT '[]',
  
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_shipping_order_id (order_id)
);

-- ============================================
-- INSTALLATION RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  
  -- Installation Details
  status VARCHAR(50) DEFAULT 'scheduled',
  scheduled_date DATE,
  scheduled_time_slot VARCHAR(50),
  
  -- Installer Info
  installer_name VARCHAR(255),
  installer_phone VARCHAR(20),
  installer_company VARCHAR(255),
  
  -- Location
  installation_address_line1 TEXT,
  installation_address_line2 TEXT,
  installation_city VARCHAR(100),
  installation_province VARCHAR(100),
  installation_postal_code VARCHAR(20),
  
  -- Documentation
  pre_installation_photos TEXT[],
  post_installation_photos TEXT[],
  installation_notes TEXT,
  customer_signature_url TEXT,
  
  -- Completion
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_notes TEXT,
  warranty_start_date DATE,
  warranty_end_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_installations_customer_id (customer_id),
  INDEX idx_installations_status (status),
  INDEX idx_installations_scheduled_date (scheduled_date)
);

-- ============================================
-- CUSTOMER DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  
  document_type VARCHAR(50) NOT NULL, -- invoice, warranty, manual, spec_sheet
  document_name VARCHAR(255) NOT NULL,
  document_url TEXT NOT NULL,
  file_size INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_documents_customer_id (customer_id),
  INDEX idx_documents_order_id (order_id)
);

-- ============================================
-- SUPPORT TICKETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'normal',
  category VARCHAR(50),
  
  assigned_to VARCHAR(255),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_tickets_customer_id (customer_id),
  INDEX idx_tickets_status (status)
);

-- ============================================
-- SUPPORT TICKET MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  
  sender_type VARCHAR(20) NOT NULL, -- customer, support
  sender_name VARCHAR(255),
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_ticket_messages_ticket_id (ticket_id)
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Customers can only see their own data
CREATE POLICY "Users can view own customer data" ON customers
  FOR SELECT USING (clerk_user_id = auth.uid());

CREATE POLICY "Users can update own customer data" ON customers
  FOR UPDATE USING (clerk_user_id = auth.uid());

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (clerk_user_id = auth.uid());

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.clerk_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own shipping" ON shipping_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = shipping_tracking.order_id 
      AND orders.clerk_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own installations" ON installations
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE clerk_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own documents" ON customer_documents
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE clerk_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE clerk_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE clerk_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view ticket messages" ON ticket_messages
  FOR SELECT USING (
    ticket_id IN (
      SELECT id FROM support_tickets 
      WHERE customer_id IN (
        SELECT id FROM customers WHERE clerk_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create ticket messages" ON ticket_messages
  FOR INSERT WITH CHECK (
    ticket_id IN (
      SELECT id FROM support_tickets 
      WHERE customer_id IN (
        SELECT id FROM customers WHERE clerk_user_id = auth.uid()
      )
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
BEGIN
  RETURN 'ILIO-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
         LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS VARCHAR AS $$
BEGIN
  RETURN 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
         LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-generating numbers
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

CREATE TRIGGER set_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL)
  EXECUTE FUNCTION generate_ticket_number();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shipping_updated_at
  BEFORE UPDATE ON shipping_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_installations_updated_at
  BEFORE UPDATE ON installations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();