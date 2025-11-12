import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FinanceOverviewProps {
  finance: {
    saldo: number
    pengeluaran_bulan_ini: number
    aset_dimiliki: number
  }
}

export default function FinanceOverview({ finance }: FinanceOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const totalAssets = (finance.saldo || 0) + (finance.aset_dimiliki || 0)
  const netBalance = totalAssets - (finance.pengeluaran_bulan_ini || 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Saat Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(finance.saldo || 0)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pengeluaran Bulan Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(finance.pengeluaran_bulan_ini || 0)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Aset Dimiliki</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(finance.aset_dimiliki || 0)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Bersih</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(netBalance)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
