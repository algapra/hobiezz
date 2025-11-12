"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import InterestCard from "@/components/interest-card"
import MainLayout from "@/components/main-layout"

const INTERESTS = [
  { id: "film", label: "Film", icon: "🎬" },
  { id: "film_series", label: "Film Series", icon: "📺" },
  { id: "anime", label: "Anime", icon: "⚡" },
  { id: "komik", label: "Komik", icon: "📖" },
  { id: "novel", label: "Novel", icon: "📚" },
  { id: "note", label: "Note", icon: "📝" },
  { id: "finance", label: "Finance", icon: "💰" },
]

interface UpdateInterestsPageProps {
  params: { [key: string]: string }
}

export default function UpdateInterestsPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [currentInterests, setCurrentInterests] = useState<string[]>([])
  const [session, setSession] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        // Get session
        const sessionResponse = await fetch("/api/auth/session")
        const sessionData = await sessionResponse.json()
        if (!sessionData.session) {
          router.push("/login")
          return
        }
        setSession(sessionData.session)

        // Get current interests
        const interestsResponse = await fetch("/api/interests", { method: "GET" })
        const interestsData = await interestsResponse.json()
        if (interestsResponse.ok && interestsData.interests) {
          const interestIds = interestsData.interests.map((i: any) => i.interest_type)
          setCurrentInterests(interestIds)
          setSelected(interestIds)
        }
      } catch (err) {
        console.error("Error loading data:", err)
      } finally {
        setPageLoading(false)
      }
    }
    loadData()
  }, [router])

  function toggleInterest(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (selected.length === 0) {
      setError("Please select at least one interest")
      return
    }

    setLoading(true)

    try {
      // First, delete all current interests
      await fetch("/api/interests", { method: "DELETE" })

      // Then save new interests
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: selected }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update interests")
        setLoading(false)
        return
      }

      setTimeout(() => {
        router.push("/dashboard/settings")
      }, 500)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (pageLoading || !session) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <MainLayout session={session} interests={currentInterests}>
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Update Your Interests</CardTitle>
            <CardDescription>Change which categories you want to track</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Currently selected: {selected.length} interest(s)</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {INTERESTS.map((interest) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    selected={selected.includes(interest.id)}
                    onToggle={() => toggleInterest(interest.id)}
                  />
                ))}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || selected.length === 0}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
