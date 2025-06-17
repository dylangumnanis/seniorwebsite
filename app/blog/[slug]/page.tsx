import { Suspense } from 'react';
import { Container, Spinner, Center } from '@chakra-ui/react';
import BlogPostContent from './BlogPostContent';

// Generate static params for blog posts
export async function generateStaticParams() {
  try {
    // Fetch posts from WordPress API to get actual slugs
    const WORDPRESS_API_URL = 'https://info.digitaltrailheads.com/wp-json/wp/v2';
    const response = await fetch(`${WORDPRESS_API_URL}/posts?per_page=100`);
    
    if (!response.ok) {
      // Fallback to demo slugs if WordPress is not available
      return [
        { slug: 'welcome-to-senior-tech-connect' },
        { slug: 'essential-technology-skills-seniors' },
        { slug: 'success-story-margaret-video-calling' },
      ];
    }
    
    const posts = await response.json();
    return posts.map((post: any) => ({
      slug: post.slug
    }));
  } catch (error) {
    console.warn('Error generating static params, using fallback:', error);
    // Fallback to demo slugs
    return [
      { slug: 'welcome-to-senior-tech-connect' },
      { slug: 'essential-technology-skills-seniors' },
      { slug: 'success-story-margaret-video-calling' },
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