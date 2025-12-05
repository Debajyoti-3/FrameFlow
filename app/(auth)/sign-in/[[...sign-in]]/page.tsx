"use client";

import { SignIn } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function Page() {
  return (
    <Card className="border-slate-200 shadow-lg">
      <CardContent className="p-0">
        <div className="flex justify-center py-8">
          <SignIn
            appearance={clerkAppearance}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </div>
      </CardContent>
    </Card>
  );
}