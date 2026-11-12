'use client';

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface TabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[]
  defaultValue?: string
  className?: string
}

export function Tabs({ tabs, defaultValue, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || tabs[0]?.id)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex space-x-1 rounded-xl bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:bg-white/[0.12] hover:text-foreground"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-lg bg-background shadow"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "rounded-xl bg-card p-6 border border-border",
              activeTab === tab.id ? "block" : "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}
