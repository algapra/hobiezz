import { getSession } from "@/lib/session"
import { getDb } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { interests } = await request.json()
    if (!Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json({ error: "Invalid interests" }, { status: 400 })
    }

    const uniqueInterests = [...new Set(interests)]

    const sql = getDb()

    try {
      await sql`DELETE FROM user_interests WHERE user_id = ${session.id}`
    } catch (err) {
      console.error("[v0] Error deleting old interests:", err)
    }

    const results = []
    for (const interest of uniqueInterests) {
      try {
        const result =
          await sql`INSERT INTO user_interests (user_id, interest_type) VALUES (${session.id}, ${interest})`
        results.push({ interest, success: true })
      } catch (err) {
        console.error(`[v0] Error inserting interest ${interest}:`, err)
        results.push({ interest, success: false, error: String(err) })
      }
    }

    const failed = results.filter((r) => !r.success)
    if (failed.length > 0) {
      console.error("[v0] Failed to save interests:", failed)
      return NextResponse.json(
        {
          error: `Failed to save ${failed.length} interests. Please try again.`,
          failed: failed.map((f) => f.interest),
        },
        { status: 500 },
      )
    }

    console.error("[v0] Successfully saved all interests:", uniqueInterests)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving interests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = getDb()
    const interests = await sql`SELECT interest_type FROM user_interests WHERE user_id = ${session.id}`

    return NextResponse.json({
      interests: interests.map((i: { interest_type: string }) => i.interest_type),
    })
  } catch (error) {
    console.error("Error fetching interests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = getDb()
    await sql`DELETE FROM user_interests WHERE user_id = ${session.id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting interests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
