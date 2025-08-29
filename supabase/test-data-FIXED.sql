-- FIXED TEST DATA - Works with your current table structure
-- This version only uses columns that exist in your customers table

DO $$ 
DECLARE 
    test_user_id VARCHAR := 'user_31ptkufDmCsaUtdXqJin14EWmHq';
    test_customer_id UUID;
BEGIN

-- Create or update customer record (using only existing columns)
INSERT INTO customers (
    id,
    clerk_user_id,
    email,
    first_name,
    last_name,
    created_at
) VALUES (
    gen_random_uuid(),
    test_user_id,
    'test@iliosauna.com',
    'Test',
    'Customer',
    NOW()
) ON CONFLICT (clerk_user_id) DO UPDATE
SET email = EXCLUDED.email
RETURNING id INTO test_customer_id;

-- Order 1: Completed order
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
        'pi_test_completed_001',
        'completed',
        15999.00,
        'test@iliosauna.com',
        'Test Customer',
        NOW() - INTERVAL '45 days'
    ) RETURNING id
)
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    new_order.id,
    'prod_barrel_sauna',
    'Ilio Barrel Sauna - 6 Person',
    1,
    15999.00,
    15999.00
FROM new_order;

-- Order 2: Manufacturing
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
        'pi_test_manufacturing_002',
        'manufacturing',
        12999.00,
        'test@iliosauna.com',
        'Test Customer',
        NOW() - INTERVAL '10 days'
    ) RETURNING id
)
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    new_order.id,
    'prod_cube_sauna',
    'Ilio Cube Sauna - 4 Person',
    1,
    12999.00,
    12999.00
FROM new_order;

-- Order 3: Shipped
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
        'pi_test_shipped_003',
        'shipped',
        18999.00,
        'test@iliosauna.com',
        'Test Customer',
        NOW() - INTERVAL '5 days'
    ) RETURNING id
)
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

-- Order 4: Processing (New)
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
        'pi_test_new_004',
        'processing',
        9999.00,
        'test@iliosauna.com',
        'Test Customer',
        NOW() - INTERVAL '2 hours'
    ) RETURNING id
)
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT 
    new_order.id,
    'prod_infrared_panel',
    'Infrared Sauna Panel Kit',
    1,
    9999.00,
    9999.00
FROM new_order;

-- Add one completed installation for testing
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

END $$;

-- Verify the data was created
SELECT 
    'Success! Created ' || COUNT(*) || ' test orders for your Clerk ID' as result
FROM orders 
WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq';

-- Show the orders
SELECT 
    order_number,
    status,
    total_amount,
    created_at
FROM orders 
WHERE clerk_user_id = 'user_31ptkufDmCsaUtdXqJin14EWmHq'
ORDER BY created_at DESC;