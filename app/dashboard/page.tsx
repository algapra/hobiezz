import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import MainLayout from "@/components/main-layout"
import StatisticsCard from "@/components/statistics-card"
import NotesSection from "@/components/notes-section"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const sql = getDb()

  const interestsResult = await sql`SELECT interest_type FROM user_interests WHERE user_id = ${session.id}`
  const interests = interestsResult.map((i) => i.interest_type)

  // If they somehow reach dashboard without interests, they can update from settings

  // Get statistics for each media type
  const stats: Record<string, any> = {}

  if (interests.includes("film")) {
    const filmStats = await sql`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai, 
             SUM(CASE WHEN status = 'watching' THEN 1 ELSE 0 END) as sedang_ditonton 
      FROM films 
      WHERE user_id = ${session.id}
    `
    stats.film = filmStats[0]
  }

  if (interests.includes("film_series")) {
    const seriesStats = await sql`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai, 
             SUM(CASE WHEN status = 'watching' THEN 1 ELSE 0 END) as sedang_ditonton 
      FROM film_series 
      WHERE user_id = ${session.id}
    `
    stats.film_series = seriesStats[0]
  }

  if (interests.includes("anime")) {
    const animeStats = await sql`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai, 
             SUM(CASE WHEN status = 'watching' THEN 1 ELSE 0 END) as sedang_ditonton 
      FROM anime 
      WHERE user_id = ${session.id}
    `
    stats.anime = animeStats[0]
  }

  if (interests.includes("komik")) {
    const komikStats = await sql`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai, 
             SUM(CASE WHEN status = 'reading' THEN 1 ELSE 0 END) as sedang_dibaca 
      FROM komik 
      WHERE user_id = ${session.id}
    `
    stats.komik = komikStats[0]
  }

  if (interests.includes("novel")) {
    const novelStats = await sql`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai, 
             SUM(CASE WHEN status = 'reading' THEN 1 ELSE 0 END) as sedang_dibaca 
      FROM novel 
      WHERE user_id = ${session.id}
    `
    stats.novel = novelStats[0]
  }

  if (interests.includes("finance")) {
    const financeData = await sql`
      SELECT saldo, pengeluaran_bulan_ini, aset_dimiliki 
      FROM finance 
      WHERE user_id = ${session.id}
    `
    stats.finance = financeData.length > 0 ? financeData[0] : null
  }

  // Get user notes
  const notesResult = await sql`SELECT content FROM user_notes WHERE user_id = ${session.id}`
  const userNote = notesResult.length > 0 ? notesResult[0].content : ""

  return (
    <MainLayout session={session} interests={interests}>
      <div className="space-y-6">
        {/* Notes Section */}
        <NotesSection userId={session.id} initialNote={userNote} />

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interests.includes("film") && (
            <StatisticsCard
              title="Film"
              icon="🎬"
              stats={[
                { label: "Selesai", value: stats.film?.selesai || 0 },
                { label: "Sedang Ditonton", value: stats.film?.sedang_ditonton || 0 },
              ]}
            />
          )}

          {interests.includes("film_series") && (
            <StatisticsCard
              title="Film Series"
              icon="📺"
              stats={[
                { label: "Selesai", value: stats.film_series?.selesai || 0 },
                { label: "Sedang Ditonton", value: stats.film_series?.sedang_ditonton || 0 },
              ]}
            />
          )}

          {interests.includes("anime") && (
            <StatisticsCard
              title="Anime"
              icon="⚡"
              stats={[
                { label: "Selesai", value: stats.anime?.selesai || 0 },
                { label: "Sedang Ditonton", value: stats.anime?.sedang_ditonton || 0 },
              ]}
            />
          )}

          {interests.includes("komik") && (
            <StatisticsCard
              title="Komik"
              icon="📖"
              stats={[
                { label: "Selesai", value: stats.komik?.selesai || 0 },
                { label: "Sedang Dibaca", value: stats.komik?.sedang_dibaca || 0 },
              ]}
            />
          )}

          {interests.includes("novel") && (
            <StatisticsCard
              title="Novel"
              icon="📚"
              stats={[
                { label: "Selesai", value: stats.novel?.selesai || 0 },
                { label: "Sedang Dibaca", value: stats.novel?.sedang_dibaca || 0 },
              ]}
            />
          )}

          {interests.includes("finance") && stats.finance && (
            <StatisticsCard
              title="Finance"
              icon="💰"
              stats={[
                { label: "Saldo", value: `Rp ${(stats.finance.saldo || 0).toLocaleString("id-ID")}` },
                {
                  label: "Pengeluaran Bulan Ini",
                  value: `Rp ${(stats.finance.pengeluaran_bulan_ini || 0).toLocaleString("id-ID")}`,
                },
                { label: "Aset Dimiliki", value: `Rp ${(stats.finance.aset_dimiliki || 0).toLocaleString("id-ID")}` },
              ]}
            />
          )}
        </div>
      </div>
    </MainLayout>
  )
}
