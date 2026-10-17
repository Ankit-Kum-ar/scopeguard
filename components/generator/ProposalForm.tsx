"use client"

import React, { useState } from "react"
import {
  User,
  Building2,
  Zap,
  Sparkles,
  AlertTriangle,
  DollarSign,
  FileText,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface PresetOption {
  name: string
  freelancer: string
  client: string
  title: string
  rate: number
  notes: string
}

export const PRESETS: PresetOption[] = [
  {
    name: "E-Commerce Storefront",
    freelancer: "Alex Rivera",
    client: "Urban Athletics",
    title: "Next.js Apparel Store & Checkout",
    rate: 75,
    notes:
      "Client wants a Next.js storefront for custom sports apparel. Needs product listing with filters by size/color, cart drawer, and Stripe checkout. They casually mentioned wanting multi-currency conversion, automatic ERP inventory sync, and a mobile iOS app later, but our budget is only for the web MVP.",
  },
  {
    name: "SaaS Dashboard MVP",
    freelancer: "Sarah Chen",
    client: "Apex Metrics",
    title: "Analytics Dashboard & Team Auth",
    rate: 85,
    notes:
      "Build a sleek B2B analytics portal with Supabase auth, team seat invites, and 4 KPI charts. Client expects dark mode and export to CSV. They asked if we can also build real-time Slack notifications and automated PDF email digests without increasing timeline.",
  },
  {
    name: "Marketing & CMS Site",
    freelancer: "Marcus Vance",
    client: "Nexus Consulting",
    title: "High-Performance Agency Website",
    rate: 65,
    notes:
      "Brand website with 5 marketing pages, Sanity CMS integration for case studies, and Calendly embed for consultation bookings. Client wants fast SEO (<1s load). They asked if we could write all their copywriting and set up custom Salesforce CRM webhooks.",
  },
]

interface ProposalFormProps {
  freelancerName: string
  clientName: string
  projectTitle: string
  hourlyRate: number
  currency: string
  rawNotes: string
  loading: boolean
  onChangeFreelancerName: (val: string) => void
  onChangeClientName: (val: string) => void
  onChangeProjectTitle: (val: string) => void
  onChangeHourlyRate: (val: number) => void
  onChangeCurrency: (val: string) => void
  onChangeRawNotes: (val: string) => void
  onApplyPreset: (preset: PresetOption) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ProposalForm({
  freelancerName,
  clientName,
  projectTitle,
  hourlyRate,
  currency,
  rawNotes,
  loading,
  onChangeFreelancerName,
  onChangeClientName,
  onChangeProjectTitle,
  onChangeHourlyRate,
  onChangeCurrency,
  onChangeRawNotes,
  onApplyPreset,
  onSubmit,
}: ProposalFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null)
  const [missingField, setMissingField] = useState<"freelancer" | "client" | "notes" | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!freelancerName.trim()) {
      setValidationError("Please enter your name (Freelancer Name) so this SOW is recorded under your MongoDB history.")
      setMissingField("freelancer")
      const el = document.getElementById("freelancerName")
      el?.focus()
      return
    }

    if (!clientName.trim()) {
      setValidationError("Please enter the Client or Agency name for this Quotation / Statement of Work.")
      setMissingField("client")
      const el = document.getElementById("clientName")
      el?.focus()
      return
    }

    if (!rawNotes.trim()) {
      setValidationError("Please provide the client chat notes or loose requirements to synthesize the scope.")
      setMissingField("notes")
      const el = document.getElementById("rawNotes")
      el?.focus()
      return
    }

    setValidationError(null)
    setMissingField(null)
    onSubmit(e)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Card 1: Contracting Parties (Freelancer & Client) */}
      <div className="saas-card p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-[8px] bg-[#5D5FEF] px-3 py-1 text-xs font-extrabold text-white">
              01
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-[#1B1C31] sm:text-2xl">
              Contracting Parties & History Indexing
            </h2>
          </div>
          <span className="hidden sm:inline-flex text-xs font-semibold text-[#757095] bg-[#F8F9FD] px-3 py-1 rounded-full border border-[#E2E5E9]">
            MongoDB Work History
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Freelancer Name Input */}
          <div className="space-y-2">
            <Label
              htmlFor="freelancerName"
              className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#757095] uppercase"
            >
              <User className="h-4 w-4 text-[#5D5FEF]" />
              Freelancer Name (You)
            </Label>
            <Input
              id="freelancerName"
              value={freelancerName}
              onChange={(e) => {
                onChangeFreelancerName(e.target.value)
                if (validationError && missingField === "freelancer") {
                  setValidationError(null)
                  setMissingField(null)
                }
              }}
              placeholder="e.g. Alex Rivera or your Studio Name"
              className={`w-full rounded-[10px] bg-white px-4 py-3 text-base text-[#1B1C31] placeholder:text-[#A09DB8] transition-all h-12 ${
                missingField === "freelancer"
                  ? "border-[#EF4444] ring-2 ring-[#EF4444]/20"
                  : "border-[#E2E5E9] focus:border-[#5D5FEF] focus:ring-2 focus:ring-[#5D5FEF]/20"
              }`}
              autoComplete="off"
            />
            <p className="pl-1 text-[11px] text-[#757095]">
              Organizes your personal work history and saved quotations in MongoDB.
            </p>
          </div>

          {/* Client Name Input */}
          <div className="space-y-2">
            <Label
              htmlFor="clientName"
              className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#757095] uppercase"
            >
              <Building2 className="h-4 w-4 text-[#01966B]" />
              Client or Agency Name
            </Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => {
                onChangeClientName(e.target.value)
                if (validationError && missingField === "client") {
                  setValidationError(null)
                  setMissingField(null)
                }
              }}
              placeholder="e.g. Urban Athletics, Apex Metrics, Acme Corp"
              className={`w-full rounded-[10px] bg-white px-4 py-3 text-base text-[#1B1C31] placeholder:text-[#A09DB8] transition-all h-12 ${
                missingField === "client"
                  ? "border-[#EF4444] ring-2 ring-[#EF4444]/20"
                  : "border-[#E2E5E9] focus:border-[#5D5FEF] focus:ring-2 focus:ring-[#5D5FEF]/20"
              }`}
              autoComplete="off"
            />
            <p className="pl-1 text-[11px] text-[#757095]">
              Displays on the client&apos;s quotation card and formal SOW document.
            </p>
          </div>
        </div>
      </div>

      {/* Card 2: Quick Test Scenario Presets (Fully Interactive) */}
      <div className="saas-card-muted p-5 sm:p-6">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#5D5FEF] uppercase">
            <Zap className="h-3.5 w-3.5" />
            <span>Quick Test Scenarios (1-Click Fill)</span>
          </div>
          <span className="text-[11px] font-semibold text-[#757095]">
            Autofills Freelancer, Client & Scope
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onApplyPreset(p)
                setValidationError(null)
                setMissingField(null)
              }}
              className="cursor-pointer rounded-[12px] border border-[#E2E5E9] bg-white p-3.5 text-left transition-all hover:border-[#5D5FEF] hover:shadow-xs group"
            >
              <div className="mb-1 text-xs font-bold text-[#1B1C31] group-hover:text-[#5D5FEF] transition-colors">
                {p.name}
              </div>
              <div className="text-[11px] font-medium text-[#757095] flex items-center justify-between">
                <span>{p.client}</span>
                <span className="font-semibold text-[#1B1C31]">${p.rate}/hr</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Card 3: Project Parameters & Notes */}
      <div className="saas-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className="rounded-[8px] bg-[#5D5FEF] px-3 py-1 text-xs font-extrabold text-white">
            02
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1B1C31] sm:text-2xl">
            Project Parameters & Loose Notes
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="projectTitle" className="text-xs font-bold text-[#1B1C31]">
              Working Title / Deliverable Goal
            </Label>
            <Input
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => onChangeProjectTitle(e.target.value)}
              placeholder="e.g. Next.js Apparel Store & Checkout"
              className="rounded-[10px] border-[#E2E5E9] bg-white text-[#1B1C31] placeholder:text-[#A09DB8] focus:border-[#5D5FEF] focus:ring-2 focus:ring-[#5D5FEF]/20 h-11"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate" className="text-xs font-bold text-[#1B1C31]">
                Target Hourly Rate
              </Label>
              <div className="relative">
                <span className="absolute top-2.5 left-3.5 text-sm font-semibold text-[#757095]">
                  $
                </span>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => onChangeHourlyRate(Number(e.target.value))}
                  className="rounded-[10px] border-[#E2E5E9] bg-white pl-8 text-[#1B1C31] focus:border-[#5D5FEF] focus:ring-2 focus:ring-[#5D5FEF]/20 h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-xs font-bold text-[#1B1C31]">
                Currency
              </Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value)}
                className="h-11 w-full rounded-[10px] border border-[#E2E5E9] bg-white px-3 text-sm text-[#1B1C31] outline-none focus:border-[#5D5FEF] focus:ring-2 focus:ring-[#5D5FEF]/20 cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="rawNotes" className="text-xs font-bold text-[#1B1C31]">
                Client Chat Notes / Loose Requirements
              </Label>
              <span className="text-[11px] font-medium text-[#757095]">
                Paste unformatted text
              </span>
            </div>
            <Textarea
              id="rawNotes"
              rows={6}
              value={rawNotes}
              onChange={(e) => {
                onChangeRawNotes(e.target.value)
                if (validationError && missingField === "notes") {
                  setValidationError(null)
                  setMissingField(null)
                }
              }}
              placeholder="Paste informal Slack messages, emails, WhatsApp bullet points, or casual client requests..."
              className={`resize-none rounded-[10px] bg-white text-xs sm:text-sm leading-relaxed text-[#1B1C31] placeholder:text-[#A09DB8] p-3.5 transition-all ${
                missingField === "notes"
                  ? "border-[#EF4444] ring-2 ring-[#EF4444]/20"
                  : "border-[#E2E5E9] focus:border-[#5D5FEF] focus:ring-2 focus:ring-[#5D5FEF]/20"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Card 4: Protection Notice with Figma Coral accent */}
      <div className="flex items-start gap-3 rounded-[14px] border border-[#FF7F5C]/30 bg-[#FF7F5C]/10 p-4 text-xs leading-relaxed text-[#1B1C31]">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF7F5C]" />
        <div>
          <strong className="mb-0.5 block text-sm font-bold text-[#1B1C31]">
            Why Out-of-Scope Protection Matters:
          </strong>
          Freelancers lose an average of 18 unbilled hours per project when boundaries aren&apos;t explicitly ring-fenced. ScopeGuard synthesizes concrete deliverables, phased milestones, and explicitly excluded items.
        </div>
      </div>

      {/* Card 5: Validation Alert (if any) & Dispatch Action Surface */}
      <div className="space-y-3">
        {validationError && (
          <div className="flex items-center gap-2.5 rounded-[12px] border border-[#EF4444]/40 bg-[#EF4444]/10 p-3.5 text-xs font-semibold text-[#EF4444] animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#EF4444]" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="flex flex-col items-stretch justify-between gap-6 rounded-[20px] bg-[#1B1C31] p-6 shadow-xl sm:flex-row sm:items-center sm:p-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#5D5FEF] uppercase">
              <ShieldCheck className="h-4 w-4 text-[#5D5FEF]" />
              <span>Ready for Defensive Scope Synthesis</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {clientName.trim() ? (
                <>
                  Creating SOW for <strong className="text-white">{clientName.trim()}</strong>
                  {freelancerName.trim() && (
                    <> (by <span className="text-white">{freelancerName.trim()}</span>)</>
                  )}
                </>
              ) : (
                "Fill in your freelancer & client details above to generate."
              )}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="saas-btn-primary h-[52px] text-base font-bold shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer gap-2.5"
          >
            {loading ? (
              <>
                <Sparkles className="h-5 w-5 animate-spin" />
                <span>Synthesizing with AI...</span>
              </>
            ) : (
              <>
                <span>Generate Defensive SOW</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
