import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db"
import MainLayout from "@/components/main-layout"
import MediaListPage from "@/components/media-list-page"

export default async function FilmPage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const sql = getDb()

  const interests = await sql`SELECT interest_type FROM user_interests WHERE user_id = ${session.id}`
  const interestsList = interests.map((i) => i.interest_type)

  // Get paginated films
  const page = 1
  const limit = 10
  const offset = (page - 1) * limit

  const films = await sql`
    SELECT id, judul, tahun, genre, rating, status 
    FROM films 
    WHERE user_id = ${session.id} 
    ORDER BY created_at DESC 
    LIMIT ${limit} OFFSET ${offset}
  `

  const countResult = await sql`SELECT COUNT(*) as total FROM films WHERE user_id = ${session.id}`
  const total = countResult[0].total

  return (
    <MainLayout session={session} interests={interestsList}>
      <MediaListPage
        title="Film"
        icon="🎬"
        mediaType="film"
        items={films}
        total={total}
        page={page}
        limit={limit}
        columns={["judul", "tahun", "genre", "rating", "status"]}
        columnLabels={{ judul: "Judul", tahun: "Tahun", genre: "Genre", rating: "Rating", status: "Status" }}
      />
    </MainLayout>
  )
}
