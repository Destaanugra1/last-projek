"use client"

import React, { createContext, useContext, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useAcetSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) throw new Error("useAcetSidebar must be used within <AcetSidebar>")
  return context
}

export function AcetSidebar({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) {
  const [openState, setOpenState] = useState(false)
  const open = openProp ?? openState
  const setOpen = setOpenProp ?? setOpenState
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
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
  const { open, setOpen, animate } = useAcetSidebar()
  return (
    <>
      {/* Desktop — shown via CSS @media (min-width: 768px) */}
      <motion.div
        className={cn("lb-acet-desktop", className)}
        animate={{ width: animate ? (open ? "260px" : "64px") : "260px" }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </motion.div>

      {/* Mobile — hidden via CSS @media (min-width: 768px) */}
      <AcetMobileSidebar>{children}</AcetMobileSidebar>
    </>
  )
}

function AcetMobileSidebar({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useAcetSidebar()
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
  const { open, animate } = useAcetSidebar()
  return (
    <motion.div
      className={cn("lb-acet-collapsible-text", className)}
      animate={{
        opacity: animate ? (open ? 1 : 0) : 1,
        width: animate ? (open ? "auto" : 0) : "auto",
        height: animate ? (open ? "auto" : 0) : "auto",
      }}
      transition={{ duration: 0.18, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
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
  const { open, animate } = useAcetSidebar()
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
      <motion.span
        className="lb-acet-nav-link__label"
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          width: animate ? (open ? "auto" : 0) : "auto",
        }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      >
        {label}
      </motion.span>
    </Link>
  )
}
