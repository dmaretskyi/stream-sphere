import { describe, expect, test } from 'vitest'
import { inspect } from "util";
import { searchTitles } from "./engine";
import { createDb } from '../db/createDb';

describe('Search Engine', () => {
  test('search', async () => {
    const results = await searchTitles(await createDb(), 'the expanse');
    // console.log(inspect(results, { depth: null, colors: true }));
  })
})