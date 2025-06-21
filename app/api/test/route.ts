import { NextRequest, NextResponse } from 'next/server';
import { customWpApi } from '@/lib/wordpress-custom';

export async function GET() {
  try {
    // Test the WordPress API connection
    const healthCheck = await customWpApi.healthCheck();
    
    if (healthCheck.success) {
      // Try to fetch a small number of posts to verify read access
      const posts = await customWpApi.fetchPosts({ per_page: 1 });
      
      return NextResponse.json({
        success: true,
        message: 'WordPress API connection successful',
        data: {
          health: healthCheck,
          posts_count: posts.length,
          api_available: true
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'WordPress API health check failed',
        error: healthCheck.message
      }, { status: 503 });
    }
  } catch (error) {
    console.error('API test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'WordPress API connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Test POST is working',
      received: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to parse JSON',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
} 