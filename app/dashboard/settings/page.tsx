import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { getDb } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const sql = getDb()
  const interestsResult = await sql`SELECT interest_type FROM user_interests WHERE user_id = ${session.id}`
  const interests = interestsResult.map((i) => i.interest_type)

  return (
    <MainLayout session={session} interests={interests}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        {/* Interests Management Card */}
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
            <CardDescription>Update or modify your tracked interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Currently tracking:</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span key={interest} className="inline-block bg-muted px-3 py-1 rounded-full text-sm">
                      {interest.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/dashboard/update-interests">
                <Button className="w-full sm:w-auto">Update Interests</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Account Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{session.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
