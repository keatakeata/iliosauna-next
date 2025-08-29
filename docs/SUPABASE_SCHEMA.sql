-- Iliosauna Database Schema
-- Run this in your Supabase SQL Editor
-- Go to: https://app.supabase.com/project/tptazvskawowdimgmmkt/editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CUSTOMERS TABLE (extends Clerk auth)
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  
  -- Customer metrics
  first_visit_date TIMESTAMPTZ DEFAULT NOW(),
  first_purchase_date TIMESTAMPTZ,
  lifetime_value DECIMAL(10, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  
  -- Attribution
  acquisition_source TEXT, -- google_ads, facebook, instagram, organic, direct
  acquisition_campaign TEXT,
  acquisition_medium TEXT,
  
  -- Preferences
  preferred_contact_method TEXT DEFAULT 'email', -- email, phone, sms
  marketing_consent BOOLEAN DEFAULT true,
  
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SESSIONS TABLE (track every visit)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  visitor_id TEXT, -- for anonymous visitors
  
  -- Session info
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  page_views_count INTEGER DEFAULT 0,
  
  -- Source tracking
  landing_page TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Device info
  device_type TEXT, -- mobile, tablet, desktop
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  
  -- Location
  ip_address INET,
  country TEXT,
  region TEXT,
  city TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EVENTS TABLE (track all user actions)
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Event data
  event_name TEXT NOT NULL, -- Page Viewed, Product Viewed, Added to Cart, etc.
  event_category TEXT, -- navigation, engagement, conversion
  properties JSONB DEFAULT '{}', -- flexible properties
  
  -- Context
  page_url TEXT,
  page_title TEXT,
  
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PRODUCT VIEWS (specific tracking for product pages)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Product info (you'll sync this with Sanity)
  product_id TEXT NOT NULL,
  product_name TEXT,
  product_price DECIMAL(10, 2),
  product_category TEXT,
  
  -- Engagement metrics
  time_on_page INTEGER, -- seconds
  scroll_depth INTEGER, -- percentage
  interactions JSONB DEFAULT '[]', -- clicked gallery, watched video, etc.
  
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LEAD SCORES (for sales team)
-- =====================================================
CREATE TABLE IF NOT EXISTS lead_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE UNIQUE,
  
  -- Scoring
  score INTEGER DEFAULT 0, -- 0-100
  grade TEXT, -- 'A', 'B', 'C', 'D'
  status TEXT DEFAULT 'cold', -- cold, warm, hot, customer
  
  -- Factors (what contributed to score)
  scoring_factors JSONB DEFAULT '{}',
  /* Example:
  {
    "pages_viewed": 20,
    "product_views": 30,
    "downloaded_brochure": 25,
    "watched_video": 15,
    "high_income_area": 10
  }
  */
  
  -- Sales notes
  assigned_to TEXT, -- sales person email/id
  last_contacted_at TIMESTAMPTZ,
  next_followup_at TIMESTAMPTZ,
  notes TEXT,
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ORDERS TABLE (when they buy)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT NOT NULL,
  
  -- Order details
  status TEXT DEFAULT 'pending', -- pending, processing, paid, shipped, delivered, cancelled
  
  -- Amounts
  subtotal DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Payment
  payment_method TEXT, -- stripe, paypal, financing
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  stripe_payment_intent_id TEXT,
  
  -- Shipping
  shipping_name TEXT,
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  shipping_country TEXT DEFAULT 'US',
  
  -- Attribution (what made them buy)
  attribution_source TEXT, -- last touch
  attribution_data JSONB, -- full journey
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- =====================================================
-- ORDER ITEMS (products in each order)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  
  -- Product info
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_variant TEXT, -- size, color, model
  
  -- Pricing
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- Customization (for configured saunas)
  customization_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CART ABANDONMENT (track what almost sold)
-- =====================================================
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Cart data
  cart_value DECIMAL(10, 2),
  items_count INTEGER,
  items JSONB, -- array of products
  
  -- Recovery
  recovery_email_sent BOOLEAN DEFAULT false,
  recovered BOOLEAN DEFAULT false,
  recovered_order_id UUID REFERENCES orders(id),
  
  abandoned_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_customers_clerk_id ON customers(clerk_user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_sessions_customer ON sessions(customer_id);
CREATE INDEX idx_sessions_dates ON sessions(started_at DESC);
CREATE INDEX idx_events_session ON events(session_id);
CREATE INDEX idx_events_customer ON events(customer_id);
CREATE INDEX idx_events_name ON events(event_name);
CREATE INDEX idx_events_occurred ON events(occurred_at DESC);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_lead_scores_customer ON lead_scores(customer_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Customers can only see their own data
CREATE POLICY "Customers can view own profile" ON customers
  FOR SELECT USING (auth.uid()::TEXT = clerk_user_id);

CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE clerk_user_id = auth.uid()::TEXT
    )
  );

-- Public can insert events (for tracking)
CREATE POLICY "Public can insert events" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert sessions" ON sessions
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update customer lifetime value
CREATE OR REPLACE FUNCTION update_customer_lifetime_value()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET 
    lifetime_value = (
      SELECT COALESCE(SUM(total_amount), 0)
      FROM orders
      WHERE customer_id = NEW.customer_id
      AND status = 'delivered'
    ),
    total_orders = (
      SELECT COUNT(*)
      FROM orders
      WHERE customer_id = NEW.customer_id
      AND status = 'delivered'
    ),
    updated_at = NOW()
  WHERE id = NEW.customer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update lifetime value when order is delivered
CREATE TRIGGER update_ltv_on_order_delivered
AFTER UPDATE ON orders
FOR EACH ROW
WHEN (NEW.status = 'delivered' AND OLD.status != 'delivered')
EXECUTE FUNCTION update_customer_lifetime_value();

-- =====================================================
-- INITIAL DATA / TEST DATA (Optional)
-- =====================================================

-- Insert a test customer (you can delete this)
INSERT INTO customers (clerk_user_id, email, first_name, last_name)
VALUES ('test_user_123', 'test@iliosauna.com', 'Test', 'User')
ON CONFLICT (clerk_user_id) DO NOTHING;

-- =====================================================
-- USEFUL QUERIES FOR ANALYTICS
-- =====================================================

/*
-- Top performing acquisition sources
SELECT 
  acquisition_source,
  COUNT(*) as customers,
  AVG(lifetime_value) as avg_ltv,
  SUM(lifetime_value) as total_revenue
FROM customers
WHERE first_purchase_date IS NOT NULL
GROUP BY acquisition_source
ORDER BY total_revenue DESC;

-- Product view to purchase conversion
SELECT 
  pv.product_name,
  COUNT(DISTINCT pv.customer_id) as viewers,
  COUNT(DISTINCT o.customer_id) as buyers,
  ROUND(COUNT(DISTINCT o.customer_id)::NUMERIC / COUNT(DISTINCT pv.customer_id) * 100, 2) as conversion_rate
FROM product_views pv
LEFT JOIN orders o ON o.customer_id = pv.customer_id
GROUP BY pv.product_name;

-- Customer journey length
SELECT 
  AVG(DATE_PART('day', first_purchase_date - first_visit_date)) as avg_days_to_purchase,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY DATE_PART('day', first_purchase_date - first_visit_date)) as median_days
FROM customers
WHERE first_purchase_date IS NOT NULL;
*/

-- =====================================================
-- DONE! Your database is ready for analytics! 
-- =====================================================