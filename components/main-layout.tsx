"use client"

import type React from "react"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import TopBar from "@/components/top-bar"

interface MainLayoutProps {
  children: React.ReactNode
  session: { id: number; email: string }
  interests: string[]
}

export default function MainLayout({ children, session, interests }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar interests={interests} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar session={session} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
