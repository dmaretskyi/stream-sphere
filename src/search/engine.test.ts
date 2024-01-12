import { describe, expect, test } from 'vitest'
import { inspect } from "util";
import { searchTitles } from "./engine";

describe('Search Engine', () => {
  test('search', async () => {
    const results = await searchTitles('the expanse');
    // console.log(inspect(results, { depth: null, colors: true }));
  })
})