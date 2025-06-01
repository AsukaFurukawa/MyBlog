import { NextResponse } from 'next/server';
import { BlogPost, BlogDraft } from '@/types/blog';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

// UUID generator for consistent ID generation
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// In-memory storage for development (replace with database in production)
let posts: (BlogPost | BlogDraft)[] = [];
const POSTS_FILE = join(process.cwd(), 'dev_posts.json');

// Initialize posts from file if available (development only)
async function initializePosts() {
  if (posts.length === 0) {
    try {
      const fileContent = await readFile(POSTS_FILE, 'utf-8');
      posts = JSON.parse(fileContent);
      console.log('Loaded posts from file:', posts.length);
    } catch (error) {
      console.log('No existing posts file found, starting fresh');
      posts = [];
    }
  }
}

// Save posts to file (development only)
async function savePosts() {
  try {
    await writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
    console.log('Saved posts to file:', posts.length);
  } catch (error) {
    console.error('Error saving posts to file:', error);
  }
}

export async function GET(request: Request) {
  await initializePosts(); // Ensure posts are loaded
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const isDraft = searchParams.get('isDraft') === 'true';

  console.log('API GET request - ID:', id, 'isDraft:', isDraft);
  console.log('Current posts in memory:', posts.length, posts.map(p => ({ id: p.id, title: p.title, isDraft: p.isDraft })));

  if (id) {
    const post = posts.find(p => p.id === id);
    console.log('Looking for post with ID:', id, 'Found:', post ? 'Yes' : 'No');
    if (!post) {
      console.log('Post not found, returning 404');
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    console.log('Returning post:', post.title);
    return NextResponse.json(post);
  }

  const filteredPosts = posts.filter(p => p.isDraft === isDraft);
  console.log('Returning filtered posts:', filteredPosts.length);
  return NextResponse.json(filteredPosts);
}

export async function POST(request: Request) {
  await initializePosts(); // Ensure posts are loaded
  
  const post = await request.json();
  console.log('POST request received for post:', post.title);
  
  // Validate required fields
  if (!post.title || !post.content) {
    return NextResponse.json(
      { error: 'Title and content are required' },
      { status: 400 }
    );
  }

  // Generate slug from title
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newPost: BlogPost | BlogDraft = {
    ...post,
    id: uuidv4(),
    slug,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
    autoSaved: false
  };

  posts.push(newPost);
  await savePosts(); // Save to file
  console.log('Post added, total posts:', posts.length);
  return NextResponse.json(newPost);
}

export async function PUT(request: Request) {
  await initializePosts(); // Ensure posts are loaded
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Post ID is required' },
      { status: 400 }
    );
  }

  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  const updatedPost = await request.json();
  const existingPost = posts[postIndex];

  posts[postIndex] = {
    ...existingPost,
    ...updatedPost,
    updatedAt: new Date().toISOString(),
    lastEdited: new Date().toISOString()
  };

  await savePosts(); // Save to file
  return NextResponse.json(posts[postIndex]);
}

export async function DELETE(request: Request) {
  await initializePosts(); // Ensure posts are loaded
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Post ID is required' },
      { status: 400 }
    );
  }

  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  posts = posts.filter(p => p.id !== id);
  await savePosts(); // Save to file
  return NextResponse.json({ success: true });
} 