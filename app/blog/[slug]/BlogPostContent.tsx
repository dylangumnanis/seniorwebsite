'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Image, Badge, Spinner, Center, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { WordPressPost } from '../../../lib/wordpress-custom';
import Link from 'next/link';

interface BlogPostContentProps {
  slug: string;
}

export default function BlogPostContent({ slug }: BlogPostContentProps) {
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Use the local API route instead of calling WordPress directly
        const response = await fetch(`/api/blog/${slug}`);
        const data = await response.json();
        
        if (response.ok && data.success && data.data) {
          setPost(data.data);
        } else {
          setError(data.error || 'Blog post not found.');
        }
      } catch (err) {
        setError('Failed to load blog post. Please try again later.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={20}>
        <Center>
          <Spinner size="xl" color="orange.500" />
        </Center>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxW="container.xl" py={20}>
        <Center flexDirection="column" gap={4}>
          <Text color="red.500" fontSize="lg">{error || 'Post not found'}</Text>
          <Link href="/blog" passHref>
            <Button leftIcon={<ArrowBackIcon />} colorScheme="orange" variant="outline">
              Back to Blog
            </Button>
          </Link>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={20}>
      <Link href="/blog" passHref>
        <Button 
          leftIcon={<ArrowBackIcon />} 
          variant="ghost" 
          color="orange.500"
          mb={8}
          _hover={{ bg: 'orange.50' }}
        >
          Back to Blog
        </Button>
      </Link>

      <article>
        {/* Featured Image */}
        {post.featured_image_url && (
          <Image
            src={post.featured_image_url}
            alt={post.title.rendered}
            width="100%"
            height="400px"
            objectFit="cover"
            borderRadius="lg"
            mb={8}
          />
        )}

        {/* Meta Information */}
        <Box mb={6}>
          <Badge colorScheme="orange" mb={2}>
            {new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
          <Text color="gray.600" fontSize="sm">
            By Author
          </Text>
        </Box>

        {/* Title */}
        <Heading 
          as="h1" 
          size="2xl" 
          mb={8}
          lineHeight="1.2"
          color="gray.800"
        >
          {post.title.rendered}
        </Heading>

        {/* Content */}
        <Box 
          className="wordpress-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          sx={{
            '& p': {
              marginBottom: '1.5rem',
              lineHeight: '1.7',
              fontSize: 'lg',
              color: 'gray.700'
            },
            '& h2': {
              fontSize: '2xl',
              fontWeight: 'bold',
              marginTop: '2rem',
              marginBottom: '1rem',
              color: 'gray.800'
            },
            '& h3': {
              fontSize: 'xl',
              fontWeight: 'semibold',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              color: 'gray.800'
            },
            '& ul, & ol': {
              marginBottom: '1.5rem',
              paddingLeft: '2rem'
            },
            '& li': {
              marginBottom: '0.5rem',
              lineHeight: '1.6'
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'orange.300',
              paddingLeft: '1rem',
              marginY: '1.5rem',
              fontStyle: 'italic',
              color: 'gray.600'
            },
            '& img': {
              borderRadius: 'md',
              marginY: '1.5rem'
            }
          }}
        />

        {/* Share/Back Section */}
        <Box mt={12} pt={8} borderTop="1px solid" borderColor="gray.200">
          <Link href="/blog" passHref>
            <Button colorScheme="orange" size="lg">
              ← Read More Articles
            </Button>
          </Link>
        </Box>
      </article>
    </Container>
  );
} 