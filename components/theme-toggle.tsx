"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-10 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 shadow-lg transition-colors hover:from-blue-600 hover:to-purple-700"
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute left-1 h-8 w-8 rounded-full bg-white shadow-md"
        animate={{
          x: theme === "dark" ? 40 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
      <div className="relative flex w-full items-center justify-between px-2">
        <Sun className="h-4 w-4 text-white" />
        <Moon className="h-4 w-4 text-white" />
      </div>
    </motion.button>
  )
}