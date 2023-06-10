import fs from 'fs';
import path from 'path';
import { Post } from '../posts/meta';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export type PostContent = {
  readonly date: string;
  readonly title: string;
  readonly slug: string;
  readonly tags?: string[];
};

let postCache: PostContent[];

export function listPostFileNames() {
  return fs.readdirSync(postsDirectory).filter((i) => i.endsWith('.mdx'));
}

function fetchPostContent(): PostContent[] {
  if (postCache) {
    return postCache;
  }
  // Get file names under /posts
  const allPostsData = listPostFileNames().map((fileName) => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterData = Post.Meta[fileName as Post.FileName];
    const slug = fileName.replace(/\.mdx$/, '');

    // Validate slug string
    if (matterData.slug !== slug) {
      throw new Error('slug field not match with the path of its content source');
    }

    return matterData;
  });
  // Sort posts by date
  postCache = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  return postCache;
}

export function countPosts(tag?: string): number {
  return fetchPostContent().filter((it) => !tag || (it.tags && it.tags.includes(tag))).length;
}

export function listPostContent(page: number, limit: number, tag?: string): PostContent[] {
  return fetchPostContent()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .filter((it) => {
      return it.tags.every((tag) => tag !== 'hidden');
    })
    .slice((page - 1) * limit, page * limit);
}

export async function loadPost(fileName: string) {
  return await import(path.resolve(postsDirectory, fileName));
}
