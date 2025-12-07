"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Search className="h-12 w-12 text-foreground/80" />
          </div>
          <div className="space-y-2">
            <h1 className="text-7xl font-bold tracking-tight">404</h1>
            <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
            <CardDescription className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/" className="gap-2 flex items-center">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-full cursor-pointer"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Need help?{' '}
            <Link href="/contact" className="text-foreground underline underline-offset-4 hover:text-foreground/80">
              Contact support
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}