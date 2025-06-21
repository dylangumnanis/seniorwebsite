'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  HStack,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Input,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FiRefreshCcw, FiEdit, FiRefreshCw, FiDownload, FiUpload, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

interface SyncStatus {
  id?: number;
  title: string;
  slug: string;
  status: string;
  local_modified: string;
  wordpress_modified?: string;
  needsSync?: boolean;
}

interface SyncResult {
  success: boolean;
  action: 'create' | 'update' | 'skip' | 'conflict';
  message: string;
  conflicts?: string[];
}

interface LocalPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  status: 'publish' | 'draft' | 'private';
  excerpt?: string;
  author?: string;
  categories: string[];
  tags: string[];
}

export default function ContentManagementPage() {
  const [posts, setPosts] = useState<SyncStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<LocalPost | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [authStatus, setAuthStatus] = useState<'unknown' | 'working' | 'failed'>('unknown');
  const [syncQueue, setSyncQueue] = useState<string[]>([]);

  useEffect(() => {
    fetchSyncStatus();
    checkAuthStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching sync status...');
      
      const response = await fetch('/api/sync');
      console.log('📡 Sync API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Sync API error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Sync API data received:', data);
      
      if (data.success) {
        setPosts(data.data || []);
        console.log('✅ Posts loaded:', data.data?.length || 0);
      } else {
        throw new Error(data.error || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('❌ Error fetching sync status:', error);
      toast({
        title: 'Connection Error',
        description: `Failed to fetch sync status: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the browser console for details.`,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const performSync = async (action: string) => {
    try {
      setSyncing(true);
      setSyncResults(null);
      console.log('🔄 Performing sync action:', action);
      
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      console.log('📡 Sync POST response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Sync POST error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Sync POST data received:', data);
      
      if (data.success) {
        setSyncResults(data);
        toast({
          title: 'Sync Completed',
          description: data.message || 'Successfully synced content',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        await fetchSyncStatus(); // Refresh status
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('❌ Sync error:', error);
      toast({
        title: 'Sync Failed',
        description: `Sync operation failed: ${error instanceof Error ? error.message : 'Unknown error'}. Check browser console for details.`,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    } finally {
      setSyncing(false);
    }
  };

  const editPost = async (postId: number) => {
    try {
      // Load the post content from the local file
      const post = posts.find(p => p.id === postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // For now, open the file location
      toast({
        title: 'Edit Post',
        description: `Edit the file: content/posts/${postId}-${post.slug}.md`,
        status: 'info',
        duration: 8000,
        isClosable: true,
      });

      // Note: In VS Code/Cursor, you can Ctrl+P and type the filename to open it quickly
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open post for editing',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getSyncStatusBadge = (post: SyncStatus) => {
    if (!post.wordpress_modified) {
      return <Badge colorScheme="gray">Local Only</Badge>;
    }
    
    if (post.needsSync) {
      return <Badge colorScheme="orange">Needs Sync</Badge>;
    }
    
    return <Badge colorScheme="green">Synced</Badge>;
  };

  // Test WordPress authentication status
  const checkAuthStatus = async () => {
    try {
      console.log('🔄 Checking WordPress auth status...');
      
      // Add cache-busting to prevent redirect loops
      const timestamp = Date.now();
      const response = await fetch(`/api/test?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log('📡 Auth test response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Auth test error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Auth test data received:', data);
      
      setAuthStatus(data.success ? 'working' : 'failed');
      
      if (!data.success) {
        toast({
          title: 'WordPress Connection Failed',
          description: data.error || 'Could not connect to WordPress API. Check your configuration.',
          status: 'warning',
          duration: 8000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setAuthStatus('failed');
      
      // Don't show toast for redirect errors (likely caching issue)
      if (!(error instanceof Error && error.message.includes('Failed to fetch'))) {
        toast({
          title: 'WordPress Connection Test Failed',
          description: `Auth check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          status: 'error',
          duration: 8000,
          isClosable: true,
        });
      }
    }
  };

  const handleManualSync = async (postSlug: string) => {
    setSyncing(true);
    setSyncQueue(prev => [...prev, postSlug]);
    
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'push_to_wordpress',
          slug: postSlug
        }),
      });

            const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Sync Completed',
          description: `Successfully synced "${postSlug}" to WordPress!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        await fetchSyncStatus(); // Refresh the list
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Sync Failed',
        description: `Failed to sync "${postSlug}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSyncing(false);
      setSyncQueue(prev => prev.filter(slug => slug !== postSlug));
    }
  };

    const handleBulkSync = async () => {
    const localPosts = posts ? posts.filter(post => post.status === 'publish') : [];
    
    if (localPosts.length === 0) {
      toast({
        title: 'No Posts to Sync',
        description: 'No local posts found to sync to WordPress.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const confirmed = confirm(`Sync ${localPosts.length} local posts to WordPress?`);
    if (!confirmed) return;

    try {
      setSyncing(true);
      
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync_to_wordpress'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Bulk Sync Completed',
          description: result.message || 'Successfully synced all local posts to WordPress',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        await fetchSyncStatus();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Bulk Sync Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="orange.500" />
        </Flex>
      </Container>
    );
  }

  const localPosts = posts ? posts.filter(post => post.status === 'publish') : [];
  const wordpressPosts = posts ? posts.filter(post => post.status !== 'publish') : [];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading as="h1" size="xl">
              Content Management
            </Heading>
            <HStack spacing={4}>
              <Badge 
                colorScheme={authStatus === 'working' ? 'green' : authStatus === 'failed' ? 'red' : 'gray'}
                p={2}
              >
                WordPress: {authStatus === 'working' ? '✅ Connected' : authStatus === 'failed' ? '❌ Failed' : '⏳ Checking...'}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={checkAuthStatus}
                isLoading={authStatus === 'unknown'}
              >
                Test Connection
              </Button>
            </HStack>
          </Flex>
          <Text color="gray.600">
            Manage and sync your blog content between WordPress and your local workspace.
          </Text>
        </Box>

        {/* WordPress Connection Alert */}
        {authStatus === 'failed' && (
          <Alert status="error">
            <AlertIcon />
            <Box flex="1">
              <Text fontWeight="bold">WordPress Connection Failed</Text>
              <Text fontSize="sm">
                Cannot connect to WordPress API. This might be a browser caching issue.
                Try the "Clear Cache & Test" button or do a hard refresh (Ctrl+F5).
              </Text>
            </Box>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => {
                // Clear any cached responses
                if ('caches' in window) {
                  caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                  });
                }
                // Force page reload
                window.location.reload();
              }}
            >
              Clear Cache & Reload
            </Button>
          </Alert>
        )}

        {authStatus === 'working' && syncResults && (
          <Alert status="success">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">WordPress Connection Active</Text>
              <Text fontSize="sm">
                Successfully connected to WordPress API. All sync operations are available.
              </Text>
            </Box>
          </Alert>
        )}

        {/* Sync Controls */}
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Sync Controls
          </Heading>
          <HStack spacing={4} wrap="wrap">
            <Button
              leftIcon={<Icon as={FiDownload} />}
              colorScheme="blue"
              onClick={() => performSync('sync_from_wordpress')}
              isLoading={syncing}
              loadingText="Syncing..."
            >
              WordPress → Local
            </Button>
            <Button
              leftIcon={<Icon as={FiUpload} />}
              colorScheme="green"
              onClick={() => performSync('sync_to_wordpress')}
              isLoading={syncing}
              loadingText="Syncing..."
              isDisabled={authStatus === 'failed'}
            >
              Local → WordPress
            </Button>
            <Button
              leftIcon={<Icon as={FiRefreshCcw} />}
              colorScheme="orange"
              onClick={() => performSync('sync_all')}
              isLoading={syncing}
              loadingText="Syncing..."
            >
              Bi-directional Sync
            </Button>
            <Button
              leftIcon={<Icon as={FiRefreshCw} />}
              variant="outline"
              onClick={fetchSyncStatus}
              isLoading={loading}
            >
              Refresh Status
            </Button>
            <Button
              leftIcon={<Icon as={FiUpload} />}
              colorScheme="purple"
              onClick={handleBulkSync}
              isDisabled={syncing || localPosts.length === 0 || authStatus === 'failed'}
              isLoading={syncing}
              loadingText="Syncing..."
            >
              Sync All Local Posts ({localPosts.length})
            </Button>
          </HStack>
        </Box>

        {/* Sync Results */}
        {syncResults && (
          <Alert status="info">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Sync Results:</Text>
              <Text>{syncResults.message}</Text>
              {syncResults.data && Array.isArray(syncResults.data) && (
                <Text fontSize="sm" mt={2}>
                  Processed {syncResults.data.length} items
                </Text>
              )}
              {syncResults.data && typeof syncResults.data === 'object' && !Array.isArray(syncResults.data) && (
                <VStack align="start" spacing={1} mt={2} fontSize="sm">
                  {syncResults.data.fromWordPress && (
                    <Text>
                      WordPress → Local: {syncResults.data.fromWordPress.length} items processed
                    </Text>
                  )}
                  {syncResults.data.toWordPress && (
                    <Text>
                      Local → WordPress: {syncResults.data.toWordPress.length} items processed
                    </Text>
                  )}
                </VStack>
              )}
            </Box>
          </Alert>
        )}

        {/* Authentication Status */}
        <Box>
          <Heading as="h2" size="md" mb={4}>
            WordPress Custom API Status
          </Heading>
          <HStack spacing={4}>
            <Text>Status:</Text>
            <Badge 
              colorScheme={authStatus === 'working' ? 'green' : authStatus === 'failed' ? 'red' : 'yellow'}
            >
              {authStatus === 'working' ? '✅ Operational' : 
               authStatus === 'failed' ? '❌ Connection Issue' : '⏳ Checking...'}
            </Badge>
          </HStack>
          
          {authStatus === 'failed' && (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">WordPress API Connection Issue</Text>
                <Text>Unable to connect to WordPress custom API. Manual sync to WordPress is disabled.</Text>
                <Text mt={2}>
                  <strong>Check:</strong> WordPress plugin installed, API key configured correctly
                </Text>
              </Box>
            </Alert>
          )}
          
          {authStatus === 'working' && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Custom WordPress API Active</Text>
                <Text>✅ Full bi-directional sync is operational!</Text>
                <Text><strong>WordPress → Website:</strong> Automatic via webhooks</Text>
                <Text><strong>Website → WordPress:</strong> Manual push buttons available</Text>
              </Box>
            </Alert>
          )}
        </Box>

        {/* Posts Table */}
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Blog Posts ({posts ? posts.length : 0})
          </Heading>
          
          {!posts || posts.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">No local posts found</Text>
                <Text>Run a WordPress → Local sync to pull posts from your WordPress site.</Text>
              </Box>
            </Alert>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Status</Th>
                  <Th>Sync Status</Th>
                  <Th>Last Modified (Local)</Th>
                  <Th>Last Modified (WordPress)</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {posts && posts.map((post) => (
                  <Tr key={post.slug}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{post.title}</Text>
                        <Text fontSize="sm" color="gray.500">/{post.slug}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={post.status === 'publish' ? 'green' : 'gray'}
                        textTransform="capitalize"
                      >
                        {post.status}
                      </Badge>
                    </Td>
                    <Td>{getSyncStatusBadge(post)}</Td>
                    <Td>
                      <Text fontSize="sm">
                        {new Date(post.local_modified).toLocaleString()}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm">
                        {post.wordpress_modified 
                          ? new Date(post.wordpress_modified).toLocaleString()
                          : 'Never'
                        }
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          leftIcon={<Icon as={FiEdit} />}
                          onClick={() => editPost(post.id || 0)}
                        >
                          Edit
                        </Button>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        {post.status === 'publish' && (
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleManualSync(post.slug)}
                            isDisabled={syncing || syncQueue.includes(post.slug) || authStatus === 'failed'}
                            isLoading={syncQueue.includes(post.slug)}
                            loadingText="Syncing..."
                          >
                            🚀 Push to WordPress
                          </Button>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>

        {/* Conflict Resolution */}
        {syncResults?.data && Array.isArray(syncResults.data) && 
         syncResults.data.some((r: SyncResult) => r.action === 'conflict') && (
          <Alert status="warning">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Conflicts Detected!</Text>
              <Text>Some posts have conflicts that need manual resolution.</Text>
            </Box>
          </Alert>
        )}
      </VStack>

      {/* Edit Post Modal (placeholder) */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Post editing interface will be implemented here.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}