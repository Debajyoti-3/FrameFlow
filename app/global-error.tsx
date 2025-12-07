'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-linear-to-br from-red-50 to-white flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-r from-red-100 to-orange-100">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-600">
                CRITICAL ERROR
              </CardTitle>
              <h1 className="text-2xl font-bold tracking-tight">Something Went Wrong</h1>
              <CardDescription className="text-muted-foreground">
                We've encountered a critical application error. Please refresh the page or return to the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={reset}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button asChild className="gap-2 bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                  <a href="/">
                    <Home className="h-4 w-4" />
                    Go Home
                  </a>
                </Button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg text-left">
                  <h3 className="font-medium text-red-800 mb-2">Error Details:</h3>
                  <pre className="text-xs text-red-700 overflow-auto">
                    {error.message}
                  </pre>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-2">
                      Error Digest: {error.digest}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              If the problem persists, please{' '}
              <a href="/contact" className="text-red-600 hover:text-red-700 font-medium">
                contact support
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}