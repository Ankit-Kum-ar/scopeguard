"use client"

import React, { useEffect, useState, use, useRef } from "react"
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  FileCheck2, 
  AlertCircle, 
  Calendar,
  Sparkles,
  ArrowLeft,
  Printer,
  Download
} from "lucide-react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProposalDocument } from "@/lib/store"
import { exportProposalToPdf } from "@/lib/pdf-export"

export default function ShareProposalPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const proposalId = resolvedParams.id

  const [proposal, setProposal] = useState<ProposalDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const documentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchProposal() {
      try {
        const res = await fetch(`/api/proposals/${proposalId}`)
        const data = await res.json()
        if (data.success && data.proposal) {
          setProposal(data.proposal)
        } else {
          setError(data.error || "Proposal not found")
        }
      } catch (err) {
        console.error(err)
        setError("Failed to load proposal details")
      } finally {
        setLoading(false)
      }
    }

    if (proposalId) {
      fetchProposal()
    }
  }, [proposalId])

  const handleDownloadPdf = async () => {
    if (!documentRef.current || !proposal) return
    setExportingPdf(true)
    try {
      await exportProposalToPdf(documentRef.current, proposal)
    } catch (err) {
      console.error("PDF export failed:", err)
      alert("Could not generate PDF. You can also use the 'Print SOW' button to save as PDF via your browser.")
    } finally {
      setExportingPdf(false)
    }
  }

  const handleAccept = async () => {
    if (!proposal) return
    setAccepting(true)
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" })
      })

      const data = await res.json()
      if (data.success) {
        setProposal(prev => prev ? { ...prev, status: "accepted", acceptedAt: new Date().toISOString() } : null)

        // Celebration confetti burst
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        })
      } else {
        alert("Failed to record acceptance. Please try again.")
      }
    } catch (err) {
      console.error(err)
      alert("Error processing proposal approval")
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#1B1C31] flex flex-col items-center justify-center p-6">
        <Sparkles className="h-8 w-8 text-[#5D5FEF] animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#757095]">Retrieving Statement of Work document...</p>
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-white text-[#1B1C31] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-12 w-12 text-[#FF7F5C] mb-4" />
        <h2 className="text-xl font-extrabold text-[#1B1C31] mb-2 tracking-tight">Statement of Work Unavailable</h2>
        <p className="text-sm text-[#757095] max-w-md mb-6">{error || "This proposal link may have expired or is invalid."}</p>
        <a href="/" className="text-xs font-bold text-[#5D5FEF] hover:underline flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Return to ScopeGuard
        </a>
      </div>
    )
  }

  const isAccepted = proposal.status === "accepted"

  return (
    <div className="min-h-screen bg-[#F9FAFD] text-[#1B1C31] py-6 sm:py-8 px-3.5 sm:px-6 lg:px-8 relative overflow-x-hidden print:min-h-0 print:bg-white print:p-0 print:m-0 print:overflow-visible">
      {/* Background Ambient Glow */}
      <div className="saas-ambient-mesh print:hidden" />
      <div className="fixed inset-0 saas-grid-pattern pointer-events-none -z-10 print:hidden" />

      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 relative z-10 print:max-w-none print:m-0 print:p-0 print:space-y-0">
        
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print print:hidden">
          <a href="/" className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-[#1B1C31] hover:text-[#5D5FEF] transition px-3.5 py-2 rounded-[10px] bg-white border border-[#E2E5E9] shadow-xs">
            <ArrowLeft className="h-4 w-4" />
            <span>Create new Statement of Work</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={exportingPdf}
              className="saas-btn-primary flex-1 sm:flex-initial h-9 text-xs rounded-[10px] px-3.5 cursor-pointer justify-center"
            >
              {exportingPdf ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download PDF
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex flex-1 sm:flex-initial items-center justify-center rounded-[10px] border border-[#E2E5E9] bg-white px-3.5 py-2 text-xs font-semibold text-[#1B1C31] hover:border-[#5D5FEF] hover:text-[#5D5FEF] transition h-9 shadow-xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5 text-[#757095]" />
              Print SOW
            </button>
          </div>
        </div>

        {/* Accepted Banner (Screen Only) */}
        {isAccepted && (
          <div className="p-4 rounded-[14px] border border-[#01966B]/30 bg-[#01966B]/10 text-[#01966B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs no-print print:hidden">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#01966B]/20 flex items-center justify-center text-[#01966B] shrink-0">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <strong className="text-[#1B1C31] text-sm block font-bold">Statement of Work Accepted</strong>
                <span className="text-xs text-[#01966B] font-semibold">
                  Confirmed on {new Date(proposal.acceptedAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
            <span className="rounded-full bg-[#01966B] text-white font-bold text-xs px-3 py-1 self-start sm:self-auto">OFFICIALLY SIGNED</span>
          </div>
        )}

        {/* Formal Document Container */}
        <div ref={documentRef} className="saas-card print:border-none print:shadow-none print:rounded-none print-page">
          {/* Header */}
          <div className="border-b border-[#E2E5E9] p-6 sm:p-8 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="h-7 w-7 rounded-[8px] bg-[#5D5FEF] flex items-center justify-center text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-[#5D5FEF] tracking-wider uppercase font-bold">
                    Formal Statement of Work
                  </span>
                  {isAccepted && (
                    <span className="rounded-full bg-[#01966B]/15 text-[#01966B] border border-[#01966B]/30 font-bold text-[10px] px-2.5 py-0.5 ml-2">
                      OFFICIALLY ACCEPTED
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1C31] tracking-tight">
                  {proposal.projectTitle}
                </h1>
                <p className="text-xs text-[#757095] mt-1 font-medium">
                  {proposal.freelancerName ? (
                    <>Prepared by <strong className="text-[#1B1C31]">{proposal.freelancerName}</strong> for <strong className="text-[#1B1C31]">{proposal.clientName}</strong></>
                  ) : (
                    <>Prepared for <strong className="text-[#1B1C31]">{proposal.clientName}</strong></>
                  )} • Date: {new Date(proposal.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="text-xs font-bold text-[#757095] uppercase tracking-wider">Total SOW Investment</div>
                <div className="text-3xl font-extrabold text-[#01966B] tracking-tight">
                  ${proposal.totalBudget.toLocaleString()} <span className="text-sm font-semibold text-[#757095]">{proposal.currency}</span>
                </div>
                <div className="text-[11px] text-[#757095] font-semibold mt-0.5">
                  {proposal.totalEstimatedHours} hours @ ${proposal.hourlyRate}/hr
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Section 1: Milestones */}
            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#757095] flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#5D5FEF]" />
                1. Delivery Milestones & Phases
              </h3>

              <div className="space-y-3">
                {proposal.milestones.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="p-4 sm:p-5 rounded-[16px] border border-[#E2E5E9] bg-[#F8F9FD] shadow-xs break-inside-avoid print:break-inside-avoid"
                  >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#E2E5E9]">
                      <h4 className="text-sm font-extrabold text-[#1B1C31]">
                        Phase {idx + 1}: {m.title}
                      </h4>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#01966B]">
                          ${m.cost.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-[#757095] ml-1.5 font-medium">
                          ({m.hours} hrs)
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-1.5 pl-1 pt-1">
                      {m.deliverables.map((d, dIdx) => (
                        <li key={dIdx} className="text-xs text-[#1B1C31] flex items-start gap-2">
                          <span className="text-[#5D5FEF] font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Scope Matrix */}
            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#757095] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#01966B]" />
                2. Scope Boundaries & Technical Inclusions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* In Scope */}
                <div className="p-5 rounded-[16px] border border-[#01966B]/25 bg-[#01966B]/5 space-y-3 break-inside-avoid print:break-inside-avoid">
                  <div className="flex items-center gap-2 text-[#01966B] font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>IN-SCOPE (Included in Price)</span>
                  </div>
                  <ul className="space-y-2">
                    {proposal.inScope.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-[#1B1C31] flex items-start gap-2 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#01966B] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Out of Scope */}
                <div className="p-5 rounded-[16px] border border-[#FF7F5C]/30 bg-[#FF7F5C]/10 space-y-3 break-inside-avoid print:break-inside-avoid">
                  <div className="flex items-center gap-2 text-[#FF7F5C] font-bold text-xs uppercase tracking-wider">
                    <XCircle className="h-4 w-4" />
                    <span>EXPLICITLY OUT-OF-SCOPE</span>
                  </div>
                  <ul className="space-y-2">
                    {proposal.outOfScope.map((item, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-[#1B1C31] flex items-start gap-2 font-medium">
                        <XCircle className="h-3.5 w-3.5 text-[#FF7F5C] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: Change Order Clause */}
            <section className="space-y-3 break-inside-avoid print:break-inside-avoid">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#757095] flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-[#5D5FEF]" />
                3. Scope-Creep & Change Order Policy
              </h3>
              <div className="p-5 rounded-[16px] border border-[#5D5FEF]/30 bg-[#F8F9FD] text-xs sm:text-sm text-[#1B1C31] leading-relaxed font-serif italic pl-4 border-l-3 border-[#5D5FEF]">
                &quot;{proposal.changeOrderPolicy}&quot;
              </div>
            </section>

            {/* Section 4: Payment Schedule */}
            <section className="space-y-3 break-inside-avoid print:break-inside-avoid">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#757095] flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#01966B]" />
                4. Payment Milestones
              </h3>
              <div className="overflow-x-auto rounded-[14px] border border-[#E2E5E9] break-inside-avoid print:break-inside-avoid">
                <table className="w-full text-left text-xs sm:text-sm min-w-[480px] sm:min-w-full">
                  <thead className="bg-[#F8F9FD] border-b border-[#E2E5E9] text-[#757095] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Phase</th>
                      <th className="p-3">Percentage</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Milestone Timing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5E9] text-[#1B1C31]">
                    {proposal.paymentSchedule.map((p, idx) => (
                      <tr key={idx} className="hover:bg-[#F8F9FD]/60">
                        <td className="p-3 font-bold text-[#1B1C31]">{p.phase}</td>
                        <td className="p-3 font-semibold text-[#5D5FEF]">{p.percentage}%</td>
                        <td className="p-3 font-bold text-[#01966B]">${p.amount.toLocaleString()}</td>
                        <td className="p-3 text-[#757095] font-medium">{p.timing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Acceptance Action Footer */}
          <div className="border-t border-[#E2E5E9] p-6 bg-[#F8F9FD]/50 flex flex-col sm:flex-row items-center justify-between gap-4 no-print print:hidden">
            <div className="text-xs text-[#757095] text-center sm:text-left font-medium">
              Clicking accept confirms client authorization to proceed under these bounded terms.
            </div>

            {isAccepted ? (
              <button disabled className="bg-[#01966B]/15 text-[#01966B] border border-[#01966B]/30 cursor-not-allowed rounded-[10px] px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2">
                <FileCheck2 className="h-4 w-4" />
                Statement of Work Accepted
              </button>
            ) : (
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="saas-btn-primary h-11 text-sm font-bold px-7 rounded-[10px] cursor-pointer w-full sm:w-auto"
              >
                {accepting ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" /> Recording Approval...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Accept Statement of Work
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer Brand Tag */}
        <div className="text-center text-xs text-[#757095] font-medium py-4">
          Powered by ScopeGuard • AI Statement of Work & Scope-Creep Protector
        </div>

      </div>
    </div>
  )
}
