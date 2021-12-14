import { Pool } from "https://deno.land/x/postgres@v0.13.0/mod.ts";

const CONCURRENT_CONNECTIONS = 2;
const connectionPool = new Pool({
  hostname: "abul.db.elephantsql.com",
  database: "duhhzqst",
  user: "duhhzqst",
  password: "eYlBIBZjNwbg2clGASdCK3kOpNz-r_s6",
  port: 5432,
}, CONCURRENT_CONNECTIONS);

const executeQuery = async (query, ...args) => {
  const response = {};
  let client;

  try {
    client = await connectionPool.connect();
    const result = await client.queryObject(query, ...args);
    if (result.rows) {
      response.rows = result.rows;
    }
  } catch (e) {
    console.log(e);
    response.error = e;
  } finally {
    try {
      await client.release();
    } catch (e) {
      console.log(e);
    }
  }

  return response;
};

export { executeQuery };
