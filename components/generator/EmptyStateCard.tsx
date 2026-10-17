"use client"

import React from "react"
import { Sparkles, ShieldAlert, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface EmptyStateCardProps {
  loading: boolean
  onRunDemo: () => void
}

export function EmptyStateCard({ loading, onRunDemo }: EmptyStateCardProps) {
  if (loading) {
    return (
      <div className="saas-card min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-[20px] bg-[#5D5FEF]/10 border border-[#5D5FEF]/30 flex items-center justify-center text-[#5D5FEF] animate-pulse">
            <ShieldAlert className="h-10 w-10 animate-bounce" />
          </div>
          <Sparkles className="h-6 w-6 text-[#5D5FEF] absolute -top-1 -right-1 animate-spin" />
        </div>
        <h3 className="text-xl font-extrabold text-[#1B1C31] mb-2 tracking-tight">
          Synthesizing Defensive Statement of Work
        </h3>
        <p className="text-sm text-[#757095] max-w-md leading-relaxed mb-6">
          Detecting hidden scope creep triggers, estimating milestone hours, and synthesizing legally protective boundary clauses...
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-[#F8F9FD] border border-[#E2E5E9] px-3 py-1 text-xs font-semibold text-[#757095]">
            Parsing Requirements
          </span>
          <span className="rounded-full bg-[#5D5FEF]/10 border border-[#5D5FEF]/20 px-3 py-1 text-xs font-semibold text-[#5D5FEF]">
            Ring-Fencing Deliverables
          </span>
          <span className="rounded-full bg-[#01966B]/10 border border-[#01966B]/20 px-3 py-1 text-xs font-semibold text-[#01966B]">
            Structuring SOW
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="saas-card-muted border-dashed border-[#E2E5E9] min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
      <div className="h-16 w-16 rounded-[20px] bg-white border border-[#E2E5E9] shadow-xs flex items-center justify-center mb-4 text-[#5D5FEF]">
        <FileText className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-extrabold text-[#1B1C31] mb-2 tracking-tight">
        No Statement of Work Generated Yet
      </h3>
      <p className="text-sm text-[#757095] max-w-md mb-6 leading-relaxed">
        Fill in the client notes or select a quick scenario, then hit{" "}
        <strong className="text-[#1B1C31] font-bold">&quot;Generate Defensive SOW&quot;</strong> to classify in-scope features, milestone estimates, and protective clauses.
      </p>
      <button
        onClick={onRunDemo}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[#E2E5E9] bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1C31] shadow-xs transition hover:border-[#5D5FEF] hover:text-[#5D5FEF] cursor-pointer"
      >
        <Sparkles className="h-4 w-4 text-[#5D5FEF]" />
        Run Demo Preset
      </button>
    </div>
  )
}
