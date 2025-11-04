import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN!,
  useCdn: false
});

/**
 * DELETE /api/sanity/cleanup
 * Delete the old manually-created product that conflicts with GHL sync
 */
export async function DELETE(request: NextRequest) {
  try {
    // Find the old manually-created product
    const oldProduct = await sanityClient.fetch(
      `*[_type == "ghlProduct" && ghlProductId == "ghl-bucket-ladle-001"][0]`
    );

    if (!oldProduct) {
      return NextResponse.json({ message: 'Old product not found' }, { status: 404 });
    }

    console.log(`Deleting old product: ${oldProduct.name} (${oldProduct._id})`);

    // Delete it
    await sanityClient.delete(oldProduct._id);

    return NextResponse.json({
      success: true,
      deleted: {
        id: oldProduct._id,
        name: oldProduct.name,
        ghlProductId: oldProduct.ghlProductId
      }
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
