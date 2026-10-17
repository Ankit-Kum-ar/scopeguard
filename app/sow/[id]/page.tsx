"use client"

import React, { useEffect, useState, use, useRef } from "react"
import Link from "next/link"
import { 
  Clock, 
  DollarSign, 
  Zap, 
  Sparkles, 
  Download, 
  Check, 
  Copy, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  ShieldAlert, 
  XCircle, 
  ShieldCheck,
  ArrowLeft,
  FileText
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalDocument } from "@/lib/store"
import { exportProposalToPdf } from "@/lib/pdf-export"

export default function SowDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const proposalId = resolvedParams.id

  const [proposal, setProposal] = useState<ProposalDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [copiedMarkdown, setCopiedMarkdown] = useState(false)
  const [copiedShareLink, setCopiedShareLink] = useState(false)
  const [activeTab, setActiveTab] = useState("milestones")
  const [error, setError] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadProposal() {
      try {
        const res = await fetch(`/api/proposals/${proposalId}`)
        const data = await res.json()
        if (data.success && data.proposal) {
          setProposal(data.proposal)
        } else {
          setError(data.error || "Statement of Work not found.")
        }
      } catch (err) {
        console.error("Failed to load proposal:", err)
        setError("Error loading Statement of Work.")
      } finally {
        setLoading(false)
      }
    }

    if (proposalId) {
      loadProposal()
    }
  }, [proposalId])

  const generateMarkdownSOW = (p: ProposalDocument) => {
    return `# Statement of Work (SOW): ${p.projectTitle}
**Client:** ${p.clientName}
**Total Estimated Budget:** ${p.currency} $${p.totalBudget.toLocaleString()} (${p.totalEstimatedHours} hours @ ${p.currency} $${p.hourlyRate}/hr)
**Status:** ${p.status.toUpperCase()}
**Date:** ${new Date(p.createdAt).toLocaleDateString()}

---

## 1. Project Milestones & Deliverables
${p.milestones
  .map(
    (m, idx) => `
### Milestone ${idx + 1}: ${m.title}
- **Estimated Hours:** ${m.hours} hrs
- **Subtotal:** ${p.currency} $${m.cost.toLocaleString()}
- **Deliverables:**
${m.deliverables.map((d) => `  * ${d}`).join("\n")}
`
  )
  .join("\n")}

---

## 2. Scope Boundaries

### [IN-SCOPE] Included in Baseline Estimate:
${p.inScope.map((i) => `- [x] ${i}`).join("\n")}

### [OUT-OF-SCOPE] Explicit Exclusions:
${p.outOfScope.map((o) => `- [ ] EXCLUDED: ${o}`).join("\n")}

---

## 3. Scope-Creep & Change Order Protection Policy
> ${p.changeOrderPolicy}

---

## 4. Payment Schedule
| Phase | Percentage | Amount | Timing |
| :--- | :--- | :--- | :--- |
${p.paymentSchedule
  .map(
    (pay) =>
      `| ${pay.phase} | ${pay.percentage}% | ${p.currency} $${pay.amount.toLocaleString()} | ${pay.timing} |`
  )
  .join("\n")}

*Generated securely with ScopeGuard (Powered by AI).*
`
  }

  const handleCopyMarkdown = () => {
    if (!proposal) return
    const md = generateMarkdownSOW(proposal)
    navigator.clipboard.writeText(md)
    setCopiedMarkdown(true)
    setTimeout(() => setCopiedMarkdown(false), 2000)
  }

  const handleCopyShareLink = () => {
    if (!proposal?._id) return
    const url = `${window.location.origin}/share/${proposal._id}`
    navigator.clipboard.writeText(url)
    setCopiedShareLink(true)
    setTimeout(() => setCopiedShareLink(false), 2000)
  }

  const handleDownloadPdf = async () => {
    if (!proposal) return
    setExportingPdf(true)
    try {
      await exportProposalToPdf(previewRef.current, proposal)
    } catch (err) {
      console.error("PDF export failed:", err)
      alert("Failed to export PDF.")
    } finally {
      setExportingPdf(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFD] text-[#1B1C31] relative print:min-h-0 print:bg-white print:p-0 print:m-0 print:overflow-visible">
      {/* Background Ambient Glow & Grid */}
      <div className="saas-ambient-mesh print:hidden" />
      <div className="fixed inset-0 saas-grid-pattern pointer-events-none -z-10 print:hidden" />

      {/* Top Navbar */}
      <div className="no-print print:hidden">
        <Navbar currentName={proposal?.freelancerName || proposal?.clientName} />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 relative z-10 print:max-w-none print:p-0 print:m-0">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between gap-4 mb-6 no-print print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1B1C31] hover:text-[#5D5FEF] transition px-3.5 py-2 rounded-[10px] border border-[#E2E5E9] bg-white shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Generator</span>
          </Link>

          {proposal && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#757095]">
              <span>SOW Ref:</span>
              <span className="text-[#5D5FEF] bg-[#5D5FEF]/10 px-2.5 py-0.5 rounded-[6px] border border-[#5D5FEF]/20 font-bold">
                {proposal._id?.toString().slice(-8).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-8">
            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-[20px] bg-[#5D5FEF]/10 border border-[#5D5FEF]/30 flex items-center justify-center text-[#5D5FEF] animate-pulse">
                <Sparkles className="h-8 w-8 animate-spin" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-[#1B1C31] mb-1 tracking-tight">Loading Statement of Work...</h3>
            <p className="text-sm text-[#757095]">Retrieving protected deliverables and legal clauses.</p>
          </div>
        )}

        {error && (
          <div className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 border border-[#E2E5E9] rounded-[20px] bg-white saas-card">
            <FileText className="h-12 w-12 text-[#FF7F5C] mb-3" />
            <h3 className="text-lg font-bold text-[#1B1C31] mb-1">Unable to Load SOW</h3>
            <p className="text-xs text-[#757095] max-w-md mb-6">{error}</p>
            <Link
              href="/"
              className="saas-btn-primary px-5 py-2.5 text-xs font-semibold"
            >
              Return to Generator
            </Link>
          </div>
        )}

        {proposal && !loading && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
            {/* Top 3 Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 no-print print:hidden">
              <div className="saas-card p-5">
                <div className="flex items-center gap-2 text-[#757095] text-xs font-bold uppercase tracking-wider mb-2">
                  <Clock className="h-4 w-4 text-[#5D5FEF]" />
                  Total Estimated Hours
                </div>
                <div className="text-3xl font-extrabold text-[#1B1C31] tracking-tight">
                  {proposal.totalEstimatedHours} <span className="text-sm font-semibold text-[#757095]">hrs</span>
                </div>
              </div>

              <div className="saas-card p-5">
                <div className="flex items-center gap-2 text-[#757095] text-xs font-bold uppercase tracking-wider mb-2">
                  <DollarSign className="h-4 w-4 text-[#01966B]" />
                  Total Contract Value
                </div>
                <div className="text-3xl font-extrabold text-[#01966B] tracking-tight">
                  ${proposal.totalBudget.toLocaleString()}{" "}
                  <span className="text-sm font-semibold text-[#757095]">{proposal.currency}</span>
                </div>
              </div>

              <div className="saas-card p-5">
                <div className="flex items-center gap-2 text-[#757095] text-xs font-bold uppercase tracking-wider mb-2">
                  <Zap className="h-4 w-4 text-[#5D5FEF]" />
                  Protected Hourly Rate
                </div>
                <div className="text-3xl font-extrabold text-[#1B1C31] tracking-tight">
                  ${proposal.hourlyRate} <span className="text-sm font-semibold text-[#757095]">/hr</span>
                </div>
              </div>
            </div>

            {/* Complete SOW Document Container */}
            <div ref={previewRef} className="saas-card print:border-none print:shadow-none print:rounded-none print-page">
              <div className="border-b border-[#E2E5E9] p-5 sm:p-8 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                      <span className="rounded-full bg-[#5D5FEF]/10 border border-[#5D5FEF]/20 px-3 py-0.5 text-[11px] font-bold text-[#5D5FEF] uppercase">
                        {proposal.status}
                      </span>
                      {proposal.freelancerName && (
                        <span className="text-xs text-[#757095]">
                          Freelancer: <strong className="text-[#1B1C31] font-bold">{proposal.freelancerName}</strong>
                        </span>
                      )}
                      <span className="text-xs text-[#757095]">
                        Client: <strong className="text-[#1B1C31] font-bold">{proposal.clientName}</strong>
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1C31] tracking-tight">
                      {proposal.projectTitle}
                    </h1>
                  </div>

                  {/* Actions Toolbar - 2x2 Grid on Mobile, Flex on Desktop */}
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 no-print print:hidden">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={exportingPdf}
                      className="saas-btn-primary h-10 text-xs rounded-[10px] px-3.5 sm:px-4 cursor-pointer justify-center"
                    >
                      {exportingPdf ? (
                        <>
                          <Sparkles className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Exporting PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download PDF
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCopyMarkdown}
                      className="inline-flex items-center justify-center rounded-[10px] border border-[#E2E5E9] bg-white px-3 sm:px-3.5 py-2 text-xs font-semibold text-[#1B1C31] hover:border-[#5D5FEF] hover:text-[#5D5FEF] transition h-10 shadow-xs cursor-pointer"
                    >
                      {copiedMarkdown ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1.5 text-[#01966B]" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1.5 text-[#757095]" />
                          Copy Markdown
                        </>
                      )}
                    </button>

                    {proposal._id && (
                      <button
                        onClick={handleCopyShareLink}
                        className="inline-flex items-center justify-center rounded-[10px] border border-[#E2E5E9] bg-white px-3 sm:px-3.5 py-2 text-xs font-semibold text-[#1B1C31] hover:border-[#5D5FEF] hover:text-[#5D5FEF] transition h-10 shadow-xs cursor-pointer"
                      >
                        {copiedShareLink ? (
                          <>
                            <Check className="h-3.5 w-3.5 mr-1.5 text-[#01966B]" />
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <Share2 className="h-3.5 w-3.5 mr-1.5 text-[#5D5FEF]" />
                            Share Link
                          </>
                        )}
                      </button>
                    )}

                    {proposal._id && (
                      <a
                        href={`/share/${proposal._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-[10px] border border-[#5D5FEF]/30 bg-[#5D5FEF]/10 px-3 sm:px-3.5 py-2 text-xs font-semibold text-[#5D5FEF] hover:bg-[#5D5FEF]/20 transition h-10"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Client View
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-[#F8F9FD] border border-[#E2E5E9] p-1 mb-8 rounded-[12px] flex flex-wrap h-auto gap-1">
                    <TabsTrigger
                      value="milestones"
                      className="text-xs sm:text-sm rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#1B1C31] data-[state=active]:shadow-xs text-[#757095] font-semibold py-2 px-3.5"
                    >
                      Milestones ({proposal.milestones.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="boundaries"
                      className="text-xs sm:text-sm rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#1B1C31] data-[state=active]:shadow-xs text-[#757095] font-semibold py-2 px-3.5"
                    >
                      Scope Boundaries ({proposal.inScope.length + proposal.outOfScope.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="policy"
                      className="text-xs sm:text-sm rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#1B1C31] data-[state=active]:shadow-xs text-[#757095] font-semibold py-2 px-3.5"
                    >
                      Change Order Policy
                    </TabsTrigger>
                    <TabsTrigger
                      value="payments"
                      className="text-xs sm:text-sm rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#1B1C31] data-[state=active]:shadow-xs text-[#757095] font-semibold py-2 px-3.5"
                    >
                      Payment Schedule
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Milestones */}
                  <TabsContent value="milestones" className="space-y-4">
                    {proposal.milestones.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="p-5 rounded-[16px] border border-[#E2E5E9] bg-[#F8F9FD] hover:border-[#5D5FEF]/40 transition shadow-xs space-y-3 break-inside-avoid print:break-inside-avoid"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E5E9] pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#5D5FEF]/10 text-[#5D5FEF] border border-[#5D5FEF]/20">
                              Phase 0{idx + 1}
                            </span>
                            <h3 className="text-base font-extrabold text-[#1B1C31]">{m.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#01966B]">
                              ${m.cost.toLocaleString()}
                            </span>
                            <span className="text-xs text-[#757095] font-medium">
                              ({m.hours} hrs @ ${proposal.hourlyRate}/hr)
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#757095]">
                            Included Deliverables:
                          </div>
                          <ul className="space-y-1.5 pl-1">
                            {m.deliverables.map((d, dIdx) => (
                              <li key={dIdx} className="text-xs sm:text-sm text-[#1B1C31] flex items-start gap-2.5">
                                <span className="text-[#5D5FEF] font-bold mt-0.5">•</span>
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  {/* Tab 2: Scope Matrix */}
                  <TabsContent value="boundaries" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* In Scope */}
                      <div className="p-5 rounded-[16px] border border-[#01966B]/25 bg-[#01966B]/5 space-y-4 break-inside-avoid print:break-inside-avoid">
                        <div className="flex items-center gap-2 text-[#01966B] font-bold text-sm border-b border-[#01966B]/20 pb-3">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>IN-SCOPE (Included in Baseline)</span>
                        </div>
                        <ul className="space-y-2.5">
                          {proposal.inScope.map((item, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-[#1B1C31] flex items-start gap-2.5 font-medium">
                              <Check className="h-4 w-4 text-[#01966B] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Out of Scope */}
                      <div className="p-5 rounded-[16px] border border-[#FF7F5C]/30 bg-[#FF7F5C]/10 space-y-4 break-inside-avoid print:break-inside-avoid">
                        <div className="flex items-center gap-2 text-[#FF7F5C] font-bold text-sm border-b border-[#FF7F5C]/25 pb-3">
                          <ShieldAlert className="h-4 w-4" />
                          <span>OUT-OF-SCOPE (Explicit Exclusions)</span>
                        </div>
                        <ul className="space-y-2.5">
                          {proposal.outOfScope.map((item, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-[#1B1C31] flex items-start gap-2.5 font-medium">
                              <XCircle className="h-4 w-4 text-[#FF7F5C] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab 3: Policy */}
                  <TabsContent value="policy" className="space-y-4">
                    <div className="p-6 rounded-[16px] border border-[#5D5FEF]/30 bg-[#F8F9FD] space-y-4 break-inside-avoid print:break-inside-avoid">
                      <div className="flex items-center gap-2 text-[#5D5FEF] font-bold text-sm">
                        <ShieldCheck className="h-5 w-5 text-[#5D5FEF]" />
                        <span>Binding Change-Order & Scope Creep Clause</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#1B1C31] leading-relaxed font-serif italic pl-3 border-l-2 border-[#5D5FEF]">
                        &quot;{proposal.changeOrderPolicy}&quot;
                      </p>
                      <div className="pt-3 border-t border-[#E2E5E9] flex flex-wrap items-center justify-between text-xs text-[#757095] font-semibold gap-2">
                        <span>Protected Hourly Rate: ${proposal.hourlyRate}/hr</span>
                        <span>Standard SLA: 48h written change authorization required</span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab 4: Payments */}
                  <TabsContent value="payments" className="space-y-3">
                    <div className="overflow-x-auto rounded-[14px] border border-[#E2E5E9] break-inside-avoid print:break-inside-avoid">
                      <table className="w-full text-left text-xs sm:text-sm min-w-[500px]">
                        <thead className="bg-[#F8F9FD] border-b border-[#E2E5E9] text-[#757095] uppercase font-bold text-[10px] tracking-wider">
                          <tr>
                            <th className="p-3.5">Phase</th>
                            <th className="p-3.5">Allocation</th>
                            <th className="p-3.5">Amount</th>
                            <th className="p-3.5">Trigger / Timing</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E5E9] text-[#1B1C31]">
                          {proposal.paymentSchedule.map((p, idx) => (
                            <tr key={idx} className="hover:bg-[#F8F9FD]/60">
                              <td className="p-3.5 font-bold text-[#1B1C31]">{p.phase}</td>
                              <td className="p-3.5 font-semibold text-[#5D5FEF]">{p.percentage}%</td>
                              <td className="p-3.5 font-bold text-[#01966B]">
                                ${p.amount.toLocaleString()} {proposal.currency}
                              </td>
                              <td className="p-3.5 text-[#757095] font-medium">{p.timing}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="border-t border-[#E2E5E9] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#757095] bg-[#F8F9FD]/40">
                <span className="font-medium">Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                <span className="font-medium">ScopeGuard Protected Document • AI Powered</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
