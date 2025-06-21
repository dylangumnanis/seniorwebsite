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

        {/* Content with comprehensive WordPress styling */}
        <Box 
          className="wordpress-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          sx={{
            // Basic text styling
            '& p': {
              marginBottom: '1.5rem',
              lineHeight: '1.7',
              fontSize: 'lg',
              color: 'gray.700'
            },
            
            // Headings
            '& h1': {
              fontSize: '3xl',
              fontWeight: 'bold',
              marginTop: '2.5rem',
              marginBottom: '1.5rem',
              color: 'gray.800',
              lineHeight: '1.2'
            },
            '& h2': {
              fontSize: '2xl',
              fontWeight: 'bold',
              marginTop: '2rem',
              marginBottom: '1rem',
              color: 'gray.800',
              lineHeight: '1.3'
            },
            '& h3': {
              fontSize: 'xl',
              fontWeight: 'semibold',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              color: 'gray.800',
              lineHeight: '1.4'
            },
            '& h4': {
              fontSize: 'lg',
              fontWeight: 'semibold',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
              color: 'gray.800'
            },
            '& h5': {
              fontSize: 'md',
              fontWeight: 'semibold',
              marginTop: '1rem',
              marginBottom: '0.5rem',
              color: 'gray.800'
            },
            '& h6': {
              fontSize: 'sm',
              fontWeight: 'semibold',
              marginTop: '1rem',
              marginBottom: '0.5rem',
              color: 'gray.600'
            },
            
            // Lists
            '& ul, & ol': {
              marginBottom: '1.5rem',
              paddingLeft: '2rem',
              lineHeight: '1.6'
            },
            '& ul': {
              listStyleType: 'disc'
            },
            '& ol': {
              listStyleType: 'decimal'
            },
            '& li': {
              marginBottom: '0.5rem',
              lineHeight: '1.6',
              color: 'gray.700'
            },
            '& li ul, & li ol': {
              marginTop: '0.5rem',
              marginBottom: '0.5rem'
            },
            
            // Links
            '& a': {
              color: 'orange.500',
              textDecoration: 'underline',
              _hover: {
                color: 'orange.600',
                textDecoration: 'none'
              }
            },
            
            // Blockquotes
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'orange.300',
              paddingLeft: '1.5rem',
              paddingY: '1rem',
              marginY: '1.5rem',
              fontStyle: 'italic',
              fontSize: 'lg',
              color: 'gray.600',
              backgroundColor: 'gray.50',
              borderRadius: 'md'
            },
            
            // Images and figures
            '& img': {
              borderRadius: 'md',
              marginY: '1.5rem',
              maxWidth: '100%',
              height: 'auto',
              boxShadow: 'sm'
            },
            '& figure': {
              marginY: '2rem',
              textAlign: 'center'
            },
            '& figcaption': {
              fontSize: 'sm',
              color: 'gray.500',
              marginTop: '0.5rem',
              fontStyle: 'italic'
            },
            
            // WordPress block alignments
            '& .aligncenter': {
              textAlign: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block'
            },
            '& .alignleft': {
              float: 'left',
              marginRight: '1.5rem',
              marginBottom: '1rem'
            },
            '& .alignright': {
              float: 'right',
              marginLeft: '1.5rem',
              marginBottom: '1rem'
            },
            
            // WordPress buttons
            '& .wp-block-button': {
              marginY: '1.5rem'
            },
            '& .wp-block-button__link': {
              backgroundColor: 'orange.500',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 'md',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: 'semibold',
              _hover: {
                backgroundColor: 'orange.600'
              }
            },
            
            // Code blocks
            '& code': {
              backgroundColor: 'gray.100',
              padding: '2px 6px',
              borderRadius: 'sm',
              fontSize: 'sm',
              fontFamily: 'monospace',
              color: 'gray.800'
            },
            '& pre': {
              backgroundColor: 'gray.900',
              color: 'gray.100',
              padding: '1.5rem',
              borderRadius: 'md',
              overflow: 'auto',
              marginY: '1.5rem',
              fontSize: 'sm',
              lineHeight: '1.5'
            },
            '& pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              color: 'inherit'
            },
            
            // Tables
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginY: '1.5rem',
              border: '1px solid',
              borderColor: 'gray.200'
            },
            '& th, & td': {
              padding: '0.75rem',
              textAlign: 'left',
              borderBottom: '1px solid',
              borderColor: 'gray.200'
            },
            '& th': {
              backgroundColor: 'gray.50',
              fontWeight: 'semibold',
              color: 'gray.700'
            },
            
            // WordPress columns
            '& .wp-block-columns': {
              display: 'flex',
              flexWrap: 'wrap',
              marginY: '2rem',
              gap: '2rem'
            },
            '& .wp-block-column': {
              flex: '1',
              minWidth: '0'
            },
            
            // WordPress cover block
            '& .wp-block-cover': {
              position: 'relative',
              marginY: '2rem',
              borderRadius: 'md',
              overflow: 'hidden'
            },
            
            // WordPress media text
            '& .wp-block-media-text': {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
              marginY: '2rem'
            },
            
            // WordPress quote
            '& .wp-block-quote': {
              borderLeft: '4px solid',
              borderColor: 'orange.400',
              paddingLeft: '1.5rem',
              marginY: '2rem',
              fontStyle: 'italic',
              fontSize: 'xl'
            },
            
            // WordPress separator
            '& .wp-block-separator': {
              border: 'none',
              borderTop: '2px solid',
              borderColor: 'gray.300',
              marginY: '3rem',
              width: '100px',
              marginX: 'auto'
            },
            
            // Responsive adjustments
            '@media (max-width: 768px)': {
              '& .wp-block-columns': {
                flexDirection: 'column'
              },
              '& .alignleft, & .alignright': {
                float: 'none',
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'block',
                textAlign: 'center'
              }
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