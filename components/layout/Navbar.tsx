"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { History, ArrowLeft } from "lucide-react"

interface NavbarProps {
  currentName?: string
  isHistoryPage?: boolean
}

export function Navbar({ currentName, isHistoryPage }: NavbarProps) {
  const pathname = usePathname()
  const [recordCount, setRecordCount] = useState<number | null>(null)
  const [resolvedName, setResolvedName] = useState<string>(currentName?.trim() || "")

  useEffect(() => {
    if (currentName?.trim()) {
      setResolvedName(currentName.trim())
    } else {
      try {
        const saved = localStorage.getItem("scopeguard_freelancer_name")
        if (saved?.trim()) {
          setResolvedName(saved.trim())
        } else {
          setResolvedName("")
        }
      } catch (e) {
        setResolvedName("")
      }
    }
  }, [currentName])

  const historyHref = resolvedName
    ? `/history?name=${encodeURIComponent(resolvedName)}`
    : "/history"

  useEffect(() => {
    // If no name is provided or stored, do not query or display any count badge
    if (!resolvedName) {
      setRecordCount(null)
      return
    }

    async function loadCount() {
      try {
        const res = await fetch(`/api/proposals?name=${encodeURIComponent(resolvedName)}`)
        const data = await res.json()
        if (data.success && typeof data.count === "number" && data.count > 0) {
          setRecordCount(data.count)
        } else {
          setRecordCount(null)
        }
      } catch (e) {
        console.warn("Failed to fetch proposal count:", e)
      }
    }
    loadCount()
  }, [resolvedName, pathname])

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-black/10 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-8 md:px-12 sm:py-4">
        {/* Left: Brand Identity & Modernized Guard Logo */}
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 cursor-pointer items-center gap-2.5 select-none sm:gap-3"
          title="ScopeGuard Home"
        >
          {/* Contemporary Geometric Shield Logo with Scope Diamond Aperture */}
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full drop-shadow-[0_2px_8px_rgba(93,95,239,0.25)]"
            >
              <defs>
                {/* Left Facet Gradient */}
                <linearGradient id="facetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5D5FEF" />
                  <stop offset="100%" stopColor="#4345CF" />
                </linearGradient>

                {/* Right Facet Gradient */}
                <linearGradient id="facetRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7E80FF" />
                  <stop offset="100%" stopColor="#5D5FEF" />
                </linearGradient>

                {/* Ambient Center Glow */}
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#EEF0FF" stopOpacity="0.7" />
                </radialGradient>
              </defs>

              {/* Left Shield Facet */}
              <path
                d="M18 3L6 8.2V17.8C6 25.2 11.2 31.4 18 33.2V3Z"
                fill="url(#facetLeft)"
              />

              {/* Right Shield Facet */}
              <path
                d="M18 3L30 8.2V17.8C30 25.2 24.8 31.4 18 33.2V3Z"
                fill="url(#facetRight)"
              />

              {/* Minimalist Outer Shield Hairline Border */}
              <path
                d="M18 3L30 8.2V17.8C30 25.2 24.8 31.4 18 33.2C11.2 31.4 6 25.2 6 17.8V8.2L18 3Z"
                stroke="white"
                strokeWidth="1.25"
                strokeOpacity="0.4"
                strokeLinejoin="round"
              />

              {/* Central Diamond Scope Aperture (Represents the focused scope within the guard) */}
              <path
                d="M18 10.5L23.5 17L18 23.5L12.5 17L18 10.5Z"
                fill="url(#centerGlow)"
              />

              {/* Core Precision Pivot Pin */}
              <circle cx="18" cy="17" r="2.2" fill="#5D5FEF" />
            </svg>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-sans text-xl font-extrabold tracking-tight text-[#1B1C31] sm:text-2xl">
              ScopeGuard
            </span>
            <span className="hidden shrink-0 items-center rounded-full bg-[#5D5FEF]/10 px-2.5 py-0.5 text-[11px] font-bold tracking-tight text-[#5D5FEF] border border-[#5D5FEF]/15 sm:inline-flex">
              SOW Protector
            </span>
          </div>
        </Link>

        {/* Right Navigation: Clean, Minimal without "+ New SOW" */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isHistoryPage ? (
            <Link
              href="/"
              className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-black/[0.08] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#1B1C31] transition-all duration-200 hover:border-[#5D5FEF] hover:text-[#5D5FEF] hover:shadow-xs sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Generator</span>
            </Link>
          ) : (
            <Link
              href={historyHref}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-black/[0.08] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#1B1C31] transition-all duration-200 hover:border-[#5D5FEF] hover:text-[#5D5FEF] hover:shadow-xs sm:px-4 sm:py-2 sm:text-sm"
            >
              <History className="h-4 w-4 text-[#757095] group-hover:text-[#5D5FEF] transition-colors" />
              <span className="hidden sm:inline">Saved SOWs</span>
              <span className="sm:hidden">History</span>
              {recordCount !== null && recordCount > 0 && (
                <span className="ml-1 rounded-full bg-[#5D5FEF]/10 border border-[#5D5FEF]/20 px-2 py-0.5 text-[11px] font-bold text-[#5D5FEF]">
                  {recordCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
