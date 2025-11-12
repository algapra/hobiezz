import { type NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { getDb } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const sql = getDb()

    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const result = await sql`
      INSERT INTO users (email, password_hash) 
      VALUES (${email}, ${hashedPassword}) 
      RETURNING id, email
    `

    if (result.length > 0) {
      const userId = result[0].id
      await sql`INSERT INTO finance (user_id) VALUES (${userId})`
    }

    return NextResponse.json({ user: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
