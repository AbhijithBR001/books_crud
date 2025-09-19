import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function BookCardSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <div className="h-4 bg-muted rounded w-16 animate-pulse" />
            <div className="h-4 bg-muted rounded w-20 animate-pulse" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-muted rounded w-20 animate-pulse" />
            <div className="h-4 bg-muted rounded w-12 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
          <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCardSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-muted rounded w-12 animate-pulse mb-1" />
        <div className="h-3 bg-muted rounded w-24 animate-pulse" />
      </CardContent>
    </Card>
  )
}

export function SearchFilterSkeleton() {
  return (
    <Card className="mb-8 bg-card border-border">
      <CardHeader>
        <div className="h-6 bg-muted rounded w-48 animate-pulse mb-2" />
        <div className="h-4 bg-muted rounded w-64 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-muted rounded animate-pulse" />
          <div className="w-full md:w-48 h-10 bg-muted rounded animate-pulse" />
          <div className="w-full md:w-48 h-10 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
