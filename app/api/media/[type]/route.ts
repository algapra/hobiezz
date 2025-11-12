import { getSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

const TABLE_NAMES: Record<string, string> = {
  film: "films",
  film_series: "film_series",
  anime: "anime",
  komik: "komik",
  novel: "novel",
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tableName = TABLE_NAMES[type];

    if (!tableName) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const data = await request.json();
    const sql = getDb();

    let result;

    if (tableName === "films") {
      result = await sql`
        INSERT INTO films (user_id, judul, tahun, sinopsis, genre, rating, photo_url, status)
        VALUES (${session.id}, ${data.judul}, ${data.tahun}, ${
        data.sinopsis
      }, ${data.genre}, ${data.rating}, ${data.photo_url}, ${
        data.status || "watching"
      })
        RETURNING *
      `;
    } else if (tableName === "film_series") {
      result = await sql`
        INSERT INTO film_series (user_id, judul, tahun, sinopsis, genre, berapa_episode, rating, photo_url, status)
        VALUES (${session.id}, ${data.judul}, ${data.tahun}, ${
        data.sinopsis
      }, ${data.genre}, ${data.berapa_episode}, ${data.rating}, ${
        data.photo_url
      }, ${data.status || "watching"})
        RETURNING *
      `;
    } else if (tableName === "anime") {
      result = await sql`
        INSERT INTO anime (user_id, judul, tahun, sinopsis, genre, berapa_episode, rating, photo_url, status)
        VALUES (${session.id}, ${data.judul}, ${data.tahun}, ${
        data.sinopsis
      }, ${data.genre}, ${data.berapa_episode}, ${data.rating}, ${
        data.photo_url
      }, ${data.status || "watching"})
        RETURNING *
      `;
    } else if (tableName === "komik") {
      result = await sql`
        INSERT INTO komik (user_id, judul, penulis, sinopsis, genre, rating, photo_url, status)
        VALUES (${session.id}, ${data.judul}, ${data.penulis}, ${
        data.sinopsis
      }, ${data.genre}, ${data.rating}, ${data.photo_url}, ${
        data.status || "reading"
      })
        RETURNING *
      `;
    } else if (tableName === "novel") {
      result = await sql`
        INSERT INTO novel (user_id, judul, penulis, sinopsis, genre, rating, photo_url, status)
        VALUES (${session.id}, ${data.judul}, ${data.penulis}, ${
        data.sinopsis
      }, ${data.genre}, ${data.rating}, ${data.photo_url}, ${
        data.status || "reading"
      })
        RETURNING *
      `;
    }

    return NextResponse.json(result?.[0], { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
