import { getSession } from "@/lib/session"
import { getDb } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { saldo, pengeluaran_bulan_ini, aset_dimiliki } = await request.json()

    const sql = getDb()

    const existing = await sql`SELECT id FROM finance WHERE user_id = ${session.id}`

    if (existing.length > 0) {
      // Update existing record
      const result = await sql`
        UPDATE finance 
        SET saldo = ${saldo}, pengeluaran_bulan_ini = ${pengeluaran_bulan_ini}, aset_dimiliki = ${aset_dimiliki}, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ${session.id} 
        RETURNING *
      `
      return NextResponse.json(result[0])
    } else {
      // Create new record
      const result = await sql`
        INSERT INTO finance (user_id, saldo, pengeluaran_bulan_ini, aset_dimiliki) 
        VALUES (${session.id}, ${saldo}, ${pengeluaran_bulan_ini}, ${aset_dimiliki}) 
        RETURNING *
      `
      return NextResponse.json(result[0], { status: 201 })
    }
  } catch (error) {
    console.error("Error updating finance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
