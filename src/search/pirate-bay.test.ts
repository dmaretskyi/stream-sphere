import { parseTitle } from "./parse-title";
import { searchPirateBay } from "./pirate-bay";
import { describe, test } from 'vitest';

describe('PirateBay', () => {
  test('should return a list of torrents', async () => {
    const results = await searchPirateBay('rick and morty');

    const augmentedResults = results.map(result => {
      const meta = parseTitle(result.name);
      return {
        ...result,
        ...meta,
      }
    });

    // console.log(augmentedResults)
  })
})