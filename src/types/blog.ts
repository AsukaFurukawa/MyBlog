export type BlogCategory = 
  | 'tech'
  | 'idea'
  | 'abstract'
  | 'art'
  | 'finance'
  | 'project'
  | 'other';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  coverImage?: string;
  images: string[];
  publishedAt: string;
  updatedAt: string;
  isDraft: boolean;
  author: {
    name: string;
    avatar?: string;
  };
}

export interface BlogDraft extends Omit<BlogPost, 'publishedAt' | 'updatedAt'> {
  lastEdited: string;
  autoSaved: boolean;
} 