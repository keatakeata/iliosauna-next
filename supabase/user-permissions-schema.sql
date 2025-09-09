-- User Permissions & Roles Schema
-- Run this in Supabase SQL Editor

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
    user_role VARCHAR(50) NOT NULL DEFAULT 'customer',
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some useful indexes
CREATE INDEX IF NOT EXISTS idx_user_permissions_clerk_id ON user_permissions(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_role ON user_permissions(user_role);

-- Create audit log table for admin actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id VARCHAR(255) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for audit log
CREATE INDEX IF NOT EXISTS idx_admin_audit_clerk_id ON admin_audit_log(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_log(created_at DESC);

-- Insert default admin user (adjust clerk_user_id to your admin's actual ID)
INSERT INTO user_permissions (clerk_user_id, user_role, permissions)
VALUES (
    'YOUR_ADMIN_CLERK_ID_HERE',
    'admin',
    '{
        "cms_access": true,
        "blog_create": true,
        "blog_edit": true,
        "blog_publish": true,
        "page_edit": true,
        "product_edit": true,
        "user_management": true,
        "analytics_view": true
    }'::jsonb
)
ON CONFLICT (clerk_user_id) DO NOTHING;

-- Insert sample customer permissions (default for all users)
INSERT INTO user_permissions (clerk_user_id, user_role, permissions)
VALUES (
    'user_31ptkufDmCsaUtdXqJin14EWmHq',
    'customer',
    '{
        "account_view": true,
        "orders_view": true,
        "orders_history": true,
        "support_access": true,
        "content_view": true
    }'::jsonb
)
ON CONFLICT (clerk_user_id) DO NOTHING;

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
    user_clerk_id VARCHAR(255),
    required_permission VARCHAR(100)
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_permissions
        WHERE clerk_user_id = user_clerk_id
        AND (
            user_role = 'admin'
            OR permissions->>required_permission = 'true'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Show success
SELECT '✅ User permissions schema created successfully!' as message;

-- Show current permissions
SELECT
    clerk_user_id,
    user_role,
    permissions
FROM user_permissions
ORDER BY created_at;
