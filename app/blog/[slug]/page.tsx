import { Suspense } from 'react';
import { Container, Spinner, Center } from '@chakra-ui/react';
import BlogPostContent from './BlogPostContent';

// Generate static params for blog posts
export async function generateStaticParams() {
  try {
    // Fetch posts from your custom WordPress API
    const response = await fetch('https://info.digitaltrailheads.com/wp-json/dt-sync/v1/posts?per_page=100', {
      headers: {
        'X-API-Key': 'dt-sync-ca08675eb5ec2c49f2cd06e139be7bd0'
      }
    });
    
    if (!response.ok) {
      // Fallback to known slugs if WordPress is not available
      return [
        { slug: 'hello-world' },
        { slug: 'welcome-to-our-blog' },
        { slug: 'test-new-post-june-19th' },
      ];
    }
    
    const data = await response.json();
    const posts = data.success ? data.data : data;
    
    return posts.map((post: any) => ({
      slug: post.slug
    }));
  } catch (error) {
    console.warn('Error generating static params, using fallback:', error);
    // Fallback to known slugs from your WordPress
    return [
      { slug: 'hello-world' },
      { slug: 'welcome-to-our-blog' },
      { slug: 'test-new-post-june-19th' },
    ];
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