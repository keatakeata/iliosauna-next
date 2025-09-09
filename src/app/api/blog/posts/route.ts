import { NextResponse } from 'next/server';
import { client } from '../../../../../sanity/lib/client';

export async function GET() {
  try {
    // Fetch posts directly from Sanity on the server
    const postsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      tags,
      featured,
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
        image
      }
    }`;

    const categoriesQuery = `*[_type == "category"] | order(order asc) {
      _id,
      title,
      slug,
      color,
      "postCount": count(*[_type == "blogPost" && references(^._id)])
    }`;

    const [posts, categories] = await Promise.all([
      client.fetch(postsQuery),
      client.fetch(categoriesQuery)
    ]);

    return NextResponse.json({ posts, categories });
  } catch (error) {
    console.error('API: Error fetching blog posts:', error);
    return NextResponse.json({ 
      posts: [], 
      categories: [],
      error: 'Failed to fetch blog posts' 
    }, { status: 500 });
  }
}