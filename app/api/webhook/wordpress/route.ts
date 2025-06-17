import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret to ensure it's from WordPress
    const webhookSecret = process.env.WORDPRESS_WEBHOOK_SECRET;
    const providedSecret = request.headers.get('x-webhook-secret');

    if (!webhookSecret || !providedSecret || webhookSecret !== providedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the webhook payload
    const payload = await request.json();
    
    // Log the webhook for debugging
    console.log('WordPress webhook received:', {
      action: payload.action,
      post_id: payload.post?.ID,
      post_title: payload.post?.post_title,
      post_status: payload.post?.post_status,
      timestamp: new Date().toISOString()
    });

    // Only trigger rebuild for published posts
    if (payload.post?.post_status === 'publish' || payload.action === 'post_updated') {
      await triggerGitHubRebuild();
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      triggered_rebuild: payload.post?.post_status === 'publish' || payload.action === 'post_updated'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

async function triggerGitHubRebuild() {
  const githubToken = process.env.GITHUB_TOKEN;
  const repoOwner = process.env.GITHUB_REPO_OWNER;
  const repoName = process.env.GITHUB_REPO_NAME;

  if (!githubToken || !repoOwner || !repoName) {
    console.error('Missing GitHub configuration for webhook trigger');
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'wordpress-update',
          client_payload: {
            timestamp: new Date().toISOString(),
            source: 'wordpress-webhook'
          }
        })
      }
    );

    if (response.ok) {
      console.log('✅ GitHub Actions workflow triggered successfully');
    } else {
      console.error('Failed to trigger GitHub Actions:', await response.text());
    }
  } catch (error) {
    console.error('Error triggering GitHub Actions:', error);
  }
} 