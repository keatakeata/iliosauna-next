-- WORKING SCRIPT: Includes subtotal and all required fields

-- STEP 1: Add missing columns if they don't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);

-- STEP 2: Clean up existing test data
DELETE FROM order_items WHERE order_id IN (
    SELECT id FROM orders WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
);
DELETE FROM installations WHERE order_id IN (
    SELECT id FROM orders WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
);
DELETE FROM shipping_tracking WHERE order_id IN (
    SELECT id FROM orders WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
);
DELETE FROM orders WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq';
DELETE FROM customers WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq';

-- STEP 3: Create test data with ALL required fields
DO $$ 
DECLARE 
    test_user_id VARCHAR := 'user_31ptkufDmCsaUtdXqJin14EWmHq';
    test_customer_id UUID := gen_random_uuid();
    test_order_id_1 UUID := gen_random_uuid();
    test_order_id_2 UUID := gen_random_uuid();
    test_order_id_3 UUID := gen_random_uuid();
    test_order_id_4 UUID := gen_random_uuid();
BEGIN

-- Create customer
INSERT INTO customers (
    id,
    clerk_user_id,
    email,
    first_name,
    last_name,
    created_at
) VALUES (
    test_customer_id,
    test_user_id,
    'test@iliosauna.com',
    'Test',
    'Customer',
    NOW()
);

-- Order 1: Completed (with subtotal)
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    status,
    subtotal,        -- Added subtotal
    total_amount,
    customer_email,
    customer_name,
    created_at
) VALUES (
    test_order_id_1,
    'ILIO-2024-001',
    test_customer_id,
    test_user_id,
    'completed',
    15999.00,        -- subtotal value
    15999.00,        -- total_amount value
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '45 days'
);

INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
VALUES (test_order_id_1, 'Ilio Barrel Sauna - 6 Person', 1, 15999.00, 15999.00);

-- Order 2: Manufacturing (with subtotal)
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    status,
    subtotal,
    total_amount,
    customer_email,
    customer_name,
    created_at
) VALUES (
    test_order_id_2,
    'ILIO-2024-002',
    test_customer_id,
    test_user_id,
    'manufacturing',
    12999.00,
    12999.00,
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '10 days'
);

INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
VALUES (test_order_id_2, 'Ilio Cube Sauna - 4 Person', 1, 12999.00, 12999.00);

-- Order 3: Shipped (with subtotal)
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    status,
    subtotal,
    total_amount,
    customer_email,
    customer_name,
    created_at
) VALUES (
    test_order_id_3,
    'ILIO-2024-003',
    test_customer_id,
    test_user_id,
    'shipped',
    18999.00,
    18999.00,
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '5 days'
);

INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
VALUES (test_order_id_3, 'Ilio Panoramic Sauna - 8 Person', 1, 18999.00, 18999.00);

-- Add shipping tracking
INSERT INTO shipping_tracking (order_id, tracking_number, status, created_at)
VALUES (test_order_id_3, '1Z999AA10123456785', 'in_transit', NOW() - INTERVAL '2 days');

-- Order 4: Processing (with subtotal)
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    status,
    subtotal,
    total_amount,
    customer_email,
    customer_name,
    created_at
) VALUES (
    test_order_id_4,
    'ILIO-2024-004',
    test_customer_id,
    test_user_id,
    'processing',
    9999.00,
    9999.00,
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '2 hours'
);

INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
VALUES (test_order_id_4, 'Infrared Sauna Panel Kit', 1, 9999.00, 9999.00);

-- Add installation
INSERT INTO installations (order_id, customer_id, status, scheduled_date, created_at)
VALUES (test_order_id_1, test_customer_id, 'completed', (NOW() - INTERVAL '20 days')::DATE, NOW() - INTERVAL '25 days');

END $$;

-- STEP 4: Verify success
SELECT 'SUCCESS! Test data created with subtotal!' as message;

-- Show orders
SELECT 
    order_number,
    status,
    subtotal,
    total_amount,
    to_char(created_at, 'Mon DD, YYYY') as order_date
FROM orders 
WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
ORDER BY created_at DESC;

-- Count
SELECT COUNT(*) as total_test_orders 
FROM orders 
WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq';