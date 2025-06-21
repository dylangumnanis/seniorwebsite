'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Grid, Card, CardBody, Image, Badge, Spinner, Center } from '@chakra-ui/react';
import { WordPressPost } from '../../lib/wordpress-custom';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Check if we're in development or production
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        if (isDevelopment) {
          // In development, use the local API route with better error handling
          try {
            const response = await fetch('/api/blog/posts');
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            
            if (data.success && data.data) {
              setPosts(data.data);
              return;
            } else {
              throw new Error(data.error || 'Failed to fetch posts from local API');
            }
          } catch (localApiError) {
            console.warn('Local API failed, falling back to direct WordPress API:', localApiError);
            // Fall through to direct WordPress API call
          }
        }
        
        // Try custom API first, then fall back to standard WordPress API
        let data;
        let customApiWorked = false;
        
        try {
          // Try custom API first
          const customResponse = await fetch('https://info.digitaltrailheads.com/wp-json/dt-sync/v1/posts?per_page=9', {
          headers: {
              'X-API-Key': 'dt-sync-ca08675eb5ec2c49f2cd06e139be7bd0',
              'Accept': 'application/json',
          }
        });
          
          if (customResponse.ok) {
            const customData = await customResponse.json();
            if (customData.success && customData.data) {
              data = customData.data;
              customApiWorked = true;
            } else {
              throw new Error('Custom API returned unexpected format');
            }
          } else {
            throw new Error(`Custom API returned ${customResponse.status}`);
          }
        } catch (customApiError) {
          console.warn('Custom API failed, trying standard WordPress API:', customApiError);
          
          // Fall back to standard WordPress API
          const standardResponse = await fetch('https://info.digitaltrailheads.com/wp-json/wp/v2/posts?per_page=9', {
            headers: {
              'Accept': 'application/json',
            }
          });
          
          if (!standardResponse.ok) {
            throw new Error(`Standard WordPress API returned ${standardResponse.status}: ${standardResponse.statusText}`);
          }
          
          data = await standardResponse.json();
          console.log('✅ Successfully fetched posts from standard WordPress API');
        }
        
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else if (customApiWorked && data) {
          setPosts(data);
        } else {
          throw new Error('No posts returned from WordPress APIs');
        }
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load blog posts: ${errorMessage}`);
        console.error('Error fetching posts:', err);
        
        // Set some sample posts for development if WordPress is unreachable
        if (process.env.NODE_ENV === 'development') {
          console.log('Setting sample posts for development...');
          setPosts([
            {
              id: 1,
              title: { rendered: 'Welcome to Our Blog' },
              content: { rendered: '<p>This is a sample blog post for development.</p>' },
              excerpt: { rendered: '<p>Sample excerpt...</p>' },
              slug: 'welcome-to-our-blog',
              date: new Date().toISOString(),
              modified: new Date().toISOString(),
              status: 'publish' as const,
              author: 1,
              featured_media: 0,
              categories: [],
              tags: [],
              link: '/blog/welcome-to-our-blog'
            }
          ]);
          setError(null); // Clear error for dev mode
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Container maxW="container.xl" py={20}>
        <Center>
          <Spinner size="xl" color="orange.500" />
          <Text ml={4}>Loading blog posts...</Text>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={20}>
        <Center flexDirection="column">
          <Text color="red.500" fontSize="lg" mb={4}>{error}</Text>
          <Text color="gray.500" fontSize="sm">
            {process.env.NODE_ENV === 'development' 
              ? 'This is normal in development - the blog will work properly when deployed.'
              : 'Please check your WordPress configuration and try again.'}
          </Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={20}>
      <Box textAlign="center" mb={16}>
        <Heading 
          as="h1" 
          size="2xl" 
          mb={4}
          bgGradient="linear(to-r, orange.400, orange.600)"
          bgClip="text"
        >
          Latest News & Updates
        </Heading>
        <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
          Stay informed with the latest technology tips, success stories, and program updates from our community.
        </Text>
      </Box>

      {posts.length === 0 ? (
        <Center>
          <Text fontSize="lg" color="gray.500">
            No blog posts available yet. Check back soon!
          </Text>
        </Center>
      ) : (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
          {posts.map((post) => (
            <Card key={post.id} overflow="hidden" shadow="lg" _hover={{ transform: 'translateY(-4px)', transition: 'all 0.3s' }}>
              {post.featured_image_url && (
                <Image
                  src={post.featured_image_url}
                  alt={post.title.rendered}
                  height="200px"
                  objectFit="cover"
                  width="100%"
                />
              )}
              <CardBody>
                <Badge colorScheme="orange" mb={2}>
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Badge>
                <Heading as="h3" size="md" mb={3} noOfLines={2}>
                  {post.title.rendered}
                </Heading>
                <Text 
                  color="gray.600" 
                  noOfLines={3}
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
                <Link href={`/blog/${post.slug}`} passHref>
                  <Text 
                    as="a" 
                    color="orange.500" 
                    fontWeight="semibold" 
                    mt={4} 
                    display="inline-block"
                    _hover={{ color: 'orange.600' }}
                  >
                    Read More →
                  </Text>
                </Link>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
} 