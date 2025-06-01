import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../lib/mongodb';

export async function GET() {
  const { db } = await connectToDatabase();
  const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(posts);
}

function isAdmin(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  return password === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { db } = await connectToDatabase();
  const data = await req.json();
  const now = new Date();
  const post = {
    ...data,
    createdAt: now,
    updatedAt: now,
    isDraft: data.isDraft ?? false,
  };
  const result = await db.collection('posts').insertOne(post);
  return NextResponse.json({ insertedId: result.insertedId });
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { db } = await connectToDatabase();
  const data = await req.json();
  if (!data._id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
  const { _id, ...update } = data;
  update.updatedAt = new Date();
  await db.collection('posts').updateOne({ _id: new (await import('mongodb')).ObjectId(_id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { db } = await connectToDatabase();
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
  await db.collection('posts').deleteOne({ _id: new (await import('mongodb')).ObjectId(_id) });
  return NextResponse.json({ success: true });
} 