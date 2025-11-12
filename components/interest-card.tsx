"use client"

interface InterestCardProps {
  interest: {
    id: string
    label: string
    icon: string
  }
  selected: boolean
  onToggle: () => void
}

export default function InterestCard({ interest, selected, onToggle }: InterestCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${
        selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <span className="text-2xl">{interest.icon}</span>
      <span className="text-sm font-medium text-center">{interest.label}</span>
    </button>
  )
}
