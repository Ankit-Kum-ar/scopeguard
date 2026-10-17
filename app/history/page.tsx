"use client"

import React, { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { 
  History, 
  Search, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  RefreshCw, 
  Sparkles, 
  User, 
  X,
  Share2
} from "lucide-react"
import { ProposalSummary } from "@/components/history/RecentProposalsDrawer"

function HistoryContent() {
  const searchParams = useSearchParams()
  const nameQuery = searchParams.get("name") || ""

  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState<ProposalSummary[]>([])
  const [searchQuery, setSearchQuery] = useState(nameQuery)
  const [activeFilterName, setActiveFilterName] = useState(nameQuery)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchProposals = async (name?: string) => {
    const trimmed = name?.trim()
    if (!trimmed) {
      setLoading(false)
      setProposals([])
      return
    }

    setLoading(true)
    try {
      const url = `/api/proposals?name=${encodeURIComponent(trimmed)}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success && Array.isArray(data.proposals)) {
        setProposals(data.proposals)
      } else {
        setProposals([])
      }
    } catch (err) {
      console.error("Failed to load proposals:", err)
      setProposals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (nameQuery.trim()) {
      setSearchQuery(nameQuery.trim())
      setActiveFilterName(nameQuery.trim())
      fetchProposals(nameQuery.trim())
      return
    }

    // Check if there is a remembered freelancer name from the generator
    try {
      const saved = localStorage.getItem("scopeguard_freelancer_name")
      if (saved?.trim()) {
        setSearchQuery(saved.trim())
        setActiveFilterName(saved.trim())
        fetchProposals(saved.trim())
        return
      }
    } catch (e) {}

    // Without a name, do not fetch or display any history
    setLoading(false)
    setProposals([])
    setActiveFilterName("")
  }, [nameQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    setActiveFilterName(trimmed)
    try {
      localStorage.setItem("scopeguard_freelancer_name", trimmed)
    } catch (e) {}
    fetchProposals(trimmed)
  }

  const handleClearFilter = () => {
    setSearchQuery("")
    setActiveFilterName("")
    setProposals([])
    try {
      localStorage.removeItem("scopeguard_freelancer_name")
    } catch (e) {}
  }

  const handleCopyLink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const url = `${window.location.origin}/sow/${id}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Cumulative Metrics for current filtered view
  const totalBudget = proposals.reduce((acc, p) => acc + (p.totalBudget || 0), 0)
  const totalHours = proposals.reduce((acc, p) => acc + (p.totalEstimatedHours || 0), 0)
  const signedCount = proposals.filter((p) => p.status === "accepted").length

  return (
    <div className="min-h-screen bg-[#F9FAFD] text-[#1B1C31] relative">
      {/* Background Ambient Mesh & Grid */}
      <div className="saas-ambient-mesh" />
      <div className="fixed inset-0 saas-grid-pattern pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar isHistoryPage={true} currentName={activeFilterName} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* If no name is provided yet, show Identity Lookup Prompt Card */}
        {!activeFilterName ? (
          <div className="max-w-lg mx-auto py-8">
            <div className="saas-card p-8 sm:p-10 text-center">
              <div className="h-16 w-16 rounded-[20px] bg-[#5D5FEF]/10 border border-[#5D5FEF]/25 flex items-center justify-center text-[#5D5FEF] mx-auto mb-6">
                <User className="h-8 w-8" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5D5FEF]/10 text-[#5D5FEF] text-[11px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Private SOW Vault</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1C31] tracking-tight mb-3">
                Enter Your Name
              </h1>

              <p className="text-sm text-[#757095] mb-8 leading-relaxed max-w-sm mx-auto">
                To protect client privacy, enter your <strong>Freelancer Name</strong> or <strong>Client Name</strong> to retrieve your MongoDB quotation history.
              </p>

              <form onSubmit={handleSearchSubmit} className="space-y-4 text-left">
                <div className="space-y-2">
                  <label htmlFor="historyNameInput" className="text-xs font-bold uppercase tracking-wider text-[#757095] block">
                    Freelancer or Client Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#757095]" />
                    <input
                      id="historyNameInput"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Alex Rivera, Acme Corp, or Studio"
                      className="w-full bg-white border border-[#E2E5E9] rounded-[10px] pl-10 pr-4 py-3 text-sm text-[#1B1C31] placeholder:text-[#A09DB8] focus:border-[#5D5FEF] focus:ring-2 focus:ring-[#5D5FEF]/20 outline-none h-12"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="saas-btn-primary w-full h-12 text-sm font-bold rounded-[10px] justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Access Quotation History
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Header Block */}
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5D5FEF]/10 border border-[#5D5FEF]/20 text-[#5D5FEF] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Statements of Work Vault</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B1C31] tracking-tight mb-3">
                SOWs for <span className="text-[#5D5FEF]">&quot;{activeFilterName}&quot;</span>
              </h1>
              <p className="text-[#757095] text-sm sm:text-base">
                Review contractual deliverables, protected rates, and signed scopes.
              </p>
            </div>

            {/* Cumulative Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="saas-card p-5">
                <div className="flex items-center justify-between text-[#757095] text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Total Contract Value</span>
                  <DollarSign className="h-4 w-4 text-[#01966B]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#01966B] tracking-tight">
                  ${totalBudget.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#757095] mt-1 font-medium">Across {proposals.length} SOW document{proposals.length !== 1 ? "s" : ""}</div>
              </div>

              <div className="saas-card p-5">
                <div className="flex items-center justify-between text-[#757095] text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Ring-Fenced Work</span>
                  <Clock className="h-4 w-4 text-[#5D5FEF]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1B1C31] tracking-tight">
                  {totalHours} <span className="text-sm font-semibold text-[#757095]">hours</span>
                </div>
                <div className="text-[11px] text-[#757095] mt-1 font-medium">Contractually bounded baseline</div>
              </div>

              <div className="saas-card p-5">
                <div className="flex items-center justify-between text-[#757095] text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Accepted Contracts</span>
                  <ShieldCheck className="h-4 w-4 text-[#01966B]" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1B1C31] tracking-tight">
                  {signedCount} <span className="text-sm font-semibold text-[#757095]">/ {proposals.length}</span>
                </div>
                <div className="text-[11px] text-[#757095] mt-1 font-medium">Sign-off conversion rate</div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#757095]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by client, project title, or other keywords..."
                  className="w-full bg-white border border-[#E2E5E9] rounded-[10px] pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#1B1C31] placeholder:text-[#A09DB8] focus:outline-none focus:border-[#5D5FEF] focus:ring-2 focus:ring-[#5D5FEF]/20 shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearFilter}
                    className="absolute right-3 top-3 text-[#757095] hover:text-[#1B1C31] cursor-pointer"
                    title="Change user / clear filter"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#757095] font-semibold">Active Name:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5D5FEF]/10 text-[#5D5FEF] border border-[#5D5FEF]/20 text-xs font-bold">
                  <User className="h-3 w-3" />
                  <span>{activeFilterName}</span>
                  <button onClick={handleClearFilter} className="hover:text-[#1B1C31] ml-0.5 cursor-pointer" title="Switch Name">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            </div>

            {/* Proposals List / Grid */}
            {loading ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
                <RefreshCw className="h-8 w-8 text-[#5D5FEF] animate-spin mb-3" />
                <p className="text-xs text-[#757095] font-semibold">Loading SOW records for &quot;{activeFilterName}&quot;...</p>
              </div>
            ) : proposals.length === 0 ? (
              <div className="p-12 text-center rounded-[20px] bg-[#F8F9FD] border border-dashed border-[#E2E5E9]">
                <FileText className="h-10 w-10 text-[#757095] mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-[#1B1C31] mb-1">No Statements of Work found</h3>
                <p className="text-xs sm:text-sm text-[#757095] max-w-sm mx-auto mb-6">
                  No SOW documents recorded under &quot;{activeFilterName}&quot;.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleClearFilter}
                    className="inline-flex items-center justify-center rounded-[10px] border border-[#E2E5E9] bg-white px-4 py-2 text-xs font-semibold text-[#1B1C31] hover:border-[#5D5FEF] transition h-10 shadow-xs cursor-pointer"
                  >
                    Search Another Name
                  </button>
                  <Link
                    href="/"
                    className="saas-btn-primary h-10 text-xs font-bold rounded-[10px] px-4"
                  >
                    <span>Create New SOW</span>
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180 ml-2" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposals.map((p) => (
              <div
                key={p.id}
                className="saas-card p-5 group flex flex-col justify-between hover:border-[#5D5FEF]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F8F9FD] border border-[#E2E5E9] text-[#1B1C31] inline-block">
                        {p.clientName}
                      </span>
                      {p.freelancerName && (
                        <div className="text-[10px] font-medium text-[#757095] pl-1">
                          By <span className="font-semibold text-[#1B1C31]">{p.freelancerName}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${
                        p.status === "accepted"
                          ? "bg-[#01966B]/10 text-[#01966B] border-[#01966B]/20"
                          : "bg-[#5D5FEF]/10 text-[#5D5FEF] border-[#5D5FEF]/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#1B1C31] mb-3 group-hover:text-[#5D5FEF] transition-colors line-clamp-2">
                    {p.projectTitle}
                  </h3>

                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className="flex items-center justify-between text-[#757095]">
                      <span>Value:</span>
                      <strong className="text-[#01966B] font-bold">${p.totalBudget.toLocaleString()} {p.currency}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#757095]">
                      <span>Scope:</span>
                      <span className="text-[#1B1C31] font-semibold">{p.totalEstimatedHours} hrs ({p.milestonesCount} phases)</span>
                    </div>
                    <div className="flex items-center justify-between text-[#757095] text-[11px]">
                      <span>Created:</span>
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#E2E5E9] flex items-center justify-between gap-2">
                  <Link
                    href={`/sow/${p.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#5D5FEF] hover:underline font-bold"
                  >
                    <span>View SOW</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyLink(e, p.id)}
                      className="p-1.5 rounded-[8px] border border-[#E2E5E9] bg-white hover:border-[#5D5FEF] text-[#757095] hover:text-[#5D5FEF] transition cursor-pointer"
                      title="Copy link to SOW"
                    >
                      {copiedId === p.id ? (
                        <Check className="h-3.5 w-3.5 text-[#01966B]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <Link
                      href={`/share/${p.id}`}
                      target="_blank"
                      className="p-1.5 rounded-[8px] border border-[#E2E5E9] bg-white hover:border-[#5D5FEF] text-[#757095] hover:text-[#5D5FEF] transition"
                      title="Client Share View"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    )}
  </main>
</div>
  )
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center text-[#1B1C31]">
        <RefreshCw className="h-6 w-6 animate-spin text-[#5D5FEF]" />
      </div>
    }>
      <HistoryContent />
    </Suspense>
  )
}
