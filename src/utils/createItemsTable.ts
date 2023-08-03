import { ENV } from "../types";

export default async function createItemsTable(env: ENV) {
  // create table if not exists
  await env.Items.prepare(
    `CREATE TABLE IF NOT EXISTS laptops (
      id integer PRIMARY KEY AUTOINCREMENT,
      name text NOT NULL,
      price text NOT NULL,
      description text NOT NULL
    )`
  ).run();
}
