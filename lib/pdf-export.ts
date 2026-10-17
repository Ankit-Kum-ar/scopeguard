import jsPDF from "jspdf"
import { ProposalDocument } from "@/lib/store"

/**
 * Generates and downloads a clean, executive, vector-sharp PDF Statement of Work.
 * Built directly with pure jsPDF vector drawing:
 * - 100% ASCII-clean (no unicode character encoding glitches or wide spacing)
 * - Auto-wrapped table cells (no text overflow on payment timings)
 * - Proportional callout boxes with accent bars
 * - Crisp signature blocks & automated multi-page pagination
 */
export async function exportProposalToPdf(
  _element: HTMLElement | null,
  proposal: ProposalDocument
): Promise<void> {
  if (!proposal) return

  // Initialize jsPDF (A4 portrait in millimeters)
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = 210
  const pageHeight = 297
  const margin = 16
  const contentWidth = pageWidth - margin * 2

  let y = 18

  function ensureSpace(neededMm: number) {
    if (y + neededMm > pageHeight - 22) {
      pdf.addPage()
      y = 18
    }
  }

  // --- BRAND HEADER ---
  pdf.setFillColor(93, 95, 239) // #5D5FEF
  pdf.roundedRect(margin, y, 28, 6.5, 1.5, 1.5, "F")
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(8)
  pdf.setTextColor(255, 255, 255)
  pdf.text("SCOPEGUARD", margin + 14, y + 4.5, { align: "center" })

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8.5)
  pdf.setTextColor(117, 112, 149)
  const dateStr = proposal.createdAt
    ? new Date(proposal.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString()
  pdf.text(
    `SOW Ref: ${(proposal._id || "SG-SOW").slice(-8).toUpperCase()}  |  Date: ${dateStr}`,
    pageWidth - margin,
    y + 4.5,
    { align: "right" }
  )

  y += 12

  // --- PROJECT TITLE ---
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(17)
  pdf.setTextColor(27, 28, 49) // #1B1C31
  const titleLines = pdf.splitTextToSize(proposal.projectTitle || "Statement of Work", contentWidth)
  pdf.text(titleLines, margin, y)
  y += titleLines.length * 7 + 4

  // --- PARTIES SUMMARY CARDS ---
  ensureSpace(24)
  const halfCol = (contentWidth - 6) / 2

  // Freelancer Box
  pdf.setFillColor(248, 249, 253) // #F8F9FD
  pdf.setDrawColor(226, 229, 233) // #E2E5E9
  pdf.roundedRect(margin, y, halfCol, 20, 2, 2, "FD")
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7.5)
  pdf.setTextColor(93, 95, 239)
  pdf.text("FREELANCER / PROVIDER", margin + 5, y + 5.5)
  pdf.setFontSize(11)
  pdf.setTextColor(27, 28, 49)
  pdf.text(proposal.freelancerName || "Freelancer", margin + 5, y + 12)
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7.5)
  pdf.setTextColor(117, 112, 149)
  pdf.text("Contractor & Scope Lead", margin + 5, y + 16.5)

  // Client Box
  pdf.setFillColor(248, 249, 253)
  pdf.roundedRect(margin + halfCol + 6, y, halfCol, 20, 2, 2, "FD")
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7.5)
  pdf.setTextColor(1, 150, 107) // #01966B
  pdf.text("CLIENT / ORGANIZATION", margin + halfCol + 11, y + 5.5)
  pdf.setFontSize(11)
  pdf.setTextColor(27, 28, 49)
  pdf.text(proposal.clientName, margin + halfCol + 11, y + 12)
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7.5)
  pdf.setTextColor(117, 112, 149)
  pdf.text(`Status: ${(proposal.status || "draft").toUpperCase()}`, margin + halfCol + 11, y + 16.5)

  y += 26

  // --- FINANCIAL & EFFORT SUMMARY BAR ---
  ensureSpace(20)
  pdf.setFillColor(27, 28, 49) // #1B1C31
  pdf.roundedRect(margin, y, contentWidth, 18, 2, 2, "F")

  const thirdCol = contentWidth / 3

  // Col 1: Total Investment
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7)
  pdf.setTextColor(160, 157, 184)
  pdf.text("TOTAL SOW INVESTMENT", margin + 8, y + 5.5)
  pdf.setFontSize(12)
  pdf.setTextColor(1, 150, 107)
  pdf.text(`$${(proposal.totalBudget || 0).toLocaleString()} ${proposal.currency || "USD"}`, margin + 8, y + 13)

  // Col 2: Target Rate
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7)
  pdf.setTextColor(160, 157, 184)
  pdf.text("AGREED HOURLY RATE", margin + thirdCol + 4, y + 5.5)
  pdf.setFontSize(12)
  pdf.setTextColor(255, 255, 255)
  pdf.text(`$${proposal.hourlyRate || 75} / hr`, margin + thirdCol + 4, y + 13)

  // Col 3: Scope Hours
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7)
  pdf.setTextColor(160, 157, 184)
  pdf.text("RING-FENCED SCOPE", margin + thirdCol * 2 + 4, y + 5.5)
  pdf.setFontSize(12)
  pdf.setTextColor(255, 255, 255)
  pdf.text(
    `${proposal.totalEstimatedHours || 0} Hours (${(proposal.milestones || []).length} Phases)`,
    margin + thirdCol * 2 + 4,
    y + 13
  )

  y += 25

  // --- SECTION 1: PHASED MILESTONES ---
  ensureSpace(16)
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11.5)
  pdf.setTextColor(27, 28, 49)
  pdf.text("1. Phased Milestones & Deliverables", margin, y)
  y += 6

  for (let i = 0; i < (proposal.milestones || []).length; i++) {
    const m = proposal.milestones[i]
    ensureSpace(22)

    pdf.setFillColor(248, 249, 253)
    pdf.setDrawColor(226, 229, 233)
    pdf.roundedRect(margin, y, contentWidth, 7.5, 1.5, 1.5, "FD")

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(8)
    pdf.setTextColor(93, 95, 239)
    pdf.text(`Phase 0${i + 1}: ${m.title}`, margin + 4, y + 5)

    pdf.setTextColor(1, 150, 107)
    pdf.text(
      `$${(m.cost || 0).toLocaleString()} (${m.hours || 0} hrs)`,
      pageWidth - margin - 4,
      y + 5,
      { align: "right" }
    )

    y += 10.5

    // Deliverables list (pure ASCII, vector bullets)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8.5)
    pdf.setTextColor(27, 28, 49)
    for (const d of m.deliverables || []) {
      const dLines = pdf.splitTextToSize(d, contentWidth - 12)
      ensureSpace(dLines.length * 4.5 + 2)

      // Vector bullet circle
      pdf.setFillColor(93, 95, 239)
      pdf.circle(margin + 5, y - 1, 0.9, "F")

      pdf.text(dLines, margin + 9, y)
      y += dLines.length * 4.5 + 1.5
    }
    y += 2.5
  }

  y += 4

  // --- SECTION 2: SCOPE BOUNDARIES MATRIX ---
  // Estimate block heights to prevent breaking items in half across pages
  const inScopeCount = (proposal.inScope || []).length
  const outScopeCount = (proposal.outOfScope || []).length
  const inScopeBlockH = inScopeCount * 7 + 18
  const outScopeBlockH = outScopeCount * 7 + 18

  // If in-scope block won't fit completely, move entire Section 2 to next page
  ensureSpace(inScopeBlockH + 14)

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11.5)
  pdf.setTextColor(27, 28, 49)
  pdf.text("2. Scope Boundaries: In-Scope vs Explicit Exclusions", margin, y)
  y += 6

  // In-Scope Header Bar
  pdf.setFillColor(236, 253, 245)
  pdf.setDrawColor(1, 150, 107)
  pdf.roundedRect(margin, y, contentWidth, 6.5, 1, 1, "FD")
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7.5)
  pdf.setTextColor(1, 150, 107)
  pdf.text("IN-SCOPE DELIVERABLES (Included in Baseline Contract)", margin + 4, y + 4.5)
  y += 9.5

  // In-Scope Items (clean pill + standard ASCII text with flawless kerning)
  for (const item of proposal.inScope || []) {
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8.5)
    pdf.setTextColor(27, 28, 49)
    const lines = pdf.splitTextToSize(item, contentWidth - 28)
    ensureSpace(lines.length * 4.5 + 2.5)

    // Green In-Scope Badge
    pdf.setFillColor(236, 253, 245)
    pdf.setDrawColor(1, 150, 107)
    pdf.roundedRect(margin + 4, y - 3, 16, 4.2, 0.8, 0.8, "FD")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(6)
    pdf.setTextColor(1, 150, 107)
    pdf.text("IN-SCOPE", margin + 5.2, y)

    // Text
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8.5)
    pdf.setTextColor(27, 28, 49)
    pdf.text(lines, margin + 24, y)
    y += lines.length * 4.5 + 2
  }

  y += 4

  // Out-of-Scope Exclusions (Critical Legal Defense)
  // Ensure the entire out-of-scope block stays together on the page
  ensureSpace(outScopeBlockH)
  pdf.setFillColor(255, 241, 238)
  pdf.setDrawColor(255, 127, 92)
  pdf.roundedRect(margin, y, contentWidth, 6.5, 1, 1, "FD")
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7.5)
  pdf.setTextColor(235, 78, 38)
  pdf.text("OUT-OF-SCOPE EXCLUSIONS (Strictly Excluded from Baseline - Requires Change Order)", margin + 4, y + 4.5)
  y += 9.5

  // Out-of-Scope Items (clean coral pill + standard ASCII text)
  for (const item of proposal.outOfScope || []) {
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8.5)
    pdf.setTextColor(27, 28, 49)
    const lines = pdf.splitTextToSize(item, contentWidth - 30)
    ensureSpace(lines.length * 4.5 + 2.5)

    // Coral Excluded Badge
    pdf.setFillColor(255, 241, 238)
    pdf.setDrawColor(255, 127, 92)
    pdf.roundedRect(margin + 4, y - 3, 18, 4.2, 0.8, 0.8, "FD")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(6)
    pdf.setTextColor(235, 78, 38)
    pdf.text("EXCLUDED", margin + 5.2, y)

    // Text
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8.5)
    pdf.setTextColor(27, 28, 49)
    pdf.text(lines, margin + 26, y)
    y += lines.length * 4.5 + 2
  }

  y += 6

  // --- SECTION 3: CHANGE ORDER & SCOPE DEFENSE CLAUSE ---
  ensureSpace(24)
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11.5)
  pdf.setTextColor(27, 28, 49)
  pdf.text("3. Scope Creep & Change Order Policy", margin, y)
  y += 6

  const policyText =
    proposal.changeOrderPolicy ||
    `Any additional requested features, UI alterations after sign-off, or external integrations not explicitly defined in the in-scope deliverables will be billed separately via change order at the agreed hourly rate of ${proposal.currency || "USD"} ${proposal.hourlyRate || 75}/hr with prior written authorization.`

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8.5)
  const policyLines = pdf.splitTextToSize(policyText, contentWidth - 14)
  const policyBoxH = policyLines.length * 4.6 + 7
  ensureSpace(policyBoxH + 4)

  // Policy Box Container with left accent bar
  pdf.setFillColor(248, 249, 253)
  pdf.setDrawColor(226, 229, 233)
  pdf.roundedRect(margin, y, contentWidth, policyBoxH, 1.5, 1.5, "FD")

  // Left accent bar (Brand Indigo)
  pdf.setFillColor(93, 95, 239)
  pdf.roundedRect(margin, y, 2.5, policyBoxH, 0.8, 0.8, "F")

  pdf.setTextColor(27, 28, 49)
  pdf.text(policyLines, margin + 7, y + 5)
  y += policyBoxH + 8

  // --- SECTION 4: PAYMENT SCHEDULE (AUTO-WRAPPED) ---
  const paymentCount = (proposal.paymentSchedule || []).length
  const estimatedTableH = paymentCount * 10 + 22
  ensureSpace(estimatedTableH)
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11.5)
  pdf.setTextColor(27, 28, 49)
  pdf.text("4. Milestone Payment Schedule", margin, y)
  y += 6

  // Table Column Coordinates:
  // Col 1: Phase / Trigger (42 mm)
  // Col 2: Allocation (24 mm)
  // Col 3: Amount (32 mm)
  // Col 4: Schedule Timing (80 mm) -> perfectly sums to 178 mm!
  const col1W = 42
  const col2W = 24
  const col3W = 32
  const col4W = contentWidth - (col1W + col2W + col3W)

  const c1X = margin
  const c2X = c1X + col1W
  const c3X = c2X + col2W
  const c4X = c3X + col3W

  // Table header bar
  pdf.setFillColor(27, 28, 49)
  pdf.rect(margin, y, contentWidth, 7, "F")
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(7.5)
  pdf.setTextColor(255, 255, 255)
  pdf.text("PHASE / TRIGGER", c1X + 3.5, y + 4.8)
  pdf.text("ALLOCATION", c2X + 3.5, y + 4.8)
  pdf.text("AMOUNT", c3X + 3.5, y + 4.8)
  pdf.text("SCHEDULE TIMING", c4X + 3.5, y + 4.8)
  y += 7

  for (const pay of proposal.paymentSchedule || []) {
    // Wrap timing text so it NEVER overflows the right margin
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(7.5)
    const timingLines = pdf.splitTextToSize(pay.timing || "Upon milestone sign-off", col4W - 6)
    const rowH = Math.max(7.5, timingLines.length * 3.8 + 4)

    ensureSpace(rowH + 2)

    pdf.setFillColor(248, 249, 253)
    pdf.setDrawColor(226, 229, 233)
    pdf.rect(margin, y, contentWidth, rowH, "FD")

    // Col 1: Phase
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(8)
    pdf.setTextColor(27, 28, 49)
    pdf.text(pay.phase, c1X + 3.5, y + 4.8)

    // Col 2: Allocation %
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(117, 112, 149)
    pdf.text(`${pay.percentage}%`, c2X + 3.5, y + 4.8)

    // Col 3: Amount
    pdf.setTextColor(1, 150, 107)
    pdf.setFont("helvetica", "bold")
    pdf.text(`$${(pay.amount || 0).toLocaleString()} ${proposal.currency || "USD"}`, c3X + 3.5, y + 4.8)

    // Col 4: Wrapped Timing
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(117, 112, 149)
    pdf.text(timingLines, c4X + 3.5, y + 4.5)

    y += rowH
  }

  y += 9

  // --- SECTION 5: SIGNATURE & ACCEPTANCE BLOCKS ---
  ensureSpace(38)
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11.5)
  pdf.setTextColor(27, 28, 49)
  pdf.text("5. Authorization & Contractual Acceptance", margin, y)
  y += 6

  const sigBoxW = (contentWidth - 8) / 2

  // Freelancer Signature Box
  pdf.setDrawColor(226, 229, 233)
  pdf.setFillColor(248, 249, 253)
  pdf.roundedRect(margin, y, sigBoxW, 25, 2, 2, "FD")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(8)
  pdf.setTextColor(27, 28, 49)
  pdf.text("Freelancer Authorization", margin + 5, y + 5.5)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7.5)
  pdf.setTextColor(117, 112, 149)
  pdf.text(`Name: ${proposal.freelancerName || "Freelancer"}`, margin + 5, y + 11)

  // Vector signature line
  pdf.setDrawColor(200, 204, 212)
  pdf.line(margin + 5, y + 18, margin + sigBoxW - 5, y + 18)
  pdf.setFontSize(6.5)
  pdf.setTextColor(160, 157, 184)
  pdf.text("Authorized Signature & Date", margin + 5, y + 22)

  // Client Signature Box
  pdf.setDrawColor(226, 229, 233)
  pdf.setFillColor(248, 249, 253)
  pdf.roundedRect(margin + sigBoxW + 8, y, sigBoxW, 25, 2, 2, "FD")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(8)
  pdf.setTextColor(27, 28, 49)
  pdf.text("Client Confirmation", margin + sigBoxW + 13, y + 5.5)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(7.5)
  pdf.setTextColor(117, 112, 149)
  pdf.text(`Name: ${proposal.clientName}`, margin + sigBoxW + 13, y + 11)

  if (proposal.status === "accepted") {
    pdf.setFillColor(236, 253, 245)
    pdf.setDrawColor(1, 150, 107)
    pdf.roundedRect(margin + sigBoxW + 13, y + 14, sigBoxW - 20, 7, 1, 1, "FD")
    pdf.setTextColor(1, 150, 107)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(7)
    pdf.text("CONFIRMED & ACCEPTED ONLINE", margin + sigBoxW + 16, y + 18.5)
  } else {
    pdf.setDrawColor(200, 204, 212)
    pdf.line(margin + sigBoxW + 13, y + 18, margin + sigBoxW * 2 + 3, y + 18)
    pdf.setFontSize(6.5)
    pdf.setTextColor(160, 157, 184)
    pdf.text("Authorized Client Sign-off & Date", margin + sigBoxW + 13, y + 22)
  }

  // --- GLOBAL RUNNING FOOTERS ---
  const totalPages = pdf.getNumberOfPages()
  for (let pNum = 1; pNum <= totalPages; pNum++) {
    pdf.setPage(pNum)
    pdf.setDrawColor(226, 229, 233)
    pdf.line(margin, 287, pageWidth - margin, 287)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(7.5)
    pdf.setTextColor(117, 112, 149)
    pdf.text(
      `ScopeGuard AI SOW  |  ${proposal.projectTitle}  |  Page ${pNum} of ${totalPages}`,
      pageWidth / 2,
      292,
      { align: "center" }
    )
  }

  // Save the PDF file
  const safeTitle = (proposal.projectTitle || "Statement-of-Work")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  pdf.save(`SOW-${safeTitle}.pdf`)
}
