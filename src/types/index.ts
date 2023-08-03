import { D1Database } from "@cloudflare/workers-types";

export interface ENV {
  Items: D1Database;
}

export interface Laptop {
  name: string;
  price: string;
  description: string;
}
