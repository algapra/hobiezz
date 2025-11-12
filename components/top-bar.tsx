"use client"

import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface TopBarProps {
  session: { id: number; email: string }
  onMenuClick: () => void
}

export default function TopBar({ session, onMenuClick }: TopBarProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <header className="border-b border-border bg-card px-4 py-4 flex items-center justify-between">
      <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-muted rounded-lg">
        <Menu size={20} />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">{session.email}</div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}
