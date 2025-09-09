import { NextRequest, NextResponse } from 'next/server';
import { client as sanityClient } from '../../../../../sanity/lib/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, pageType } = body;

    if (!content || !pageType) {
      return NextResponse.json(
        { error: 'Missing required fields: content or pageType' },
        { status: 400 }
      );
    }

    console.log(`🔄 Syncing ${pageType} content to Sanity...`);

    // Handle different page types
    switch (pageType) {
      case 'our-story':
        return await syncOurStoryContent(content);
      default:
        return NextResponse.json(
          { error: `Unsupported page type: ${pageType}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Sync API error:', error);
    return NextResponse.json(
      { error: 'Failed to sync content' },
      { status: 500 }
    );
  }
}

async function syncOurStoryContent(content: any) {
  try {
    // Build the mutation payload
    const mutation = {
      _type: 'ourstory-final',
      _id: 'ourstory-page',
      ...content
    };

    // Perform the mutation
    const result = await sanityClient.createOrReplace(mutation);

    console.log('✅ Our Story content synced successfully:', result._id);

    return NextResponse.json({
      success: true,
      message: 'Content synced successfully',
      documentId: result._id
    });

  } catch (error) {
    console.error('❌ Sanity mutation failed:', error);
    return NextResponse.json(
      { error: 'Failed to update Sanity content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Content Sync API - POST to sync content',
    supportedPages: ['our-story']
  });
}
