"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

interface FinanceFormProps {
  finance: {
    id: number
    saldo: number
    pengeluaran_bulan_ini: number
    aset_dimiliki: number
  }
}

export default function FinanceForm({ finance }: FinanceFormProps) {
  const [formData, setFormData] = useState({
    saldo: finance.saldo || 0,
    pengeluaran_bulan_ini: finance.pengeluaran_bulan_ini || 0,
    aset_dimiliki: finance.aset_dimiliki || 0,
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  async function handleSave() {
    setLoading(true)
    setSaved(false)

    try {
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        router.refresh()
      }
    } catch (error) {
      console.error("Error saving finance:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Finance Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {saved && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Data finance berhasil disimpan!</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="saldo">Saldo Saat Ini</Label>
            <Input
              id="saldo"
              type="number"
              value={formData.saldo}
              onChange={(e) => setFormData({ ...formData, saldo: Number.parseFloat(e.target.value) })}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">{formatCurrency(formData.saldo)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pengeluaran">Pengeluaran Bulan Ini</Label>
            <Input
              id="pengeluaran"
              type="number"
              value={formData.pengeluaran_bulan_ini}
              onChange={(e) => setFormData({ ...formData, pengeluaran_bulan_ini: Number.parseFloat(e.target.value) })}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">{formatCurrency(formData.pengeluaran_bulan_ini)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aset">Aset Dimiliki</Label>
            <Input
              id="aset"
              type="number"
              value={formData.aset_dimiliki}
              onChange={(e) => setFormData({ ...formData, aset_dimiliki: Number.parseFloat(e.target.value) })}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">{formatCurrency(formData.aset_dimiliki)}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
