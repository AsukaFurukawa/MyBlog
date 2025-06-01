import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

let comments: Comment[] = [];

// File path for storing comments
const COMMENTS_FILE = path.join(process.cwd(), 'dev_comments.json');

// Initialize comments from file
function initializeComments() {
  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      const data = fs.readFileSync(COMMENTS_FILE, 'utf-8');
      comments = JSON.parse(data);
      console.log(`Loaded ${comments.length} comments from file`);
    } else {
      console.log('No comments file found, starting with empty array');
    }
  } catch (error) {
    console.error('Error loading comments:', error);
    comments = [];
  }
}

// Save comments to file
function saveComments() {
  try {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    console.log(`Saved ${comments.length} comments to file`);
  } catch (error) {
    console.error('Error saving comments:', error);
  }
}

// Initialize on first run
if (comments.length === 0) {
  initializeComments();
}

// Generate UUID
function generateId(): string {
  return 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Return only approved comments for the specific post
    const postComments = comments.filter(comment => 
      comment.postId === postId && comment.approved
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    console.log(`Found ${postComments.length} approved comments for post ${postId}`);
    
    return NextResponse.json(postComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, name, email, content } = body;

    if (!postId || !name || !email || !content) {
      return NextResponse.json(
        { error: 'All fields (postId, name, email, content) are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const newComment: Comment = {
      id: generateId(),
      postId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      approved: true // Auto-approve for now (in production, you might want moderation)
    };

    comments.push(newComment);
    saveComments();

    console.log(`New comment added for post ${postId} by ${name}`);
    
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    if (commentIndex === -1) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    comments.splice(commentIndex, 1);
    saveComments();

    console.log(`Comment ${commentId} deleted`);
    
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
} 