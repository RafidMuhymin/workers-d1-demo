import { ENV, Laptop } from "./types";
import {
  Request as WorkerRequest,
  ExecutionContext,
  D1Database,
} from "@cloudflare/workers-types/experimental";

import createItemsTable from "./utils/createItemsTable";

export default {
  async fetch(request: WorkerRequest, env: ENV, context: ExecutionContext) {
    switch (request.method) {
      case "GET":
        const requestURL = new URL(request.url),
          pathname = requestURL.pathname;

        if (pathname === "/laptop/create") {
          const laptop = Object.fromEntries(
            requestURL.searchParams
          ) as unknown as Laptop;

          if (laptop.name && laptop.price && laptop.description) {
            await createItemsTable(env);

            await env.Items.prepare(
              `INSERT INTO laptops (name, price, description) VALUES (?, ?, ?)`
            )
              .bind(laptop.name, laptop.price, laptop.description)
              .run();

            const createdLaptop = (await env.Items.prepare(
              `SELECT * FROM laptops ORDER BY id DESC LIMIT 1`
            ).first()) as Laptop;

            return new Response(
              `<html>
                <head>
                  <meta charset="UTF-8" />
                </head>

                <p>Created Laptop:</p>

                <p>Name: ${createdLaptop.name}</p>
                <p>Price: ${createdLaptop.price}</p>
                <p>Description: ${createdLaptop.description}</p>
              </html>`,
              {
                headers: {
                  "Content-Type": "text/html",
                },
              }
            );
          } else {
            return new Response("Missing required data!", {
              status: 400,
            });
          }
        }

      default:
        return new Response("Method or Path not allowed!", {
          status: 404,
        });
    }
  },
};
