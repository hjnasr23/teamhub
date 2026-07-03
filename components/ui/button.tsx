import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
          {
            // Variants
            "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-900/10 focus-visible:ring-emerald-500":
              variant === "primary",
            "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 focus-visible:ring-slate-500":
              variant === "secondary",
            "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100 focus-visible:ring-slate-500":
              variant === "outline",
            "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100":
              variant === "ghost",
            "text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400":
              variant === "link",
            "bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-900/10 focus-visible:ring-rose-500":
              variant === "danger",
            // Sizes
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-5 text-base": size === "md",
            "h-13 px-7 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
