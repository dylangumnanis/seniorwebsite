import { Suspense } from 'react';
import { Container, Spinner, Center } from '@chakra-ui/react';
import BlogPostContent from './BlogPostContent';

// Enable dynamic params for posts that weren't pre-generated
export const dynamicParams = true;

// Add ISR revalidation
export const revalidate = 60; // Revalidate every 60 seconds

// Generate static params for blog posts
export async function generateStaticParams() {
  try {
    // Fetch posts from your custom WordPress API
    const response = await fetch('https://info.digitaltrailheads.com/wp-json/dt-sync/v1/posts?per_page=100', {
      headers: {
        'X-API-Key': 'dt-sync-ca08675eb5ec2c49f2cd06e139be7bd0'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      // Return empty array to enable fully dynamic rendering
      console.warn('WordPress API not available during build, enabling dynamic rendering');
      return [];
    }
    
    const data = await response.json();
    const posts = data.success ? data.data : data;
    
    // Only pre-generate a subset to reduce build time, others will be generated on-demand
    return posts.slice(0, 10).map((post: any) => ({
      slug: post.slug
    }));
  } catch (error) {
    console.warn('Error generating static params, enabling dynamic rendering:', error);
    // Return empty array to enable fully dynamic rendering
    return [];
  }
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense 
      fallback={
        <Container maxW="container.xl" py={20}>
          <Center>
            <Spinner size="xl" color="orange.500" />
          </Center>
        </Container>
      }
    >
      <BlogPostContent slug={params.slug} />
    </Suspense>
  );
} 