import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatisticsCardProps {
  title: string
  icon: string
  stats: Array<{ label: string; value: string | number }>
}

export default function StatisticsCard({ title, icon, stats }: StatisticsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="font-semibold">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
