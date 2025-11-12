"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface NotesSectionProps {
  userId: number
  initialNote: string
}

export default function NotesSection({ userId, initialNote }: NotesSectionProps) {
  const [note, setNote] = useState(initialNote)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const response = await fetch(`/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error("Failed to save note:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📝</span>
          My Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Write your notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-24"
        />
        <div className="flex justify-end gap-2">
          {saved && <span className="text-sm text-green-600">Saved!</span>}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
