import { getDb } from '@/app/db';
import { createDb } from '@/db/createDb';
import { searchTitles } from '@/search/engine';
import { NextRequest } from 'next/server';
import { join, resolve } from 'path';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');
  if (!query) {
    return new Response('Missing query', { status: 400 });
  }
  const db = await getDb();
  const results = await searchTitles(db, query);
  return new Response(JSON.stringify(results), {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  });
}
