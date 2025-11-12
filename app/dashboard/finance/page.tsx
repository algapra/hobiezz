import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import MainLayout from "@/components/main-layout"
import FinanceOverview from "@/components/finance-overview"
import FinanceForm from "@/components/finance-form"

export default async function FinancePage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const sql = getDb()

  const interests = await sql`SELECT interest_type FROM user_interests WHERE user_id = ${session.id}`
  const interestsList = interests.map((i) => i.interest_type)

  const financeData = await sql`
    SELECT id, saldo, pengeluaran_bulan_ini, aset_dimiliki 
    FROM finance 
    WHERE user_id = ${session.id}
  `
  const finance = financeData.length > 0 ? financeData[0] : null

  return (
    <MainLayout session={session} interests={interestsList}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>💰</span>
          Finance Tracking
        </h1>

        {finance && (
          <>
            <FinanceOverview finance={finance} />
            <FinanceForm finance={finance} />
          </>
        )}
      </div>
    </MainLayout>
  )
}
