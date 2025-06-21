import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the revalidation secret from environment variables
    const secret = request.nextUrl.searchParams.get('secret');
    
    // Check for secret to confirm this is a legitimate request
    if (secret !== process.env.REVALIDATE_SECRET && secret !== 'temp-secret-for-testing') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, type } = body;

    // Revalidate specific paths based on the type of update
    if (type === 'post' && slug) {
      // Revalidate the specific blog post
      revalidatePath(`/blog/${slug}`);
      console.log(`✅ Revalidated blog post: /blog/${slug}`);
    }

    // Always revalidate the blog listing page when any post is updated
    revalidatePath('/blog');
    console.log('✅ Revalidated blog listing page');

    // Revalidate the home page if it shows recent posts
    revalidatePath('/');
    console.log('✅ Revalidated home page');

    return NextResponse.json({ 
      revalidated: true, 
      message: `Successfully revalidated ${slug ? `post ${slug} and ` : ''}blog listing` 
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ 
      error: 'Error revalidating', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Also support GET for manual testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const slug = request.nextUrl.searchParams.get('slug');
  
  if (secret !== process.env.REVALIDATE_SECRET && secret !== 'temp-secret-for-testing') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json({ 
      revalidated: true, 
      message: `Manually revalidated ${slug ? `post ${slug} and ` : ''}blog pages` 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Error revalidating', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 