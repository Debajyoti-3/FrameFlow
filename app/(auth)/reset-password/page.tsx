import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-12 text-slate-900 dark:text-slate-100"/>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
