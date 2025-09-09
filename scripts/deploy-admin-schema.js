#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Your Supabase configuration
const supabaseUrl = 'https://tptazvskawowdimgmmkt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdGF6dnNrYXdvd2RpbWdtbWt0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM1MDY3NywiZXhwIjoyMDcxOTI2Njc3fQ.qlEdf4QWsbDAyaDeuTWLqQuuf-YceBoKInBC1JoxonE';

// Your Clerk User ID
const clerkUserId = 'user_31ptkufDmCsaUtdXqJin14EWmHq';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deployAdminSchema() {
  console.log('🚀 Starting admin schema deployment...');

  try {
    // Step 1: Create admin user directly (skip table creation for now)
    console.log('👑 Setting you as admin...');

    // Try a simple upsert first to see if table exists
    const { error: upsertError } = await supabase
      .from('user_permissions')
      .upsert({
        clerk_user_id: clerkUserId,
        user_role: 'admin',
        permissions: {
          cms_access: true,
          blog_create: true,
          blog_edit: true,
          blog_publish: true,
          page_edit: true,
          product_edit: true,
          user_management: true,
          analytics_view: true
        }
      });

    if (upsertError) {
      // If table doesn't exist, let's create it manually
      console.log('📋 Table doesn\'t exist, creating it with manual approach...');
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS user_permissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
            user_role VARCHAR(50) NOT NULL DEFAULT 'customer',
            permissions JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      console.log('⚠️  Please run this SQL in Supabase dashboard:');
      console.log('='.repeat(50));
      console.log(createTableSQL);
      console.log('='.repeat(50));
      console.log('\nThen run this to grant admin access:');
      console.log(`INSERT INTO user_permissions (clerk_user_id, user_role, permissions) VALUES ('${clerkUserId}', 'admin', '{"cms_access": true}') ON CONFLICT (clerk_user_id) DO NOTHING;`);

      throw new Error('Table does not exist - please create it manually as shown above');
    }

    // Step 5: Create sample customer permissions
    console.log('� Adding sample customer permissions...');
    await supabase
      .from('user_permissions')
      .upsert({
        clerk_user_id: 'sample_customer_001',
        user_role: 'customer',
        permissions: {
          account_view: true,
          orders_view: true,
          orders_history: true,
          support_access: true,
          content_view: true
        }
      });

    // Step 6: Verify setup
    console.log('� Verifying setup...');
    const { data: adminPermissions, error: checkError } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (checkError || !adminPermissions) {
      throw new Error('Admin permissions not set correctly');
    }

    console.log('✅ Admin schema deployed successfully!');
    console.log('🎉 You are now set as admin with full CMS access');
    console.log('\n📊 Your admin permissions:');
    console.log('Role:', adminPermissions.user_role);
    console.log('Permissions:', JSON.stringify(adminPermissions.permissions, null, 2));

    console.log('\n🚀 Next steps:');
    console.log('1. Visit http://localhost:4448/studio to access admin dashboard');
    console.log('2. You should now have full CMS access');
    console.log('3. Create and publish blog posts through the interface');

  } catch (error) {
    console.error('❌ Error deploying admin schema:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if Supabase URL is correct');
    console.log('2. Verify your service key has admin privileges');
    console.log('3. Make sure database is accessible');

    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      console.log('\n📝 You may need to run these commands manually in Supabase SQL Editor:');
      console.log('- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
      console.log('- Copy commands from supabase/user-permissions-schema.sql');
      console.log('- Execute each command');
    }
  }
}

// Run the deployment
deployAdminSchema();
