import { getDb } from '@/app/db';
import { searchTitles } from '@/search/engine';
import { Source } from '@/search/model';
import Image from 'next/image';
import Link from 'next/link';

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
  const title = await getTitle(
    decodeURIComponent(params.id),
    searchParams.query
  );

  if (!title) {
    throw new Error('Title not found ' + params.id);
  }

  const sourceBySeason = title.sources.reduce<Record<string, Source[]>>(
    (acc, source) => {
      (acc[source.season?.toString()!] ??= []).push(source);
      return acc;
    },
    {}
  );

  return (
    <main className='grid h-screen grid-rows-[4rem_1fr]  justify-items-center overflow-hidden'>
      <header
        className='scrollbar-hide mb-2 box-border grid w-screen content-center 
      items-center justify-items-center border-b-[1px] border-b-[rgb(var(--charcoal-grey))] bg-[rgb(var(--background-panel-rgb))] only:h-screen'
      ></header>
      <div className='box-border grid h-full w-[95%] grid-cols-[20%_60%_20%] overflow-hidden py-[2rem]'>
        <div className='m-[0rem_2rem_1rem_1rem] box-border h-full overflow-y-scroll no-scrollbar'>
          <ul>
            {Object.entries(sourceBySeason).map(([season, sources]) => (
              <li key={season}>
                <h4 className='text-lg font-bold'>Season {season}</h4>
                <ul>
                  {sources
                    .toSorted((a, b) => (a.episode ?? -1) - (b.episode ?? -1))
                    .map((source) => (
                      <Link href={source.url!} target='_blank'>
                        <li
                          key={source.id}
                          title={source.name}
                          className='my-[0.5rem] grid grid-cols-6 gap-1 bg-[rgb(var(--charcoal-grey))] px-[1rem] py-[0.5rem] hover:opacity-50'
                        >
                          {source.episode !== undefined ? (
                            <span>E{source.episode}</span>
                          ) : (
                            <span>Full</span>
                          )}
                          {source.type === 'torrent' && (
                            <>
                              <span>{source.quality}</span>
                              <span>{source.seeders}</span>
                              <span>{source.leeches}</span>
                            </>
                          )}
                          <span>{source.username ?? source.type}</span>
                        </li>
                      </Link>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className=''>
          <video
            src=''
            className='bg- h-[60vh] border border-dotted border-black'
            controls
          ></video>
        </div>
        <div className='m-[0rem_1rem_1rem_2rem]'>
          <Image
            src={title.images[0]?.url}
            alt={title.info.title}
            width={200}
            height={300}
            className='h-[300px] w-[200px]'
          />
          <p className='text-4xl'>{title.info.title}</p>
          <p>{title.info.year}</p>
          <u>
            {title.references
              .filter((reference) => reference.url)
              .map((reference) => (
                <li key={reference.id}>
                  <Link href={reference.url!} target='__blank'>
                    {reference.platform}
                  </Link>
                </li>
              ))}
          </u>
        </div>
      </div>
    </main>
  );
}
