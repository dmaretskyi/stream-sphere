import { fetchTitleData } from "./imdb";
import { Source, Title } from "./model";
import { parseTitle } from "./parse-title";
import { SearchResult, searchPirateBay } from "./pirate-bay"

export const searchTitles = async (query: string): Promise<Title[]> => {
  const results = await searchPirateBay(query);

  const byImdbId: Record<string, SearchResult[]> = {}
  results.forEach(result => {
    (byImdbId[result.imdb] ??= []).push(result);
  });

  return await Promise.all(Object.entries(byImdbId).map(async ([imdbId, results]) => {
    const imdbData = await fetchTitleData(imdbId);

    const sources = results.map(result => {
      const parsedData = parseTitle(result.name);

      return {
        
        id: result.id,
        name: result.name,
        info_hash: result.info_hash,

        size: result.size,
        num_files: result.num_files,
        status: result.status,
        added: result.added,
        username: result.username,

        leeches: parseInt(result.leechers),
        seeders: parseInt(result.seeders),
        episode: parsedData.episode ? parseInt(parsedData.episode) : undefined,
        season: parsedData.season ? parseInt(parsedData.season) : undefined,
        quality: parsedData.quality,
        tags: parsedData.tags,
      } satisfies Source;
    })

    return {
      imdbId,
      title: imdbData.d[0].l,
      category: imdbData.d[0].q,
      year: imdbData.d[0].y,

      images: [imdbData.d[0].i].filter(Boolean).map(image => ({
        width: image.width,
        height: image.height,
        url: image.imageUrl,
      })),

      sources
    } satisfies Title;
  }));
}