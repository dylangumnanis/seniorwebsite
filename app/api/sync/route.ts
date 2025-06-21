import { NextRequest, NextResponse } from 'next/server';
import { ContentSyncManager } from '@/lib/content-sync';

const syncManager = new ContentSyncManager();

export async function GET() {
  try {
    const posts = await syncManager.getAllLocalPosts();
    return NextResponse.json({ 
      success: true, 
      data: posts,
      message: 'Local posts retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, slug } = body;

    switch (action) {
      case 'sync_all':
        const syncResult = await syncManager.fullSync();
        return NextResponse.json({
          success: true,
          data: syncResult,
          message: 'Bidirectional sync completed'
        });

      case 'sync_from_wordpress':
        const pullResult = await syncManager.syncFromWordPress();
        return NextResponse.json({
          success: true,
          data: pullResult,
          message: 'WordPress sync completed'
        });

      case 'sync_to_wordpress':
        // Test authentication first
        const authTestBulk = await testWordPressAuth();
        if (!authTestBulk.success) {
          return NextResponse.json({
            success: false,
            error: `WordPress authentication failed: ${authTestBulk.error}`,
            auth_failed: true
          }, { status: 401 });
        }

        const bulkPushResult = await syncManager.syncToWordPress();
        return NextResponse.json({
          success: true,
          data: bulkPushResult,
          message: `Successfully pushed all local posts to WordPress`
        });

      case 'push_to_wordpress':
        if (!slug) {
          return NextResponse.json({
            success: false,
            error: 'Slug is required for push_to_wordpress action'
          }, { status: 400 });
        }

        // Test authentication first
        const authTest = await testWordPressAuth();
        if (!authTest.success) {
          return NextResponse.json({
            success: false,
            error: `WordPress authentication failed: ${authTest.error}`,
            auth_failed: true
          }, { status: 401 });
        }

        const pushResult = await syncManager.syncToWordPress();
        return NextResponse.json({
          success: true,
          data: pushResult,
          message: `Successfully pushed posts to WordPress`
        });

      case 'test_auth':
        const testResult = await testWordPressAuth();
        return NextResponse.json({
          success: testResult.success,
          wordpress_auth: testResult.success,
          message: testResult.success ? 'WordPress authentication working' : 'WordPress authentication failed',
          error: testResult.error
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: sync_all, sync_from_wordpress, sync_to_wordpress, push_to_wordpress, test_auth'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in sync API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Test WordPress authentication using custom API
async function testWordPressAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    // Import custom WordPress API
    const { customWpApi } = await import('@/lib/wordpress-custom');
    
    // Test connection using health check
    const healthCheck = await customWpApi.healthCheck();
    
    if (!healthCheck.success) {
      return { success: false, error: 'Health check failed' };
    }
    
    // Try to fetch posts to test read access
    const posts = await customWpApi.fetchPosts({ per_page: 1 });
    
    if (!posts) {
      return { success: false, error: 'Unable to fetch posts' };
    }
    
    // Try to create a test draft to verify write access
    const testPost = {
      title: 'Auth Test - ' + Date.now(),
      content: 'Testing authentication with custom API',
      status: 'draft' as const
    };
    
    const createdPost = await customWpApi.createPost(testPost);
    
    if (createdPost) {
      // Clean up the test post
      await customWpApi.deletePost(createdPost.id, true);
      return { success: true };
    } else {
      return { success: false, error: 'Unable to create test post' };
    }
  } catch (error) {
    console.error('WordPress auth test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication test failed' 
    };
  }
} 