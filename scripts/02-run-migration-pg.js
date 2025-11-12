import pg from "pg"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log("path",path)
    console.log("[v0] Connecting to database...")
    await client.connect()
    console.log("[v0] Connected successfully")

    const sqlPath = path.join(__dirname, "scripts" , "01-init-schema.sql")
    console.log("[v0] Reading SQL file from:", sqlPath)
    const sqlContent = fs.readFileSync(sqlPath, "utf-8")

    console.log("[v0] Executing migration statements...")

    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    for (const statement of statements) {
      try {
        console.log("[v0] Executing:", statement.substring(0, 50) + "...")
        await client.query(statement)
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes("already exists")) {
          throw error
        }
        console.log("[v0] Skipped (already exists)")
      }
    }

    console.log("[v0] Migration completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Migration failed:", error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
