'use client';

import { Title } from "@/search/model";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())

export default function Home() {
  const [query, setQuery] = useState("Rick and Morty");
  const { data, error, isLoading } = useSWR<Title[]>(`/api/search?query=${query}`, fetcher);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <header className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold">Search</h1>
        <form className="flex flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-2 border-gray-400 rounded-lg p-2"
          />
          <button
            type="submit"
            className="border-2 border-gray-400 rounded-lg p-2"
          >
            Search
          </button>
        </form>
      </header>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul className="space-y-4 w-full">
        {data?.map((result) => (
          <li
            key={result.id}
            className="grid grid-cols-[200px_1fr_200px] gap-4"
          >
            <Image
              src={result.images[0]?.url}
              alt={result.info.title}
              width={200}
              height={300}
              className="w-[200px] h-[300px]"
            />
            <div>
              <Link href={`/title/${result.id}?query=${query}`} className="text-4xl">{result.info.title}</Link>
              <p>{result.info.year}</p>
            </div>
            <ul className="w-[200px]">
              {result.sources.slice(0, 10).map((source) => (
                <li
                  key={source.id}
                  title={source.name}
                  className="flex flex-row gap-1"
                >
                  {source.season !== undefined && <span>S{source.season}</span>}
                  {source.episode !== undefined && <span>E{source.episode}</span>}

                  <span>{source.quality}</span>
                  <span>{source.seeders}</span>
                  <span>{source.leeches}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
