import { Database } from "sqlite";
import { fetchTitleData } from "./imdb";
import { Image, Reference, Source, Title } from "./model";
import { parseTitle } from "./parse-title";
import { SearchResult, searchPirateBay } from "./pirate-bay"
import { searchMalBackup } from "./mal-backup";

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
        type: 'torrent',

        name: result.name,
        category: result.category,
        url: createMagnetLink(result.info_hash, result.name),

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
      id: !imdbId.startsWith('nil') ? `imdb:${imdbId}` : `piratebay:${results[0].id}`,
      info: {
        title: imdbData?.d[0]?.l ?? sources[0].name,
        category: imdbData?.d[0]?.q ?? sources[0].category,
        year: imdbData?.d[0]?.y,
      },
      references: [
        imdbData && {
          platform: 'imdb',
          id: imdbId,
          url: `https://www.imdb.com/title/${imdbId}/`,
        } satisfies Reference,
        sources.length === 1 ? {
          platform: 'piratebay',
          url: `https://piratebay.party/torrent/${results[0].id}`,
        } : undefined,
      ].filter(Boolean) as Reference[],
      images: [imdbData?.d[0]?.i!].filter(Boolean).map(image => ({
        width: image.width,
        height: image.height,
        url: image.imageUrl,
      })),

      sources
    } satisfies Title;
  }));
}

const searchOnMalBackup = async (db: Database, query: string): Promise<Title[]> => {
  const entries = await searchMalBackup(db, query);
  return entries.map(entry => {
    return {
      id: entry.stspId,
      info: {
        title: entry.title,
      },
      images: [
        entry.image && {
          url: entry.image,
        } satisfies Image
      ].filter(Boolean) as Image[],
      references: [
        {
          platform: 'myanimelist',
          id: entry.malId?.toString(),
          url: entry.url,
        }
      ],
      sources: Object.entries(entry.Sites).flatMap(([site, entries]) =>
      Object.entries(entries).map(([id, entry]) => {
          return {
            id: `${site.toLowerCase()}:${id}`,
            type: site.toLowerCase(),
            name: entry.title,
            category: entry.type,
            url: entry.url,
            tags: []
          } satisfies Source;
        })
      )
    } satisfies Title;
  });
}

export const searchTitles = async (db: Database, query: string): Promise<Title[]> => {
  const [pirateBayResults, malbakResults] = await Promise.all([
    searchOnPirateBay(query),
    searchOnMalBackup(db, query),
  ])
  return [...malbakResults, ...pirateBayResults];
}


const createMagnetLink = (infoHash: string, name: string) =>
`magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(name)}&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.bittor.pw%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fpublic.popcorn-tracker.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce`