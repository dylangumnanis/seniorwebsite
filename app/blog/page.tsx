import { Box, Container, Heading, Text, Grid, Card, CardBody, Image, Badge } from '@chakra-ui/react';
import { WordPressPost } from '../../lib/wordpress-custom';
import Link from 'next/link';

// Add ISR revalidation for the blog listing
export const revalidate = 60; // Revalidate every 60 seconds

async function getPosts(): Promise<WordPressPost[]> {
  try {
    // Try custom API first
    const customResponse = await fetch('https://info.digitaltrailheads.com/wp-json/dt-sync/v1/posts?per_page=9', {
      headers: {
        'X-API-Key': 'dt-sync-ca08675eb5ec2c49f2cd06e139be7bd0',
        'Accept': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (customResponse.ok) {
      const customData = await customResponse.json();
      if (customData.success && customData.data) {
        return customData.data;
      }
    }
    
    // Fall back to standard WordPress API
    const standardResponse = await fetch('https://info.digitaltrailheads.com/wp-json/wp/v2/posts?per_page=9', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }
    });
    
    if (standardResponse.ok) {
      const data = await standardResponse.json();
      return Array.isArray(data) ? data : [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

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
        <Box textAlign="center">
          <Text fontSize="lg" color="gray.500">
            No blog posts available yet. Check back soon!
          </Text>
        </Box>
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