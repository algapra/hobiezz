import { getSession } from "@/lib/session"
import { getDb } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    const sql = getDb()

    const existing = await sql`SELECT id FROM user_notes WHERE user_id = ${session.id}`

    if (existing.length > 0) {
      await sql`UPDATE user_notes SET content = ${content}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ${session.id}`
    } else {
      await sql`INSERT INTO user_notes (user_id, content) VALUES (${session.id}, ${content})`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving note:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
