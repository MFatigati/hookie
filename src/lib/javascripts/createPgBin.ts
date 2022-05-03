import { Client } from 'pg';
const ALPHA_NUMERIC:string = 'abcdefghijklmnopqrstuvwxyz0123456789';

export async function createPgBin(key: string) {
  const client = new Client({
    database: "request_bin"
  });

  await client.connect();

  await client.query("INSERT INTO bin (key) VALUES($1)", [key]);

  await client.end();
}


// Generate a random string of 4 characters
export async function generatePgKey() {
  const len:number = 4;
  let result = "";

  do {
    for (let i = 0; i < len; i++) {
      result += ALPHA_NUMERIC.charAt(Math.floor(Math.random() * ALPHA_NUMERIC.length));
    }
  } while (await !keyNotFound(result));

  return result;
}

// Query postgres to check if key is unique
export async function keyNotFound(key:string) {
  try {
    const client = new Client({
      database: "request_bin"
    });

    await client.connect();

    const res = await client.query("SELECT key FROM bin WHERE key=$1", [key]);
    console.log("data base query", res.rows);

    await client.end();
    return res.rows.length === 0;
  } catch (error) {
    console.log("\nError occured checking the unique key\n");
    console.log(error);
  }
};