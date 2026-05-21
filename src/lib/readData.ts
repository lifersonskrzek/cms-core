/**
 * Lê arquivos JSON da pasta data/ de forma dinâmica (sem cache do Vite).
 * Garante que alterações feitas via CMS sejam refletidas imediatamente no dev,
 * e lidas corretamente em tempo de build no Vercel.
 */
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { blogIndexUrl } from './blogRoutes';

const DATA_DIR = resolve(process.cwd(), 'src/data');

export function readData<T = any>(filename: string, fallback: T = {} as T): T {
    try {
        return JSON.parse(readFileSync(resolve(DATA_DIR, filename), 'utf-8')) as T;
    } catch {
        return fallback;
    }
}

export type RecentPost = {
    slug: string;
    image?: string;
    title: string;
    category?: string;
    description: string;
    href: string;
};

/** Retorna os posts mais recentes do blog, mapeados para uso em cards/listagens. */
export async function getRecentPosts(limit = 3): Promise<RecentPost[]> {
    const collection = (await getCollection('blog')).sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );
    return collection.slice(0, limit).map((post) => ({
        slug: post.slug,
        image: post.data.heroImage,
        title: post.data.title,
        category: post.data.category,
        description: post.data.description,
        href: `${blogIndexUrl()}/${post.slug}`,
    }));
}
