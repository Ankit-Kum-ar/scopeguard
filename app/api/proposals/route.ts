import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getMemoryStore } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filterName = searchParams.get("name")?.trim().toLowerCase();

    // A freelancer or client name is required to access history.
    // Without writing a name, do not return any SOW records.
    if (!filterName) {
      return NextResponse.json({
        success: true,
        count: 0,
        totalBudget: 0,
        totalHours: 0,
        proposals: [],
        message: "A freelancer name or client name is required to view quotation history.",
      });
    }

    const list: any[] = [];

    // 1. Fetch from MongoDB Atlas if available
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db("scopeguard");
        
        const query = {
          $or: [
            { freelancerName: { $regex: filterName, $options: "i" } },
            { clientName: { $regex: filterName, $options: "i" } },
            { projectTitle: { $regex: filterName, $options: "i" } },
          ],
        };

        const docs = await db
          .collection("proposals")
          .find(query)
          .sort({ createdAt: -1 })
          .limit(50)
          .toArray();

        for (const doc of docs) {
          list.push({
            id: doc._id.toString(),
            freelancerName: doc.freelancerName || "Freelancer",
            clientName: doc.clientName,
            projectTitle: doc.projectTitle,
            totalBudget: doc.totalBudget,
            currency: doc.currency,
            totalEstimatedHours: doc.totalEstimatedHours,
            milestonesCount: doc.milestones?.length || 0,
            status: doc.status || "draft",
            createdAt: doc.createdAt,
            acceptedAt: doc.acceptedAt || null,
          });
        }
      } catch (dbErr) {
        console.warn("MongoDB listing failed, checking memory store:", dbErr);
      }
    }

    // 2. Also incorporate in-memory store records (avoid duplicates)
    const existingIds = new Set(list.map((item) => item.id));
    const memoryDocs = Array.from(getMemoryStore().values());

    for (const doc of memoryDocs) {
      const docId = doc._id || "fallback";
      if (!existingIds.has(docId)) {
        if (
          !filterName ||
          doc.freelancerName?.toLowerCase().includes(filterName) ||
          doc.clientName.toLowerCase().includes(filterName) ||
          doc.projectTitle.toLowerCase().includes(filterName)
        ) {
          list.push({
            id: docId,
            freelancerName: doc.freelancerName || "Freelancer",
            clientName: doc.clientName,
            projectTitle: doc.projectTitle,
            totalBudget: doc.totalBudget,
            currency: doc.currency,
            totalEstimatedHours: doc.totalEstimatedHours,
            milestonesCount: doc.milestones?.length || 0,
            status: doc.status || "draft",
            createdAt: doc.createdAt,
            acceptedAt: doc.acceptedAt || null,
          });
        }
      }
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalBudget = list.reduce((acc, p) => acc + (p.totalBudget || 0), 0);
    const totalHours = list.reduce((acc, p) => acc + (p.totalEstimatedHours || 0), 0);

    return NextResponse.json({
      success: true,
      count: list.length,
      totalBudget,
      totalHours,
      proposals: list,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Failed to list proposals", details: msg }, { status: 500 });
  }
}
