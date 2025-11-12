import { getSession } from "@/lib/session"
import { getDb } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

const TABLE_NAMES: Record<string, string> = {
  film: "films",
  film_series: "film_series",
  anime: "anime",
  komik: "komik",
  novel: "novel",
}

export async function PUT(request: NextRequest, { params }: { params: { type: string; id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const type = params.type
    const id = params.id
    const tableName = TABLE_NAMES[type]

    if (!tableName) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    const data = await request.json()
    const sql = getDb()

    const entries = Object.entries(data)
    const queryParts: string[] = []
    const values: any[] = [session.id]

    entries.forEach((entry) => {
      queryParts.push(`${entry[0]} = $${values.length + 1}`)
      values.push(entry[1])
    })

    const updateClause = queryParts.join(", ")
    const idIndex = values.length + 1
    values.push(Number.parseInt(id))

    const query = `UPDATE ${tableName} SET ${updateClause}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND id = $${idIndex} RETURNING *`

    const result = await sql(query, values)

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating media:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { type: string; id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const type = params.type
    const id = params.id
    const tableName = TABLE_NAMES[type]

    if (!tableName) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    const sql = getDb()

    const result =
      await sql`DELETE FROM ${sql.unsafe(tableName)} WHERE user_id = ${session.id} AND id = ${Number.parseInt(id)} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting media:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
