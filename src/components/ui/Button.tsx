import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gray-700 text-white shadow border-2 border-gray-600 hover:bg-gray-600 hover:border-red-600 hover:shadow-lg hover:shadow-red-600/50 active:scale-95",
        destructive:
          "bg-gray-700 border-2 border-red-500/50 text-white shadow-sm hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/50 active:scale-95",
        outline:
          "border-2 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white hover:border-red-600 hover:shadow-lg hover:shadow-red-600/30 active:scale-95",
        secondary:
          "bg-gray-800 text-gray-300 border-2 border-gray-700 shadow-sm hover:bg-gray-700 hover:text-white hover:border-red-600 hover:shadow-lg hover:shadow-red-600/30 active:scale-95",
        ghost:
          "text-gray-400 hover:bg-gray-800 hover:text-white active:scale-95",
        link:
          "text-red-600 underline-offset-4 hover:underline hover:text-red-500",
        neon:
          "bg-gray-700 border-2 border-gray-600 text-white shadow-md hover:border-red-600 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-400/20 hover:shadow-2xl hover:shadow-red-600/60 hover:scale-105 active:scale-95 font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
