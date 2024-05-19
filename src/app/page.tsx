'use client';

import { Title } from '@/search/model';
import { MagnifyingGlass } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import PirateBayLogo from '../assets/the-pirate-bay-logo-svg-vector.svg';

const fetcher = (...args: any[]) =>
  (fetch as any)(...args).then((res: any) => res.json());

const getInitialQuery = () => {
  return typeof localStorage !== 'undefined'
    ? localStorage.getItem('query') ?? ''
    : '';
};

export default function Home() {
  const [query, setQuery] = useState(getInitialQuery());
  const [apiQuery, setApiQuery] = useState(getInitialQuery());

  const changeQuery = (newValue: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('query', newValue);
    }

    setQuery(newValue);
  };

  const { data, error, isLoading } = useSWR<Title[]>(
    `/api/search?query=${apiQuery}`,
    fetcher
  );

  const router = useRouter();

  return (
    <main className='grid h-screen grid-rows-[4rem_1fr]  justify-items-center overflow-hidden'>
      <header
        className='scrollbar-hide mb-2 box-border grid w-screen content-center 
      items-center justify-items-center border-b-[1px] border-b-[rgb(var(--charcoal-grey))] bg-[rgb(var(--background-panel-rgb))] only:h-screen'
      >
        {apiQuery === '' && (
          <h1 className='box-border p-2 text-[3rem]'>Search StreamSphere</h1>
        )}
        <form
          className='box-border grid w-[40%] grid-cols-[1fr_auto]'
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type='text'
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                setApiQuery((e.target as HTMLInputElement).value);
              }
            }}
            className='h-[2.5rem] rounded-[0.5rem_0rem_0rem_0.5rem] border-2 border-r-0 border-[rgb(var(--charcoal-grey))] bg-inherit p-2 focus:outline-none'
          />
          <button
            className='group grid h-[2.5rem] content-center rounded-[0rem_0.5rem_0.5rem_0rem] border-2 border-l-0 border-[rgb(var(--charcoal-grey))] p-2'
            onClick={() => setApiQuery(query)}
          >
            <MagnifyingGlass
              className='group-hover:opacity-50'
              size={'1.5rem'}
            />
          </button>
        </form>
      </header>
      {apiQuery !== '' && (
        <div className='grid w-full  justify-items-center overflow-y-scroll no-scrollbar'>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          <ul className='w-[60%] space-y-4 '>
            {data?.map((result) => (
              <li
                key={result.id}
                className='group grid h-[10rem] cursor-pointer grid-cols-[6rem_1fr] gap-4 overflow-hidden  rounded-[0.5rem] p-[0.5rem]  hover:bg-[rgb(var(--charcoal-grey))]'
                onClick={() =>
                  router.push(`/title/${result.id}?query=${apiQuery}`)
                }
              >
                {result.images[0] ? (
                  <Image
                    src={result.images[0]?.url}
                    alt={result.info.title}
                    width={100}
                    height={150}
                    className='h-[9rem] w-[6rem] rounded-[0.25rem]'
                  />
                ) : (
                  <div className='h-[9rem] w-[6rem] rounded-[0.25rem] bg-[white]'>
                    {result.id.includes('piratebay') && (
                      <Image src={PirateBayLogo} alt='Pirate Bay' />
                    )}
                  </div>
                )}
                <div>
                  <div className='text-[1rem]'>
                    <Link
                      href={`/title/${result.id}?query=${apiQuery}`}
                      className='text-[1.75rem] group-hover:underline'
                    >
                      {result.info.title}
                    </Link>
                    <p>
                      {result.info.year}{' '}
                      {/\d/.test(result.info.category || '')
                        ? ''
                        : result.info.category}
                    </p>
                  </div>
                  <div className='flex gap-x-[0.3rem]'>
                    {Array.from(
                      new Set(result.sources.map((source) => source.type))
                    )
                      .slice(0, 10)
                      .map((type) => (
                        <div className='w-[fit-content] rounded-[1rem] border-[1px] border-[rgb(var(--background-panel-rgb))] bg-[rgb(var(--charcoal-grey))] p-[0rem_0.5rem_0.1rem_0.5rem] text-center'>
                          {type}
                        </div>
                      ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
