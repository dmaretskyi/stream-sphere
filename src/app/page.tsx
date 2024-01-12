import { searchTitles } from '@/search/engine'
import Image from 'next/image'

export default async function Home() {
  const searchResult = await searchTitles('harry potter')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <ul className='space-y-4'>
        {searchResult.map((result) => (
          <li key={result.imdbId} className="grid grid-cols-[200px_1fr_200px] gap-4">
            <Image
              src={result.images[0].url}
              alt={result.title}
              width={200}
              height={300}
              className='w-[200px] h-[300px]'
            />
            <div>
              <h2 className='text-lg'>{result.title}</h2>
              <p>{result.year}</p>
            </div>
            <ul className='w-[200px]'>
              {result.sources.slice(0, 10).map((source) => (
                <li key={source.id} title={source.name} className='flex flex-row gap-1'>
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
  )
}
