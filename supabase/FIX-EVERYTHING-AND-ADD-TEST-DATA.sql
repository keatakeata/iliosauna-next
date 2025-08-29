-- THIS SCRIPT FIXES EVERYTHING AND ADDS TEST DATA
-- Just copy ALL of this and paste it in Supabase SQL Editor, then click RUN

-- PART 1: Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);

-- PART 2: Add missing columns to customers table (if they don't exist)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);

ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);

ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);

-- PART 3: Clean up any old test data
DELETE FROM order_items WHERE order_id IN (
    SELECT id FROM orders WHERE customer_email = 'test@iliosauna.com'
);
DELETE FROM installations WHERE order_id IN (
    SELECT id FROM orders WHERE customer_email = 'test@iliosauna.com'
);
DELETE FROM shipping_tracking WHERE order_id IN (
    SELECT id FROM orders WHERE customer_email = 'test@iliosauna.com'
);
DELETE FROM orders WHERE customer_email = 'test@iliosauna.com';
DELETE FROM customers WHERE email = 'test@iliosauna.com';

-- PART 4: Create test data
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

-- Order 1: Completed
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    status,
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
    15999.00,
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '45 days'
);

INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
VALUES (test_order_id_1, 'Ilio Barrel Sauna - 6 Person', 1, 15999.00, 15999.00);

-- Order 2: Manufacturing
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    status,
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
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '10 days'
);

INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
VALUES (test_order_id_2, 'Ilio Cube Sauna - 4 Person', 1, 12999.00, 12999.00);

-- Order 3: Shipped
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    status,
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
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '5 days'
);

INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
VALUES (test_order_id_3, 'Ilio Panoramic Sauna - 8 Person', 1, 18999.00, 18999.00);

-- Add shipping tracking for shipped order
INSERT INTO shipping_tracking (order_id, tracking_number, status, created_at)
VALUES (test_order_id_3, '1Z999AA10123456785', 'in_transit', NOW() - INTERVAL '2 days');

-- Order 4: Processing (New)
INSERT INTO orders (
    id,
    order_number,
    customer_id,
    clerk_user_id,
    status,
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
    'test@iliosauna.com',
    'Test Customer',
    NOW() - INTERVAL '2 hours'
);

INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price)
VALUES (test_order_id_4, 'Infrared Sauna Panel Kit', 1, 9999.00, 9999.00);

-- Add installation for completed order
INSERT INTO installations (order_id, customer_id, status, scheduled_date, created_at)
VALUES (test_order_id_1, test_customer_id, 'completed', (NOW() - INTERVAL '20 days')::DATE, NOW() - INTERVAL '25 days');

END $$;

-- PART 5: Show results
SELECT 'SUCCESS! Database fixed and test data created!' as message;

-- Show the created orders
SELECT 
    order_number,
    status,
    total_amount,
    to_char(created_at, 'Mon DD, YYYY') as order_date
FROM orders 
WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
ORDER BY created_at DESC;

-- Count total orders
SELECT COUNT(*) as total_orders 
FROM orders 
WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq';