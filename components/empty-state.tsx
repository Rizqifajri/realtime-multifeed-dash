import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Card className="flex min-h-96 flex-col items-center justify-center p-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </Card>
  )
}
