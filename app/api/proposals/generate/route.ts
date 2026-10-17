import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { runGemmaInference, parseProposalJSON } from "@/lib/ai-engine";
import { getMemoryStore, ProposalDocument } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { freelancerName, clientName, projectTitle, rawNotes, hourlyRate, currency } = await req.json();

    if (!clientName?.trim() || !rawNotes?.trim()) {
      return NextResponse.json(
        { error: "Client name and project notes are required" },
        { status: 400 }
      );
    }

    const rate = Number(hourlyRate) || 65;
    const curr = currency || "USD";

    const systemPrompt = `
You are an expert contract strategist and senior technical lead.
Your job is to protect freelancers from UNPAID SCOPE CREEP by converting messy project notes into a legally defensive, binding Statement of Work (SOW).
Analyze the input notes carefully:
1. Divide the project into 2 to 4 realistic chronological milestones with realistic hour estimates.
2. List explicit In-Scope features that the freelancer agrees to deliver.
3. CRITICAL: Identify 3 to 6 explicit OUT-OF-SCOPE features (items clients often falsely assume are included, such as custom CMS, ERP integration, multi-language support, complex animations, or ongoing infrastructure maintenance).
4. Define a protective change-order policy stating that any out-of-scope work requires written approval and is billed at ${curr} ${rate}/hour.
5. Provide a 3-part milestone payment schedule (50% deposit, 25% midpoint, 25% handover).

You MUST output strictly valid JSON matching this schema:
{
  "projectTitle": "<Refined project title>",
  "totalEstimatedHours": <number>,
  "milestones": [
    {
      "id": "m1",
      "title": "<Milestone title>",
      "hours": <number>,
      "deliverables": ["<deliverable 1>", "<deliverable 2>"]
    }
  ],
  "inScope": ["<item 1>", "<item 2>"],
  "outOfScope": ["<item 1>", "<item 2>"],
  "changeOrderPolicy": "<Defensive citing clause with hourly rate>",
  "paymentSchedule": [
    { "phase": "Deposit", "percentage": 50, "timing": "<trigger>" },
    { "phase": "Milestone 2", "percentage": 25, "timing": "<trigger>" },
    { "phase": "Completion", "percentage": 25, "timing": "<trigger>" }
  ]
}
`;

    const userPrompt = `Client: ${clientName}. Working Title: ${projectTitle || "Client Project"}. Rate: ${curr} ${rate}/hr.\nRaw Notes:\n${rawNotes}`;

    const { raw, provider } = await runGemmaInference(userPrompt, systemPrompt);
    const parsed = parseProposalJSON(raw);

    const calculatedHours = (parsed.milestones || []).reduce((acc, m) => acc + (Number(m.hours) || 0), 0);
    const totalHours = parsed.totalEstimatedHours || (calculatedHours > 0 ? calculatedHours : 24);
    const totalBudget = totalHours * rate;

    // Enrich milestones with calculated costs
    const enrichedMilestones = (parsed.milestones || []).map((m, idx) => ({
      id: m.id || `m${idx + 1}`,
      title: m.title || `Milestone ${idx + 1}`,
      hours: Number(m.hours) || Math.round(totalHours / parsed.milestones.length),
      cost: (Number(m.hours) || Math.round(totalHours / parsed.milestones.length)) * rate,
      deliverables: m.deliverables || []
    }));

    // Enrich payment schedule with calculated amounts
    const enrichedPayments = (parsed.paymentSchedule || []).map((p) => ({
      phase: p.phase,
      percentage: p.percentage,
      amount: Math.round((totalBudget * (p.percentage || 0)) / 100),
      timing: p.timing
    }));

    const newDoc: ProposalDocument = {
      freelancerName: freelancerName?.trim() || "Freelancer",
      clientName: clientName.trim(),
      projectTitle: parsed.projectTitle || projectTitle || `${clientName.trim()} SOW`,
      currency: curr,
      hourlyRate: rate,
      rawNotes,
      totalEstimatedHours: totalHours,
      totalBudget,
      milestones: enrichedMilestones,
      inScope: parsed.inScope || [],
      outOfScope: parsed.outOfScope || [],
      changeOrderPolicy:
        parsed.changeOrderPolicy ||
        `Any feature or modification outside the explicit in-scope deliverables will be billed separately at the standard change-order rate of ${curr} ${rate}/hr with prior written approval.`,
      paymentSchedule: enrichedPayments,
      status: "draft",
      createdAt: new Date().toISOString(),
      acceptedAt: null
    };

    let insertedId: string;

    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db("scopeguard");
        const result = await db.collection("proposals").insertOne(newDoc as any);
        insertedId = result.insertedId.toString();
      } catch (dbErr) {
        console.warn("MongoDB insert failed, falling back to memory store:", dbErr);
        insertedId = "sg_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        getMemoryStore().set(insertedId, { ...newDoc, _id: insertedId });
      }
    } else {
      insertedId = "sg_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      getMemoryStore().set(insertedId, { ...newDoc, _id: insertedId });
    }

    return NextResponse.json({
      success: true,
      proposalId: insertedId,
      provider,
      proposal: {
        ...newDoc,
        _id: insertedId
      }
    });
  } catch (err: unknown) {
    console.error("Proposal generation failed:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Failed to generate proposal", details: msg }, { status: 500 });
  }
}
