import { NextResponse } from 'next/server';
import { client } from '../../../../../sanity/lib/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Fetch the specific blog post from Sanity
    const postQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      body,
      tags,
      readingTime,
      categories[]->{
        _id,
        title,
        slug,
        color
      },
      author->{
        name,
        slug,
        image,
        role,
        bio,
        email,
        socialLinks
      },
      "relatedPosts": *[_type == "blogPost" && slug.current != $slug][0...3] {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        publishedAt
      }
    }`;

    const post = await client.fetch(postQuery, { slug });

    if (!post) {
      return NextResponse.json({ 
        error: 'Blog post not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('API: Error fetching blog post:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch blog post' 
    }, { status: 500 });
  }
}