"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import MediaTable from "@/components/media-table"
import MediaModal from "@/components/media-modal"

interface MediaListPageProps {
  title: string
  icon: string
  mediaType: string
  items: any[]
  total: number
  page: number
  limit: number
  columns: string[]
  columnLabels: Record<string, string>
}

export default function MediaListPage({
  title,
  icon,
  mediaType,
  items,
  total,
  page,
  limit,
  columns,
  columnLabels,
}: MediaListPageProps) {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h1>
        <Button
          onClick={() => {
            setEditingItem(null)
            setModalOpen(true)
          }}
          className="gap-2"
        >
          <Plus size={16} />
          Tambah {title}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
            <Search size={16} className="text-muted-foreground" />
            <Input
              placeholder={`Cari berdasarkan judul...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent placeholder-muted-foreground focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaTable
            items={items}
            columns={columns}
            columnLabels={columnLabels}
            mediaType={mediaType}
            onEdit={(item) => {
              setEditingItem(item)
              setModalOpen(true)
            }}
          />

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Menampilkan {items.length} dari {total}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" disabled>
                Sebelumnya
              </Button>
              <Button variant="outline" disabled>
                Selanjutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {modalOpen && (
        <MediaModal
          mediaType={mediaType}
          item={editingItem}
          onClose={() => {
            setModalOpen(false)
            setEditingItem(null)
          }}
          onSuccess={() => {
            setModalOpen(false)
            setEditingItem(null)
          }}
        />
      )}
    </div>
  )
}
