-- COMPLETE TEST DATA SCRIPT - Creates everything needed for testing
-- This includes all test products, customers, orders, shipping, and installations

-- STEP 1: Add ALL missing columns to ALL tables
ALTER TABLE orders ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);

ALTER TABLE customers ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);

ALTER TABLE shipping_tracking ADD COLUMN IF NOT EXISTS carrier VARCHAR(100);
ALTER TABLE shipping_tracking ADD COLUMN IF NOT EXISTS estimated_delivery DATE;

ALTER TABLE installations ADD COLUMN IF NOT EXISTS time_slot VARCHAR(50);
ALTER TABLE installations ADD COLUMN IF NOT EXISTS installer_name VARCHAR(255);
ALTER TABLE installations ADD COLUMN IF NOT EXISTS notes TEXT;

-- STEP 2: Clean up ALL existing test data
DELETE FROM order_items WHERE order_id IN (
    SELECT id FROM orders WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
);
DELETE FROM installations WHERE order_id IN (
    SELECT id FROM orders WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
);
DELETE FROM shipping_tracking WHERE order_id IN (
    SELECT id FROM orders WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
);
DELETE FROM support_tickets WHERE customer_id IN (
    SELECT id FROM customers WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
);
DELETE FROM orders WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq';
DELETE FROM customers WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq';

-- STEP 3: Create COMPLETE test data
DO $$ 
DECLARE 
    test_user_id VARCHAR := 'user_31ptkufDmCsaUtdXqJin14EWmHq';
    test_customer_id UUID := gen_random_uuid();
    test_order_id_1 UUID := gen_random_uuid();
    test_order_id_2 UUID := gen_random_uuid();
    test_order_id_3 UUID := gen_random_uuid();
    test_order_id_4 UUID := gen_random_uuid();
BEGIN

-- Create TEST CUSTOMER with all fields
INSERT INTO customers (
    id,
    clerk_user_id,
    email,
    first_name,
    last_name,
    phone,
    created_at
) VALUES (
    test_customer_id,
    test_user_id,
    'test@iliosauna.com',
    'Test',
    'Customer',
    '604-555-TEST',
    NOW()
);

-- TEST ORDER 1: Completed with installation done
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    stripe_payment_intent_id,
    status,
    subtotal,
    total_amount,
    customer_email,
    customer_name,
    created_at
) VALUES (
    test_order_id_1,
    'TEST-001-COMPLETED',
    test_customer_id,
    test_user_id,
    'test_pi_completed_001',
    'completed',
    15999.00,
    15999.00,
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '45 days'
);

-- Add test product to order 1
INSERT INTO order_items (
    order_id, 
    product_id, 
    product_name, 
    quantity, 
    unit_price, 
    total_price
) VALUES (
    test_order_id_1, 
    'test_prod_001', 
    'TEST: Barrel Sauna 6-Person', 
    1, 
    15999.00, 
    15999.00
);

-- Add completed shipping for order 1
INSERT INTO shipping_tracking (
    order_id, 
    tracking_number, 
    carrier,
    status, 
    estimated_delivery,
    created_at
) VALUES (
    test_order_id_1, 
    'TEST-TRACK-001', 
    'TEST Carrier',
    'delivered', 
    (NOW() - INTERVAL '30 days')::DATE,
    NOW() - INTERVAL '40 days'
);

-- Add completed installation for order 1
INSERT INTO installations (
    order_id, 
    customer_id, 
    status, 
    scheduled_date, 
    time_slot,
    installer_name,
    notes,
    created_at
) VALUES (
    test_order_id_1, 
    test_customer_id, 
    'completed', 
    (NOW() - INTERVAL '25 days')::DATE,
    '9:00 AM - 12:00 PM',
    'Test Installer',
    'Installation completed successfully. Customer satisfied.',
    NOW() - INTERVAL '30 days'
);

-- TEST ORDER 2: Manufacturing stage
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    stripe_payment_intent_id,
    status,
    subtotal,
    total_amount,
    customer_email,
    customer_name,
    created_at
) VALUES (
    test_order_id_2,
    'TEST-002-MANUFACTURING',
    test_customer_id,
    test_user_id,
    'test_pi_manufacturing_002',
    'manufacturing',
    12999.00,
    12999.00,
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '10 days'
);

INSERT INTO order_items (
    order_id, 
    product_id, 
    product_name, 
    quantity, 
    unit_price, 
    total_price
) VALUES (
    test_order_id_2, 
    'test_prod_002', 
    'TEST: Cube Sauna 4-Person', 
    1, 
    12999.00, 
    12999.00
);

-- TEST ORDER 3: Shipped, in transit
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    stripe_payment_intent_id,
    status,
    subtotal,
    total_amount,
    customer_email,
    customer_name,
    created_at
) VALUES (
    test_order_id_3,
    'TEST-003-SHIPPED',
    test_customer_id,
    test_user_id,
    'test_pi_shipped_003',
    'shipped',
    18999.00,
    18999.00,
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '5 days'
);

INSERT INTO order_items (
    order_id, 
    product_id, 
    product_name, 
    quantity, 
    unit_price, 
    total_price
) VALUES (
    test_order_id_3, 
    'test_prod_003', 
    'TEST: Panoramic Sauna 8-Person', 
    1, 
    18999.00, 
    18999.00
);

-- Add active shipping tracking
INSERT INTO shipping_tracking (
    order_id, 
    tracking_number, 
    carrier,
    status, 
    estimated_delivery,
    created_at
) VALUES (
    test_order_id_3, 
    'TEST-TRACK-003', 
    'TEST Express',
    'in_transit', 
    (NOW() + INTERVAL '3 days')::DATE,
    NOW() - INTERVAL '2 days'
);

-- TEST ORDER 4: Just placed, processing
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    stripe_payment_intent_id,
    status,
    subtotal,
    total_amount,
    customer_email,
    customer_name,
    created_at
) VALUES (
    test_order_id_4,
    'TEST-004-PROCESSING',
    test_customer_id,
    test_user_id,
    'test_pi_processing_004',
    'processing',
    9999.00,
    9999.00,
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '2 hours'
);

-- Multiple items in order 4
INSERT INTO order_items (
    order_id, 
    product_id, 
    product_name, 
    quantity, 
    unit_price, 
    total_price
) VALUES 
    (test_order_id_4, 'test_prod_004a', 'TEST: Infrared Panel Kit', 1, 7999.00, 7999.00),
    (test_order_id_4, 'test_prod_004b', 'TEST: Sauna Accessories Pack', 1, 2000.00, 2000.00);

-- Add a support ticket for testing
INSERT INTO support_tickets (
    customer_id,
    ticket_number,
    subject,
    description,
    status,
    created_at
) VALUES (
    test_customer_id,
    'TEST-TICKET-001',
    'Test Support Request',
    'This is a test support ticket to verify the support system works.',
    'open',
    NOW() - INTERVAL '1 day'
);

END $$;

-- STEP 4: Verify everything was created
SELECT '✅ SUCCESS! Complete test environment created!' as status;

-- Show test orders summary
SELECT 
    '📦 ORDERS CREATED' as category,
    COUNT(*) as count,
    'With various statuses' as details
FROM orders 
WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'

UNION ALL

SELECT 
    '📋 ORDER ITEMS' as category,
    COUNT(*) as count,
    'Product items in orders' as details
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'

UNION ALL

SELECT 
    '🚚 SHIPPING RECORDS' as category,
    COUNT(*) as count,
    'Tracking information' as details
FROM shipping_tracking st
JOIN orders o ON st.order_id = o.id
WHERE o.clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'

UNION ALL

SELECT 
    '🔧 INSTALLATIONS' as category,
    COUNT(*) as count,
    'Installation records' as details
FROM installations i
JOIN orders o ON i.order_id = o.id
WHERE o.clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'

UNION ALL

SELECT 
    '💬 SUPPORT TICKETS' as category,
    COUNT(*) as count,
    'Support requests' as details
FROM support_tickets
WHERE customer_id IN (
    SELECT id FROM customers WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
);

-- Show detailed order list
SELECT 
    order_number,
    status,
    total_amount,
    to_char(created_at, 'Mon DD, YYYY HH:MI AM') as order_date
FROM orders 
WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
ORDER BY created_at DESC;