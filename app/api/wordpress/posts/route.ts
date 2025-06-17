import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://info.digitaltrailheads.com/wp-json/wp/v2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    let url = `${WORDPRESS_API_URL}/posts?_embed=true`;
    
    // Add query parameters
    if (slug) {
      url += `&slug=${slug}`;
    }
    
    // Add other common parameters
    const perPage = searchParams.get('per_page') || '10';
    url += `&per_page=${perPage}`;
    
    if (searchParams.get('page')) {
      url += `&page=${searchParams.get('page')}`;
    }
    
    // Debug logging
    console.log('WordPress API URL:', WORDPRESS_API_URL);
    console.log('Full URL being fetched:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`WordPress API responded with status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Detailed error fetching WordPress posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch posts from WordPress', details: errorMessage },
      { status: 500 }
    );
  }
} 