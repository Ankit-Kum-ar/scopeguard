"use client"

import React, { useState } from "react"
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
  ShieldCheck 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalDocument } from "@/lib/store"

interface ProposalPreviewProps {
  proposal: ProposalDocument
  exportingPdf: boolean
  copiedMarkdown: boolean
  copiedShareLink: boolean
  previewRef: React.RefObject<HTMLDivElement | null>
  onDownloadPdf: () => void
  onCopyMarkdown: () => void
  onCopyShareLink: () => void
}

export function ProposalPreview({
  proposal,
  exportingPdf,
  copiedMarkdown,
  copiedShareLink,
  previewRef,
  onDownloadPdf,
  onCopyMarkdown,
  onCopyShareLink,
}: ProposalPreviewProps) {
  const [activeTab, setActiveTab] = useState("milestones")

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Stats Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 no-print print:hidden">
        <div className="saas-card p-4">
          <div className="flex items-center gap-2 text-[#757095] text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="h-3.5 w-3.5 text-[#5D5FEF]" />
            Total Hours
          </div>
          <div className="text-2xl font-extrabold text-[#1B1C31] tracking-tight">
            {proposal.totalEstimatedHours} <span className="text-xs font-semibold text-[#757095]">hrs</span>
          </div>
        </div>

        <div className="saas-card p-4">
          <div className="flex items-center gap-2 text-[#757095] text-xs font-bold uppercase tracking-wider mb-1">
            <DollarSign className="h-3.5 w-3.5 text-[#01966B]" />
            Total SOW Budget
          </div>
          <div className="text-2xl font-extrabold text-[#01966B] tracking-tight">
            ${proposal.totalBudget.toLocaleString()}{" "}
            <span className="text-xs font-semibold text-[#757095]">{proposal.currency}</span>
          </div>
        </div>

        <div className="saas-card p-4">
          <div className="flex items-center gap-2 text-[#757095] text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="h-3.5 w-3.5 text-[#5D5FEF]" />
            Hourly Protection
          </div>
          <div className="text-2xl font-extrabold text-[#1B1C31] tracking-tight">
            ${proposal.hourlyRate} <span className="text-xs font-semibold text-[#757095]">/hr</span>
          </div>
        </div>
      </div>

      {/* SOW Document Detail Card */}
      <div ref={previewRef} className="saas-card print:border-none print:shadow-none print:rounded-none print-page">
        <div className="border-b border-[#E2E5E9] p-5 sm:p-6 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="bg-[#5D5FEF]/10 text-[#5D5FEF] border border-[#5D5FEF]/20 text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5">
                  {proposal.status.toUpperCase()}
                </span>
                <span className="text-xs text-[#757095]">
                  Client: <strong className="text-[#1B1C31]">{proposal.clientName}</strong>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B1C31] tracking-tight">{proposal.projectTitle}</h2>
            </div>

            {/* Action Buttons Toolbar - 2x2 Grid on Mobile */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 no-print print:hidden">
              <button
                onClick={onDownloadPdf}
                disabled={exportingPdf}
                className="saas-btn-primary h-9 text-xs rounded-[10px] px-3.5 cursor-pointer justify-center"
              >
                {exportingPdf ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Exporting PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    PDF SOW
                  </>
                )}
              </button>

              <button
                onClick={onCopyMarkdown}
                className="inline-flex items-center justify-center rounded-[10px] border border-[#E2E5E9] bg-white px-3 py-2 text-xs font-semibold text-[#1B1C31] hover:border-[#5D5FEF] hover:text-[#5D5FEF] transition h-9 shadow-xs cursor-pointer"
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
                  onClick={onCopyShareLink}
                  className="inline-flex items-center justify-center rounded-[10px] border border-[#E2E5E9] bg-white px-3 py-2 text-xs font-semibold text-[#1B1C31] hover:border-[#5D5FEF] hover:text-[#5D5FEF] transition h-9 shadow-xs cursor-pointer"
                >
                  {copiedShareLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 text-[#01966B]" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 mr-1.5 text-[#5D5FEF]" />
                      Share
                    </>
                  )}
                </button>
              )}

              {proposal._id && (
                <a
                  href={`/share/${proposal._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-[10px] border border-[#5D5FEF]/30 bg-[#5D5FEF]/10 px-3 py-2 text-xs font-semibold text-[#5D5FEF] hover:bg-[#5D5FEF]/20 transition h-9"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Client View
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#F8F9FD] border border-[#E2E5E9] p-1 mb-6 rounded-[12px] flex flex-wrap h-auto gap-1">
              <TabsTrigger
                value="milestones"
                className="text-xs rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#1B1C31] data-[state=active]:shadow-xs text-[#757095] font-semibold py-1.5 px-3"
              >
                Milestones ({proposal.milestones.length})
              </TabsTrigger>
              <TabsTrigger
                value="boundaries"
                className="text-xs rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#1B1C31] data-[state=active]:shadow-xs text-[#757095] font-semibold py-1.5 px-3"
              >
                Boundaries ({proposal.inScope.length + proposal.outOfScope.length})
              </TabsTrigger>
              <TabsTrigger
                value="policy"
                className="text-xs rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#1B1C31] data-[state=active]:shadow-xs text-[#757095] font-semibold py-1.5 px-3"
              >
                Policy
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="text-xs rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-[#1B1C31] data-[state=active]:shadow-xs text-[#757095] font-semibold py-1.5 px-3"
              >
                Payments
              </TabsTrigger>
            </TabsList>

            {/* Milestones Content */}
            <TabsContent value="milestones" className="space-y-3">
              {proposal.milestones.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="p-4 rounded-[14px] border border-[#E2E5E9] bg-[#F8F9FD] shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-[#1B1C31]">
                      Milestone {idx + 1}: {m.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#01966B]">
                        ${m.cost.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-[#757095]">
                        ({m.hours} hrs)
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-1 pl-1 pt-1">
                    {m.deliverables.map((d, dIdx) => (
                      <li key={dIdx} className="text-xs text-[#1B1C31] flex items-start gap-2">
                        <span className="text-[#5D5FEF] font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </TabsContent>

            {/* Scope Matrix Content */}
            <TabsContent value="boundaries" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* In Scope */}
                <div className="p-4 rounded-[14px] border border-[#01966B]/25 bg-[#01966B]/5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[#01966B] font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>IN-SCOPE (Included)</span>
                  </div>
                  <ul className="space-y-1.5">
                    {proposal.inScope.map((item, idx) => (
                      <li key={idx} className="text-xs text-[#1B1C31] flex items-start gap-2 font-medium">
                        <Check className="h-3.5 w-3.5 text-[#01966B] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Out of Scope */}
                <div className="p-4 rounded-[14px] border border-[#FF7F5C]/30 bg-[#FF7F5C]/10 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[#FF7F5C] font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="h-4 w-4" />
                    <span>OUT-OF-SCOPE (Excluded)</span>
                  </div>
                  <ul className="space-y-1.5">
                    {proposal.outOfScope.map((item, idx) => (
                      <li key={idx} className="text-xs text-[#1B1C31] flex items-start gap-2 font-medium">
                        <XCircle className="h-3.5 w-3.5 text-[#FF7F5C] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Change Order Policy */}
            <TabsContent value="policy" className="space-y-3">
              <div className="p-5 rounded-[14px] border border-[#5D5FEF]/30 bg-[#F8F9FD] space-y-3">
                <div className="flex items-center gap-2 text-[#5D5FEF] font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Scope-Creep & Change Order Protection Policy</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1B1C31] leading-relaxed font-serif italic pl-3 border-l-2 border-[#5D5FEF]">
                  &quot;{proposal.changeOrderPolicy}&quot;
                </p>
              </div>
            </TabsContent>

            {/* Payment Schedule */}
            <TabsContent value="payments" className="space-y-3">
              <div className="overflow-x-auto rounded-[12px] border border-[#E2E5E9]">
                <table className="w-full text-left text-xs min-w-[460px] sm:min-w-full">
                  <thead className="bg-[#F8F9FD] border-b border-[#E2E5E9] text-[#757095] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Phase</th>
                      <th className="p-3">Allocation</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Timing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5E9] text-[#1B1C31]">
                    {proposal.paymentSchedule.map((p, idx) => (
                      <tr key={idx} className="hover:bg-[#F8F9FD]/60">
                        <td className="p-3 font-bold text-[#1B1C31]">{p.phase}</td>
                        <td className="p-3 font-semibold text-[#5D5FEF]">{p.percentage}%</td>
                        <td className="p-3 font-bold text-[#01966B]">
                          ${p.amount.toLocaleString()} {proposal.currency}
                        </td>
                        <td className="p-3 text-[#757095] font-medium">{p.timing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t border-[#E2E5E9] p-4 flex items-center justify-between text-xs text-[#757095] bg-[#F8F9FD]/40">
          <span className="font-medium">Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
          <span className="font-medium">ScopeGuard Protected • AI Powered</span>
        </div>
      </div>
    </div>
  )
}
