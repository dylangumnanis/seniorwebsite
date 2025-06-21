import { NextRequest, NextResponse } from 'next/server';
import { customWpApi } from '@/lib/wordpress-custom';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get('per_page') || '9');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const posts = await customWpApi.fetchPosts({
      per_page: perPage,
      page,
      search,
      status
    });

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length
    });

  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blog posts',
      details: 'Check WordPress API connection and configuration'
    }, { status: 500 });
  }
} 