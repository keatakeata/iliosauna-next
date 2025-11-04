import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const query = `*[_type == "ghlProduct" && slug.current == $slug && isActive == true][0] {
      _id,
      ghlProductId,
      name,
      slug,
      description,
      price,
      salePrice,
      images,
      category,
      features,
      variants,
      ghlVariants,
      inStock,
      stockCount,
      allowOutOfStockPurchase,
      productCollection,
      specifications,
      seoTitle,
      seoDescription,
      badge,
      taxable,
      isActive
    }`;

    const product = await sanityClient.fetch(query, { slug });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
