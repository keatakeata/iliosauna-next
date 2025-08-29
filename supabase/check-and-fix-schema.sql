-- FIRST: Let's check what columns exist in your customers table
-- Run this query first to see your current table structure:

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'customers';

-- After running the above, you'll see what columns you have
-- Then run this to add the missing clerk_user_id column:

ALTER TABLE customers ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);

-- Now run the complete schema below:

-- ============================================
-- CUSTOMERS TABLE - Add remaining columns
-- ============================================
ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS province VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Canada';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  clerk_user_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'CAD',
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city VARCHAR(100),
  shipping_province VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(100) DEFAULT 'Canada',
  billing_address_line1 TEXT,
  billing_address_line2 TEXT,
  billing_city VARCHAR(100),
  billing_province VARCHAR(100),
  billing_postal_code VARCHAR(20),
  billing_country VARCHAR(100) DEFAULT 'Canada',
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_clerk_user_id ON orders(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_variant VARCHAR(255),
  product_image_url TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  customizations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

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
  events JSONB DEFAULT '[]',
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_order_id ON shipping_tracking(order_id);

-- ============================================
-- INSTALLATION RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  scheduled_date DATE,
  scheduled_time_slot VARCHAR(50),
  installer_name VARCHAR(255),
  installer_phone VARCHAR(20),
  installer_company VARCHAR(255),
  installation_address_line1 TEXT,
  installation_address_line2 TEXT,
  installation_city VARCHAR(100),
  installation_province VARCHAR(100),
  installation_postal_code VARCHAR(20),
  pre_installation_photos TEXT[],
  post_installation_photos TEXT[],
  installation_notes TEXT,
  customer_signature_url TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_notes TEXT,
  warranty_start_date DATE,
  warranty_end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_installations_customer_id ON installations(customer_id);
CREATE INDEX IF NOT EXISTS idx_installations_status ON installations(status);
CREATE INDEX IF NOT EXISTS idx_installations_scheduled_date ON installations(scheduled_date);

-- ============================================
-- CUSTOMER DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  document_url TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_customer_id ON customer_documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_documents_order_id ON customer_documents(order_id);

-- ============================================
-- SUPPORT TICKETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  ticket_number VARCHAR(50) UNIQUE,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'normal',
  category VARCHAR(50),
  assigned_to VARCHAR(255),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

-- ============================================
-- SUPPORT TICKET MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL,
  sender_name VARCHAR(255),
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number = 'ILIO-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                       LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number = 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                        LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS set_order_number ON orders;
DROP TRIGGER IF EXISTS set_ticket_number ON support_tickets;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_shipping_updated_at ON shipping_tracking;
DROP TRIGGER IF EXISTS update_installations_updated_at ON installations;
DROP TRIGGER IF EXISTS update_tickets_updated_at ON support_tickets;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

CREATE TRIGGER set_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION generate_ticket_number();

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

-- ============================================
-- ROW LEVEL SECURITY (Simple for now)
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Create simple policies (we'll update these later for Clerk)
CREATE POLICY IF NOT EXISTS "Enable all for customers" ON customers FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Enable all for orders" ON orders FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Enable all for order_items" ON order_items FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Enable all for shipping_tracking" ON shipping_tracking FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Enable all for installations" ON installations FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Enable all for customer_documents" ON customer_documents FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Enable all for support_tickets" ON support_tickets FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Enable all for ticket_messages" ON ticket_messages FOR ALL USING (true);

-- Success message
SELECT 'Schema created successfully!' as status;