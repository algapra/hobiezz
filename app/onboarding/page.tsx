"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import InterestCard from "@/components/interest-card"

const INTERESTS = [
  { id: "film", label: "Film", icon: "🎬" },
  { id: "film_series", label: "Film Series", icon: "📺" },
  { id: "anime", label: "Anime", icon: "⚡" },
  { id: "komik", label: "Komik", icon: "📖" },
  { id: "novel", label: "Novel", icon: "📚" },
  { id: "note", label: "Note", icon: "📝" },
  { id: "finance", label: "Finance", icon: "💰" },
]

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkInterests() {
      try {
        const response = await fetch("/api/interests", { method: "GET" })
        const data = await response.json()
        if (response.ok && data.interests && data.interests.length > 0) {
          router.push("/dashboard")
          return
        }
      } catch (err) {
        console.error("Error checking interests:", err)
      } finally {
        setPageLoading(false)
      }
    }
    checkInterests()
  }, [router])

  function toggleInterest(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (selected.length === 0) {
      setError("Please select at least one interest")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: selected }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to save interests. Please try again.")
        setLoading(false)
        return
      }

      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (pageLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Select Your Interests</CardTitle>
            <CardDescription>Choose what you'd like to track. You can change this later from settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContinue} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                <Button type="submit" className="w-full sm:w-auto" disabled={loading || selected.length === 0}>
                  {loading ? "Saving..." : "Continue to Dashboard"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
