import { searchTitles } from "@/search/engine";
import { Source } from "@/search/model";

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
      (acc[source.season?.toString() ?? "nil"] ??= []).push(source);
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
                  className="grid grid-cols-5 gap-1"
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
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
