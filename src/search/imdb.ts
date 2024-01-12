export type ImdbTitleData = {
  d: [
    {
      /**
       * Images
       */
      i: {
        height: number,
        imageUrl: string
        width: number
      },
      id: string,
      /**
       * Title
       */
      l: string,

      /**
       * Category
       */
      q: string,

      /**
       * Category ID.
       */
      qid: string,
      rank: number,
      /**
       * Authors.
       */
      s: string,

      /**
       * Year.
       */
      y: number
    }
  ],
  /**
   * Query.
   */
  q: string,
  v: number
}

export const fetchTitleData = async (titleId: string): Promise<ImdbTitleData> => {
  const res = await fetch(`https://v2.sg.media-imdb.com/suggestion/t/${titleId}.json`);

  const json = await res.json();

  return json;
}