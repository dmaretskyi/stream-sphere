import { createTempDb } from "@/util/testing";
import sql from "sql-template-strings";
import sqlite3 from "sqlite3";
import { describe, test } from "vitest";

sqlite3.verbose();

describe("sqlite", async () => {
  test("basic", async ({ expect }) => {
    const db = await createTempDb();

    await db.exec(sql`CREATE TABLE tbl (col TEXT)`);
    await db.exec(sql`INSERT INTO tbl VALUES ("test")`);
    const result = await db.get(sql`SELECT col FROM tbl WHERE col = ${'test'}`);
    expect(result.col).toBe("test");
  });

  test("full text search", async ({ expect }) => {
    const db = await createTempDb();

    sqlite3.verbose();

    // -- Create an FTS table
    await db.exec(sql`CREATE VIRTUAL TABLE pages USING fts4(title, body)`);


    await db.exec(
      sql`INSERT INTO pages(title, body) VALUES(${'Download'}, 'All SQLite source code...')`
    );
    await db.exec(
      sql`INSERT INTO pages(title, body) VALUES('Web site', 'The official SQLite web site...')`
    );

    const results = await db.all(sql`SELECT * FROM pages WHERE body MATCH 'web'`)
    expect(results).length(1)


    // // -- Change the title of the row just inserted.
    // await db.exec(
    //   `UPDATE pages SET title = 'Download SQLite' WHERE rowid = 54;`
    // );

    // // -- Delete the entire table contents.
    // await db.exec(`DELETE FROM pages;`);

    // //-- The following is an error. It is not possible to assign non-NULL values to both
    // //-- the rowid and docid columns of an FTS table.
    // await db.exec(
    //   `INSERT INTO pages(rowid, docid, title, body) VALUES(1, 2, 'A title', 'A document body')`
    // );
  });

  test('full text search with JSON', async ({ expect }) => {
    const db = await createTempDb();

    const OBJECTS = [
      { id: '1', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
      { id: '2', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { id: '3', title: 'The Hobbit', author: 'J. R. R. Tolkien' },
      { id: '4', title: 'The Catcher in the Rye', author: 'J. D. Salinger' },
    ]

    await db.exec(sql`CREATE VIRTUAL TABLE books USING FTS4(id, data)`);
    for (const obj of OBJECTS) {
      await db.run(sql`INSERT INTO books(id, data) VALUES(${obj.id}, ${JSON.stringify(obj)});`)
    }

    const results = await db.all(sql`SELECT * FROM books WHERE data MATCH 'Gatsby'`)
    expect(results).length(1)
  });
});
