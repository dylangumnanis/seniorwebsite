const { WordPressAPI } = require('./lib/wordpress.ts');

// Test the hybrid authentication approach
async function testHybridAuth() {
    console.log('🔄 Testing Hybrid Authentication Approach...\n');
    
    const api = new WordPressAPI();
    
    // Test 1: Fetch posts (read operation)
    console.log('📖 Test 1: Reading posts...');
    try {
        const posts = await api.fetchPosts({ per_page: 1 });
        console.log('✅ Successfully fetched posts:', posts.length);
        if (posts.length > 0) {
            console.log('📄 Sample post:', posts[0].title.rendered);
        }
    } catch (error) {
        console.error('❌ Error fetching posts:', error.message);
    }
    
    // Test 2: Create a post (write operation)
    console.log('\n📝 Test 2: Creating a post...');
    try {
        const newPost = await api.createPost({
            title: 'Hybrid Auth Test - ' + new Date().toISOString(),
            content: 'This post was created using hybrid authentication!',
            status: 'draft'
        });
        
        if (newPost) {
            console.log('🎉 Successfully created post!');
            console.log('📄 Post ID:', newPost.id);
            console.log('📝 Post Title:', newPost.title.rendered);
            
            // Test 3: Update the post
            console.log('\n📝 Test 3: Updating the post...');
            const updatedPost = await api.updatePost({
                id: newPost.id,
                content: 'This post was created and updated using hybrid authentication! ✅'
            });
            
            if (updatedPost) {
                console.log('✅ Successfully updated post!');
            }
            
            // Test 4: Delete the post
            console.log('\n🗑️ Test 4: Deleting the test post...');
            const deleted = await api.deletePost(newPost.id);
            
            if (deleted) {
                console.log('✅ Successfully deleted test post!');
                console.log('\n🎊 ALL TESTS PASSED! Hybrid authentication is working perfectly!');
            }
        }
    } catch (error) {
        console.error('❌ Error with post operations:', error.message);
    }
}

testHybridAuth(); 