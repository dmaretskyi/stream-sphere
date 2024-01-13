import { randomBytes } from "crypto";
import { mkdir } from "fs/promises";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export const createTempDb = async () => {
  const filename = join(
    tmpdir(),
    "stream-shpere",
    randomBytes(8).toString("hex")
  );
  await mkdir(dirname(filename), { recursive: true });
  return open({
    filename,
    driver: sqlite3.Database,
  });
};