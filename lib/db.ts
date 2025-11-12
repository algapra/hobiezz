import { Client } from "pg";

let client: Client | null = null;

export function getDb() {
  if (!client) {
    client = new Client({ connectionString: process.env.DATABASE_URL });
    client.connect();
  }

  return async (strings: TemplateStringsArray, ...params: any[]) => {
    const text = strings
      .map((str, i) => (i < params.length ? `${str}$${i + 1}` : str))
      .join("");
    const res = await client!.query(text, params);
    return res.rows;
  };
}
