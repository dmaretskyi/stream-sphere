export type Title = {
  id: string;
  info: TitleInfo,

  images: Image[];
  references: References[];
  sources: Source[];
}

export type TitleInfo = {
  title: string;
  year?: number;
  category?: string;
}

export type Image = {
  width?: number;
  height?: number;
  url: string;
}

export type References = {
  /**
   * The platform this title is from.
   * 
   * - imdb
   * - anidb
   * - myanimelist
   * - piratebay
   */
  platform: string;
  id?: string;
  url?: string;
}

export type Source = {
  id: string;

  /**
   * The type of source.
   * 
   * - torrent
   * - ...various anime sites
   */
  type: string;

  info_hash?: string;
  url?: string;

  name: string;
  category?: string;
  
  season?: number;
  episode?: number;

  quality?: string;
  tags: string[];

  leeches?: number;
  seeders?: number;
  num_files?: string;
  size?: string;

  username?: string;
  added?: string;
  status?: string;
}