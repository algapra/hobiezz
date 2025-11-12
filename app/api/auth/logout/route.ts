import { removeSession } from "@/lib/session"
import { NextResponse } from "next/server"

export async function POST() {
  await removeSession()
  return NextResponse.json({ success: true })
}
