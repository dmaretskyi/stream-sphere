import { searchTitles } from "@/search/engine";
import { Source } from "@/search/model";
import Link from "next/link";
import { s } from "vitest/dist/reporters-trlZlObr.js";

const getTitle = async (id: string, query: string) => {
  const titles = await searchTitles(query);
  const title = titles.find((title) => title.imdbId === id);
  return title;
};

export default async function Title({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { query: string };
}) {
  const title = await getTitle(params.id, searchParams.query);

  if (!title) {
    throw new Error("Title not found");
  }

  const sourceBySeason = title.sources.reduce<Record<string, Source[]>>(
    (acc, source) => {
      (acc[source.season?.toString()!] ??= []).push(source);
      return acc;
    },
    {}
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <h1 className="text-4xl">{title.title}</h1>
      <p>{title.year}</p>
      <ul>
        {Object.entries(sourceBySeason).map(([season, sources]) => (
          <li key={season}>
            <h4 className="text-lg font-bold">Season {season}</h4>
            <ul>
              {sources
                .toSorted((a, b) => (a.episode ?? -1) - (b.episode ?? -1))
                .map((source) => (
                  <li
                    key={source.id}
                    title={source.name}
                    className="grid grid-cols-6 gap-1"
                  >
                    {source.episode !== undefined ? (
                      <span>E{source.episode}</span>
                    ) : (
                      <span>full</span>
                    )}

                    <span>{source.quality}</span>
                    <span>{source.seeders}</span>
                    <span>{source.leeches}</span>
                    <span>{source.username}</span>
                    <Link href={createMagnetLink(source.info_hash)} target="_blank">magnet</Link>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}

const createMagnetLink = (infoHash: string) =>
`magnet:?xt=urn:btih:${infoHash}&dn=Rick.and.Morty.S07E06.1080p.WEB.H264-NHTFS%5BTGx%5D&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.bittor.pw%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fpublic.popcorn-tracker.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce`