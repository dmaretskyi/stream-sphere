export type Title = {
  id: string;

  title: string;
  year?: number;
  category?: string;

  images: Image[];

  sources: Source[];
}

export type Image = {
  width: number;
  height: number;
  url: string;
}

export type Source = {
  id: string;
  name: string;
  category: string;
  
  season?: number;
  episode?: number;

  quality?: string;
  tags: string[];

  leeches: number;
  seeders: number;
  info_hash: string;
  num_files: string;
  size: string;

  username: string;
  added: string;
  status: string;
}