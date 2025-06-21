import { NextRequest, NextResponse } from 'next/server';
import { customWpApi } from '@/lib/wordpress-custom';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Blog posts API called');
    
    const { searchParams } = new URL(request.url);
    const perPage = parseInt(searchParams.get('per_page') || '9');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || 'publish';

    // Test connection first
    const isConnected = await customWpApi.testConnection();
    if (!isConnected) {
      throw new Error('WordPress connection failed - check API configuration');
    }

    console.log(`📝 Fetching ${perPage} posts from WordPress...`);
    
    const posts = await customWpApi.fetchPosts({
      per_page: perPage,
      page,
      search,
      status
    });

    console.log(`✅ Successfully fetched ${posts.length} posts`);

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
      page,
      per_page: perPage
    });

  } catch (error) {
    console.error('❌ Blog posts API error:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: 'WordPress API connection failed. Check if the custom plugin is installed and API key is correct.',
      suggestions: [
        'Verify WordPress custom plugin is active',
        'Check API key configuration',
        'Test WordPress site connectivity',
        'Check server logs for more details'
      ]
    }, { status: 500 });
  }
} 