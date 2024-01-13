import { fetchTitleData } from "./imdb";
import { Source, Title } from "./model";
import { parseTitle } from "./parse-title";
import { SearchResult, searchPirateBay } from "./pirate-bay"

const searchOnPirateBay = async (query: string) => {
  const results = await searchPirateBay(query);

  const byImdbId = results.reduce<Record<string, SearchResult[]>>((acc, result) => {
    (acc[result.imdb || `nil-${result.id}`] ??= []).push(result);
    return acc;
  }, {});

  return await Promise.all(Object.entries(byImdbId).map(async ([imdbId, results]) => {

    const imdbData = !imdbId.startsWith('nil') ? await fetchTitleData(imdbId) : undefined;

    const sources = results.map(result => {
      const parsedData = parseTitle(result.name);

      return {
        
        id: result.id,
        name: result.name,
        category: result.category,
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
      id: `imdb:${imdbId}`,
      title: imdbData?.d[0].l ?? sources[0].name,
      category: imdbData?.d[0].q ?? sources[0].category,
      year: imdbData?.d[0].y,

      images: [imdbData?.d[0].i!].filter(Boolean).map(image => ({
        width: image.width,
        height: image.height,
        url: image.imageUrl,
      })),

      sources
    } satisfies Title;
  }));
}


export const searchTitles = async (query: string): Promise<Title[]> => {
  const pirateBayResults = await searchOnPirateBay(query);
  return pirateBayResults;
}