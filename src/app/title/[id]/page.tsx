import { getDb } from "@/app/db";
import { searchTitles } from "@/search/engine";
import { Source } from "@/search/model";
import Image from "next/image";
import Link from "next/link";

const getTitle = async (id: string, query: string) => {
  const titles = await searchTitles(await getDb(), query);
  const title = titles.find((title) => title.id === id);
  return title;
};

export default async function Title({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { query: string };
}) {
  const title = await getTitle(decodeURIComponent(params.id), searchParams.query);

  if (!title) {
    throw new Error("Title not found " + params.id);
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
      <h1 className="text-4xl">{title.info.title}</h1>
      <p>{title.info.year}</p>
      <Image
        src={title.images[0]?.url}
        alt={title.info.title}
        width={200}
        height={300}
        className="w-[200px] h-[300px]"
      />
      <u>
        {title.references.filter(reference => reference.url).map((reference) => (
          <li key={reference.id}>
            <Link href={reference.url!} target="__blank">
              {reference.platform}
            </Link>
          </li>
        ))}
      </u>
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
                    <span>{source.username ?? source.type}</span>
                    <Link href={source.url!} target="_blank">link</Link>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
