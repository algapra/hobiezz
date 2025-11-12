import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import MainLayout from "@/components/main-layout"
import MediaListPage from "@/components/media-list-page"

export default async function AnimePage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const sql = getDb()

  const interests = await sql`SELECT interest_type FROM user_interests WHERE user_id = ${session.id}`
  const interestsList = interests.map((i) => i.interest_type)

  const page = 1
  const limit = 10
  const offset = (page - 1) * limit

  const anime = await sql`
    SELECT id, judul, tahun, genre, berapa_episode, rating, status 
    FROM anime 
    WHERE user_id = ${session.id} 
    ORDER BY created_at DESC 
    LIMIT ${limit} OFFSET ${offset}
  `

  const countResult = await sql`SELECT COUNT(*) as total FROM anime WHERE user_id = ${session.id}`
  const total = countResult[0].total

  return (
    <MainLayout session={session} interests={interestsList}>
      <MediaListPage
        title="Anime"
        icon="⚡"
        mediaType="anime"
        items={anime}
        total={total}
        page={page}
        limit={limit}
        columns={["judul", "tahun", "berapa_episode", "rating", "status"]}
        columnLabels={{ judul: "Judul", tahun: "Tahun", berapa_episode: "Episode", rating: "Rating", status: "Status" }}
      />
    </MainLayout>
  )
}
