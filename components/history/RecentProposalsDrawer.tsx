"use client"

import React, { useEffect, useState } from "react"
import {
  History,
  Clock,
  DollarSign,
  FileText,
  ExternalLink,
  CheckCircle2,
  X,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface ProposalSummary {
  id: string
  freelancerName?: string
  clientName: string
  projectTitle: string;
  totalBudget: number
  currency: string
  totalEstimatedHours: number
  milestonesCount: number
  status: "draft" | "sent" | "accepted"
  createdAt: string
  acceptedAt?: string | null
}

interface RecentProposalsDrawerProps {
  onRefreshTrigger?: number
  onSelectProposal?: (id: string) => void
}

export function RecentProposalsDrawer({
  onRefreshTrigger,
  onSelectProposal,
}: RecentProposalsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [proposals, setProposals] = useState<ProposalSummary[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchProposals = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/proposals")
      const data = await res.json()
      if (data.success && Array.isArray(data.proposals)) {
        setProposals(data.proposals)
      }
    } catch (err) {
      console.error("Failed to fetch proposals:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProposals()
  }, [onRefreshTrigger])

  useEffect(() => {
    if (isOpen) {
      fetchProposals()
    }
  }, [isOpen])

  const handleCopyLink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const url = `${window.location.origin}/share/${id}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      {/* Trigger Button with Record Counter */}
      <button
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-[10px] bg-white hover:border-[#5D5FEF] border border-[#E2E5E9] text-xs sm:text-sm font-semibold text-[#1B1C31] hover:text-[#5D5FEF] transition-all duration-200 cursor-pointer shadow-xs select-none"
        title="View Recent SOWs"
      >
        <History className="h-4 w-4 text-[#757095] group-hover:text-[#5D5FEF] transition-colors" />
        <span className="hidden sm:inline">Recent SOWs</span>
        <span className="sm:hidden">History</span>
        {proposals.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-[#5D5FEF]/10 text-[#5D5FEF] border border-[#5D5FEF]/20 text-[11px] font-bold">
            {proposals.length}
          </span>
        )}
      </button>

      {/* Slide-over Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1B1C31]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <div className="w-screen max-w-full sm:max-w-md bg-white border-l border-[#E2E5E9] shadow-2xl flex flex-col">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E2E5E9] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-[10px] bg-[#5D5FEF] flex items-center justify-center text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#1B1C31] text-base tracking-tight">
                      Recent Statements of Work
                    </h3>
                    <p className="text-xs text-[#757095]">
                      Saved client contracts and deliverables
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={fetchProposals}
                    disabled={loading}
                    className="p-1.5 rounded-[8px] text-[#757095] hover:text-[#1B1C31] hover:bg-[#F8F9FD] transition cursor-pointer"
                    title="Refresh list"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#5D5FEF]" : ""}`} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-[8px] text-[#757095] hover:text-[#1B1C31] hover:bg-[#F8F9FD] transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body (Scrollable List) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading && proposals.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#757095]">
                    <RefreshCw className="h-6 w-6 animate-spin text-[#5D5FEF] mb-2" />
                    <p className="text-xs font-semibold">Loading saved records...</p>
                  </div>
                ) : proposals.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#757095]">
                    <FileText className="h-10 w-10 text-[#A09DB8] mb-3" />
                    <h4 className="text-sm font-bold text-[#1B1C31]">No proposals yet</h4>
                    <p className="text-xs text-[#757095] max-w-xs mt-1">
                      Generate your first Statement of Work from messy client notes. It will automatically be saved here.
                    </p>
                  </div>
                ) : (
                  proposals.map((item) => {
                    const isAccepted = item.status === "accepted"
                    const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (onSelectProposal) {
                            onSelectProposal(item.id)
                            setIsOpen(false)
                          }
                        }}
                        className="group p-4 rounded-[14px] border border-[#E2E5E9] bg-[#F8F9FD] hover:bg-white hover:border-[#5D5FEF] hover:shadow-xs transition duration-200 cursor-pointer relative"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[11px] font-bold text-[#5D5FEF]">
                                {item.clientName}
                              </span>
                              <span className="text-[#A09DB8]">•</span>
                              <span className="text-[10px] text-[#757095] font-medium">{dateStr}</span>
                            </div>
                            <h4 className="text-sm font-bold text-[#1B1C31] group-hover:text-[#5D5FEF] transition-colors line-clamp-1">
                              {item.projectTitle}
                            </h4>
                          </div>

                          {isAccepted ? (
                            <span className="bg-[#01966B]/10 text-[#01966B] border border-[#01966B]/20 text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0">
                              SIGNED
                            </span>
                          ) : (
                            <span className="bg-[#5D5FEF]/10 text-[#5D5FEF] border border-[#5D5FEF]/20 text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0">
                              DRAFT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#757095] pt-2 border-t border-[#E2E5E9]/60">
                          <span className="font-bold text-[#01966B]">
                            ${item.totalBudget.toLocaleString()} {item.currency}
                          </span>
                          <span className="text-[11px] font-medium">
                            {item.totalEstimatedHours}h • {item.milestonesCount} phases
                          </span>
                        </div>

                        {/* Quick Action Overlay on hover */}
                        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#E2E5E9]">
                          <a
                            href={`/sow/${item.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] font-bold text-[#5D5FEF] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Open SOW</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleCopyLink(e, item.id)}
                              className="p-1 rounded-[6px] border border-[#E2E5E9] bg-white hover:border-[#5D5FEF] text-[#757095] hover:text-[#5D5FEF] transition cursor-pointer"
                              title="Copy Share Link"
                            >
                              {copiedId === item.id ? (
                                <Check className="h-3 w-3 text-[#01966B]" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            <a
                              href={`/share/${item.id}`}
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-[6px] border border-[#E2E5E9] bg-white hover:border-[#5D5FEF] text-[#757095] hover:text-[#5D5FEF] transition"
                              title="Client Preview"
                            >
                              <ChevronRight className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#E2E5E9] bg-[#F8F9FD]">
                <a
                  href="/history"
                  className="w-full saas-btn-dark h-11 text-xs font-semibold rounded-[10px] flex items-center justify-center gap-2"
                >
                  <History className="h-3.5 w-3.5" />
                  <span>Open Full Records Vault</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
