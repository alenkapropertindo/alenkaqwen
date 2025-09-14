import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-base font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-lg",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Custom variants for product categories
        strategis:
          "border-transparent bg-purple-500 text-white hover:bg-purple-600 shadow-[0_0_12px_#a855f7] animate-pulse",
        promo:
          "border-transparent bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-[0_0_15px_#f59e0b] animate-pulse transform hover:scale-110 transition-all duration-300 font-extrabold",
        dp_rendah:
          "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-[0_0_12px_#10b981] animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
