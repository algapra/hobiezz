import { cookies } from "next/headers"
import { getDb } from "./db"

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
      return null
    }

    const sql = getDb()
    const users = await sql`SELECT id, email FROM users WHERE id = ${Number.parseInt(userId)}`
    return users.length > 0 ? users[0] : null
  } catch (error) {
    return null
  }
}

export async function removeSession() {
  const cookieStore = await cookies()
  cookieStore.delete("userId")
}
