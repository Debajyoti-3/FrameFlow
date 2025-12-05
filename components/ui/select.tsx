import * as React from "react"

import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-950 dark:text-slate-100 ring-offset-white dark:ring-offset-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-100 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-white [&>option]:text-slate-950 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }

