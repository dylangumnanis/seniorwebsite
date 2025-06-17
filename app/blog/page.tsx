'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Grid, Card, CardBody, Image, Badge, Spinner, Center } from '@chakra-ui/react';
import { wpApi, WordPressPost } from '../../lib/wordpress';
import Link from 'next/link';

export default function BlogPage() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await wpApi.fetchPosts({ per_page: 9 });
        setPosts(fetchedPosts);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error('Error fetching posts:', err);
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
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={20}>
        <Center>
          <Text color="red.500" fontSize="lg">{error}</Text>
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
              {post._embedded?.['wp:featuredmedia']?.[0] && (
                <Image
                  src={post._embedded['wp:featuredmedia'][0].source_url}
                  alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
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