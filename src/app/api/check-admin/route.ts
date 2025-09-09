import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const clerkUserId = request.nextUrl.searchParams.get('user_id');

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    // Check permissions using raw SQL to avoid TypeScript issues
    const { data, error } = await supabase
      .from('user_permissions')
      .select('user_role, permissions')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      console.error('Permission check error:', error);
      return NextResponse.json({ isAdmin: false }, { status: 200 });
    }

    // Check if user is admin
    const isAdmin = data.user_role === 'admin' ||
                   (data.permissions as any)?.cms_access === true;

    return NextResponse.json({ isAdmin });

  } catch (error) {
    console.error('Admin check API error:', error);
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}
