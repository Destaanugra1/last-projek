"use client"

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePreloaderDone } from "@/hooks/use-preloader-done"

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useAcetSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) throw new Error("useAcetSidebar must be used within <AcetSidebar>")
  return context
}

export function AcetSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function AcetSidebarBody({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { open, setOpen } = useAcetSidebar()
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [mounted, setMounted] = useState(false)
  // Sidebar (desktop) hanya dirender setelah preloader selesai
  const preloaderDone = usePreloaderDone()

  useEffect(() => {
    setMounted(true)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(true)
  }, [setOpen])

  const handleMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => setOpen(false), 300)
  }, [setOpen])

  // Desktop sidebar: dirender via portal ke document.body agar position:fixed
  // tidak terpengaruh oleh overflow-clip / transform / will-change parent manapun.
  // Hanya dirender setelah preloader selesai (preloaderDone === true).
  const desktopSidebar = (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-[9998]",
        "hidden md:flex flex-col",
        "overflow-hidden",
        "transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn("flex-1 min-h-0 overflow-y-auto", className)}>
        {children}
      </div>
    </aside>
  )

  return (
    <>
      {/* Portal ke body — bebas dari stacking context parent.
          Tidak dirender sama sekali selama preloader aktif. */}
      {mounted && preloaderDone && createPortal(desktopSidebar, document.body)}

      {/* Mobile drawer (tetap inline, tidak fixed terhadap viewport) */}
      <AcetMobileSidebar>
        <div className={cn("h-full", className)}>
          {children}
        </div>
      </AcetMobileSidebar>
    </>
  )
}

function AcetMobileSidebar({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useAcetSidebar()
  const preloaderDone = usePreloaderDone()

  // Mobile drawer juga tidak dirender saat preloader aktif
  if (!preloaderDone) return null

  return (
    <div className="lb-acet-mobile-bar">
      <button
        className="lb-mobile-menu-btn"
        aria-label="Buka menu"
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="lb-acet-mobile-drawer"
          >
            <button
              className="lb-mobile-close-btn"
              aria-label="Tutup menu"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AcetSidebarText({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { open } = useAcetSidebar()
  return (
    <div
      className={cn(
        "transition-all duration-300 overflow-hidden whitespace-nowrap",
        open ? "opacity-100 max-w-60" : "opacity-0 max-w-0",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AcetSidebarLink({
  href,
  icon,
  label,
  isActive,
  className,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
  className?: string
}) {
  const { open } = useAcetSidebar()
  return (
    <Link
      href={href}
      className={cn(
        "lb-acet-nav-link",
        isActive && "is-active",
        className,
      )}
    >
      <span className="lb-acet-nav-link__icon">{icon}</span>
      <span
        className={cn(
          "lb-acet-nav-link__label",
          "transition-all duration-300 overflow-hidden whitespace-nowrap",
          open ? "opacity-100 max-w-60" : "opacity-0 max-w-0",
        )}
      >
        {label}
      </span>
    </Link>
  )
}
