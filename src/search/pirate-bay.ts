export type SearchResult = {
  id: string;
  name: string;
  info_hash: string;
  leechers: string;
  seeders: string;
  num_files: string;
  size: string;
  username: string;
  added: string;
  status: string;
  category: string;
  imdb: string;
};

export const searchPirateBay = async (
  query: string
): Promise<SearchResult[]> => {
  const res = await fetch(
    `https://apibay.org/q.php?q=${encodeURIComponent(query)}`
  );

  const json = await res.json();

  return json;
};
