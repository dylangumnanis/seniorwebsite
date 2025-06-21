import { NextRequest, NextResponse } from 'next/server';
import { customWpApi } from '@/lib/wordpress-custom';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Slug parameter is required'
      }, { status: 400 });
    }

    const post = await customWpApi.fetchPostBySlug(slug);

    if (!post) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error(`Blog post API error for slug ${params?.slug}:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blog post',
      details: 'Check WordPress API connection and configuration'
    }, { status: 500 });
  }
} 