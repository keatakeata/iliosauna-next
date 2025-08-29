-- TEST DATA FOR DASHBOARD TESTING
-- Run this in Supabase SQL Editor to create sample orders for testing

-- IMPORTANT: Replace 'YOUR_CLERK_USER_ID' with your actual Clerk user ID
-- You can find this by:
-- 1. Sign in to your site at https://iliosauna.com
-- 2. Go to https://dashboard.clerk.com
-- 3. Click on "Users" and find your user
-- 4. Copy the user ID (starts with 'user_')

-- Set your Clerk user ID here:
DO $$ 
DECLARE 
    test_user_id VARCHAR := 'user_31ptkufDmCsaUtdXqJin14EWmHq'; -- Your Clerk ID
    test_customer_id UUID;
BEGIN

-- Create a test customer record if needed
INSERT INTO customers (
    id,
    clerk_user_id,
    email,
    first_name,
    last_name,
    phone,
    address_line1,
    city,
    province,
    postal_code,
    created_at
) VALUES (
    gen_random_uuid(),
    test_user_id,
    'test@iliosauna.com',
    'Test',
    'Customer',
    '604-555-0123',
    '123 Wellness Way',
    'Vancouver',
    'BC',
    'V6B 2W2',
    NOW()
) ON CONFLICT (clerk_user_id) DO UPDATE
SET email = EXCLUDED.email
RETURNING id INTO test_customer_id;

-- Order 1: Delivered order (completed installation)
WITH new_order AS (
    INSERT INTO orders (
        id,
        order_number,
        customer_id,
        clerk_user_id,
        stripe_payment_intent_id,
        status,
        total_amount,
        customer_email,
        customer_name,
        created_at
    ) VALUES (
        gen_random_uuid(),
        'ILIO-2024-001',
        test_customer_id,
        test_user_id,
        'pi_test_completed_' || gen_random_uuid(),
        'completed',
        15999.00,
        'test@iliosauna.com',
        'Test Customer',
        NOW() - INTERVAL '45 days'
    ) RETURNING id
)
-- Add order items
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    new_order.id,
    'prod_barrel_sauna',
    'Ilio Barrel Sauna - 6 Person',
    1,
    15999.00,
    15999.00
FROM new_order;

-- Add shipping info for delivered order
WITH order_info AS (
    SELECT id FROM orders WHERE order_number = 'ILIO-2024-001'
)
INSERT INTO shipping_tracking (order_id, tracking_number, status, created_at)
SELECT 
    order_info.id,
    '1Z999AA10123456784',
    'delivered',
    NOW() - INTERVAL '30 days'
FROM order_info;

-- Add completed installation
WITH order_info AS (
    SELECT id FROM orders WHERE order_number = 'ILIO-2024-001'
)
INSERT INTO installations (order_id, customer_id, status, scheduled_date, created_at)
SELECT 
    order_info.id,
    test_customer_id,
    'completed',
    (NOW() - INTERVAL '20 days')::DATE,
    NOW() - INTERVAL '25 days'
FROM order_info;

-- Order 2: Currently being manufactured
WITH new_order AS (
    INSERT INTO orders (
        id,
        order_number,
        customer_id,
        clerk_user_id,
        stripe_payment_intent_id,
        status,
        total_amount,
        customer_email,
        customer_name,
        created_at
    ) VALUES (
        gen_random_uuid(),
        'ILIO-2024-002',
        test_customer_id,
        test_user_id,
        'pi_test_manufacturing_' || gen_random_uuid(),
        'manufacturing',
        12999.00,
        'test@iliosauna.com',
        'Test Customer',
        NOW() - INTERVAL '10 days'
    ) RETURNING id
)
-- Add order items
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    new_order.id,
    'prod_cube_sauna',
    'Ilio Cube Sauna - 4 Person',
    1,
    12999.00,
    12999.00
FROM new_order;

-- Order 3: Shipped, awaiting delivery
WITH new_order AS (
    INSERT INTO orders (
        id,
        order_number,
        customer_id,
        clerk_user_id,
        stripe_payment_intent_id,
        status,
        total_amount,
        customer_email,
        customer_name,
        created_at
    ) VALUES (
        gen_random_uuid(),
        'ILIO-2024-003',
        test_customer_id,
        test_user_id,
        'pi_test_shipped_' || gen_random_uuid(),
        'shipped',
        18999.00,
        'test@iliosauna.com',
        'Test Customer',
        NOW() - INTERVAL '5 days'
    ) RETURNING id
)
-- Add order items
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    new_order.id,
    'prod_panoramic_sauna',
    'Ilio Panoramic Sauna - 8 Person',
    1,
    18999.00,
    18999.00
FROM new_order;

-- Add shipping info for shipped order
WITH order_info AS (
    SELECT id FROM orders WHERE order_number = 'ILIO-2024-003'
)
INSERT INTO shipping_tracking (order_id, tracking_number, status, created_at)
SELECT 
    order_info.id,
    '1Z999AA10123456785',
    'in_transit',
    NOW() - INTERVAL '2 days'
FROM order_info;

-- Order 4: Recent order, just placed
WITH new_order AS (
    INSERT INTO orders (
        id,
        order_number,
        customer_id,
        clerk_user_id,
        stripe_payment_intent_id,
        status,
        total_amount,
        customer_email,
        customer_name,
        created_at
    ) VALUES (
        gen_random_uuid(),
        'ILIO-2024-004',
        test_customer_id,
        test_user_id,
        'pi_test_new_' || gen_random_uuid(),
        'processing',
        9999.00,
        'test@iliosauna.com',
        'Test Customer',
        NOW() - INTERVAL '2 hours'
    ) RETURNING id
)
-- Add order items with multiple products
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    new_order.id,
    'prod_infrared_panel',
    'Infrared Sauna Panel Kit',
    1,
    9999.00,
    9999.00
FROM new_order;

END $$;

-- Verify the data was created
SELECT 
    'Orders created:' as status,
    COUNT(*) as count 
FROM orders 
WHERE customer_email = 'test@iliosauna.com';

SELECT 
    order_number,
    status,
    total_amount,
    created_at
FROM orders 
WHERE customer_email = 'test@iliosauna.com'
ORDER BY created_at DESC;