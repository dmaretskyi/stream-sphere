import { describe, test } from 'vitest';
import { inspect } from 'util';
import { fetchTitleData } from './imdb';

describe('IMDB', () => {
  test('should return a list of movies', async () => {
    const results = await fetchTitleData('tt2861424');
    // console.log(inspect(results, { depth: null, colors: true }))
  });
});
