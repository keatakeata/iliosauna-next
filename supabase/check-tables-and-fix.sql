-- STEP 1: First, let's check what columns exist in your tables
-- Run this FIRST to see your table structure

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;

-- STEP 2: If clerk_user_id is missing from orders table, add it
-- Run this to add the missing column

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255);

-- STEP 3: After adding the column, run this simplified test data

DO $$ 
DECLARE 
    test_user_id VARCHAR := 'user_31ptkufDmCsaUtdXqJin14EWmHq';
BEGIN

-- Delete any existing test data first
DELETE FROM order_items WHERE order_id IN (
    SELECT id FROM orders WHERE customer_email = 'test@iliosauna.com'
);
DELETE FROM orders WHERE customer_email = 'test@iliosauna.com';
DELETE FROM customers WHERE email = 'test@iliosauna.com';

-- Create simple customer
INSERT INTO customers (
    id,
    email,
    created_at
) VALUES (
    gen_random_uuid(),
    'test@iliosauna.com',
    NOW()
);

-- Create simple test order
INSERT INTO orders (
    id,
    order_number,
    clerk_user_id,
    status,
    total_amount,
    customer_email,
    created_at
) VALUES (
    gen_random_uuid(),
    'TEST-001',
    test_user_id,
    'processing',
    9999.00,
    'test@iliosauna.com',
    NOW()
);

END $$;

-- Verify it worked
SELECT 'Success! Created test order' as result;

-- Check the order was created
SELECT * FROM orders 
WHERE customer_email = 'test@iliosauna.com';