"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { ProposalForm, PRESETS, PresetOption } from "@/components/generator/ProposalForm"
import { ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react"

export default function ScopeGuardWorkspace() {
  const router = useRouter()
  const [freelancerName, setFreelancerName] = useState("")
  const [clientName, setClientName] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [hourlyRate, setHourlyRate] = useState(75)
  const [currency, setCurrency] = useState("USD")
  const [rawNotes, setRawNotes] = useState("")
  const [loading, setLoading] = useState(false)

  // Retrieve remembered freelancer name on load
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("scopeguard_freelancer_name")
      if (saved && !freelancerName) {
        setFreelancerName(saved)
      }
    } catch (e) {
      // ignore SSR or storage exceptions
    }
  }, [])

  const handleApplyPreset = (preset: PresetOption) => {
    setFreelancerName(preset.freelancer)
    setClientName(preset.client)
    setProjectTitle(preset.title)
    setHourlyRate(preset.rate)
    setRawNotes(preset.notes)
  }

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!freelancerName.trim() || !clientName.trim() || !rawNotes.trim()) return

    // Remember freelancer name
    try {
      localStorage.setItem("scopeguard_freelancer_name", freelancerName.trim())
    } catch (e) {}

    setLoading(true)
    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerName: freelancerName.trim(),
          clientName: clientName.trim(),
          projectTitle: projectTitle.trim() || `${clientName.trim()} SOW`,
          hourlyRate,
          currency,
          rawNotes: rawNotes.trim(),
        }),
      })

      const data = await res.json()
      if (data.success && data.proposal?._id) {
        // Direct navigation to dedicated uncongested SOW page
        router.push(`/sow/${data.proposal._id}`)
      } else {
        alert(data.error || "Failed to generate proposal")
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert("Error generating Statement of Work")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFD] text-[#1B1C31] relative">
      {/* Figma SaaS Ambient Glow & Subtle Grid Background */}
      <div className="saas-ambient-mesh" />
      <div className="fixed inset-0 saas-grid-pattern pointer-events-none -z-10" />

      {/* ScopeGuard Floating Navbar passing active freelancer or client name */}
      <Navbar currentName={freelancerName || clientName} />

      {/* Main SaaS Hero & Single-Column Staged Workflow */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pt-10 sm:pb-24 relative z-10">
        {/* Figma Hero Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#5D5FEF]/10 border border-[#5D5FEF]/20 px-3.5 py-1 text-xs font-bold text-[#5D5FEF] mb-4 sm:mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Statement of Work & Scope Defense</span>
          </div>

          <h1 className="saas-hero-title text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6">
            Managing client scope has never been easier
          </h1>

          <p className="saas-subtext text-base sm:text-lg text-[#757095] max-w-xl mx-auto">
            Convert messy client chats, unvetted feature requests, and scope creep into legally defensive, binding Statements of Work in seconds.
          </p>

          {/* Micro trust indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#757095]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#01966B]" />
              Zero Scope Creep Protection
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#01966B]" />
              One-Click PDF & Markdown Export
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#01966B]" />
              Legally Defense Ready
            </span>
          </div>
        </div>

        {/* The Generator Form */}
        <ProposalForm
          freelancerName={freelancerName}
          clientName={clientName}
          projectTitle={projectTitle}
          hourlyRate={hourlyRate}
          currency={currency}
          rawNotes={rawNotes}
          loading={loading}
          onChangeFreelancerName={setFreelancerName}
          onChangeClientName={setClientName}
          onChangeProjectTitle={setProjectTitle}
          onChangeHourlyRate={setHourlyRate}
          onChangeCurrency={setCurrency}
          onChangeRawNotes={setRawNotes}
          onApplyPreset={handleApplyPreset}
          onSubmit={handleGenerate}
        />
      </main>
    </div>
  )
}
