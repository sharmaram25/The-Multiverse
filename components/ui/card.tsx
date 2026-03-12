'use client';

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useTheme } from "@/components/theme-provider"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { hoverEffect?: boolean }
>(({ className, hoverEffect = false, ...props }, ref) => {
  const { theme } = useTheme();
  
  const motionProps = hoverEffect
    ? {
        whileHover: theme === 'brutalist' 
          ? { x: -4, y: -4, boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }
          : theme === 'neon'
          ? { scale: 1.02, boxShadow: '0 0 20px rgba(0,243,255,0.4)' }
          : { y: -5, scale: 1.02 },
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      }
    : {}

  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
        theme === 'brutalist' && "border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none",
        theme === 'neon' && "border border-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.2)] rounded-none bg-black/80 backdrop-blur-md",
        theme === 'glass' && "bg-white/5 backdrop-blur-xl border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]",
        hoverEffect && theme === 'minimal' && "hover:shadow-xl hover:shadow-primary/5 cursor-pointer",
        hoverEffect && theme === 'glass' && "hover:bg-white/10 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] cursor-pointer",
        hoverEffect && (theme === 'brutalist' || theme === 'neon') && "cursor-pointer",
        className
      )}
      {...motionProps}
      {...(props as any)}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        theme === 'brutalist' && "font-black uppercase",
        theme === 'neon' && "text-[#00f3ff] drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]",
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
