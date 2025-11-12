"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MediaModalProps {
  mediaType: string
  item?: any
  onClose: () => void
  onSuccess: () => void
}

export default function MediaModal({ mediaType, item, onClose, onSuccess }: MediaModalProps) {
  const [formData, setFormData] = useState(item || {})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function getFormFields() {
    const common = ["judul", "tahun", "sinopsis", "genre", "rating", "status"]

    const fields: Record<string, string[]> = {
      film: [...common],
      film_series: [...common, "berapa_episode"],
      anime: [...common, "berapa_episode"],
      komik: ["judul", "penulis", "sinopsis", "genre", "rating", "status"],
      novel: ["judul", "penulis", "sinopsis", "genre", "rating", "status"],
    }

    return fields[mediaType] || common
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const endpoint = item?.id ? `/api/media/${mediaType}/${item.id}` : `/api/media/${mediaType}`

      const method = item?.id ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.refresh()
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setLoading(false)
    }
  }

  const fields = getFormFields()
  const statusOptions =
    mediaType === "komik" || mediaType === "novel" ? ["reading", "selesai"] : ["watching", "selesai"]

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "Tambah"} Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {fields.includes("judul") && (
            <div>
              <Label>Judul</Label>
              <Input
                value={formData.judul || ""}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              />
            </div>
          )}

          {fields.includes("penulis") && (
            <div>
              <Label>Penulis</Label>
              <Input
                value={formData.penulis || ""}
                onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
              />
            </div>
          )}

          {fields.includes("tahun") && (
            <div>
              <Label>Tahun</Label>
              <Input
                type="number"
                value={formData.tahun || ""}
                onChange={(e) => setFormData({ ...formData, tahun: Number.parseInt(e.target.value) })}
              />
            </div>
          )}

          {fields.includes("berapa_episode") && (
            <div>
              <Label>Berapa Episode</Label>
              <Input
                type="number"
                value={formData.berapa_episode || ""}
                onChange={(e) => setFormData({ ...formData, berapa_episode: Number.parseInt(e.target.value) })}
              />
            </div>
          )}

          {fields.includes("genre") && (
            <div>
              <Label>Genre</Label>
              <Input
                value={formData.genre || ""}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="Genre (pisahkan dengan koma)"
              />
            </div>
          )}

          {fields.includes("sinopsis") && (
            <div>
              <Label>Sinopsis</Label>
              <Textarea
                value={formData.sinopsis || ""}
                onChange={(e) => setFormData({ ...formData, sinopsis: e.target.value })}
                rows={4}
              />
            </div>
          )}

          {fields.includes("rating") && (
            <div>
              <Label>Rating</Label>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.rating || ""}
                onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
              />
            </div>
          )}

          {fields.includes("status") && (
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status || ""}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "watching" ? "Sedang Ditonton" : option === "reading" ? "Sedang Dibaca" : "Selesai"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
