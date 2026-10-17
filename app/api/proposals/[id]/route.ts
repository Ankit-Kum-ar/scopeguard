import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getMemoryStore, ProposalDocument } from "@/lib/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check memory store first if present
    const memoryDoc = getMemoryStore().get(id);
    if (memoryDoc) {
      return NextResponse.json({ success: true, proposal: memoryDoc });
    }

    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db("scopeguard");

        let query: any;
        if (ObjectId.isValid(id)) {
          query = { _id: new ObjectId(id) };
        } else {
          query = { _id: id };
        }

        const proposal = await db.collection("proposals").findOne(query);
        if (proposal) {
          return NextResponse.json({ success: true, proposal });
        }
      } catch (dbErr) {
        console.warn("MongoDB query failed:", dbErr);
      }
    }

    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Invalid ID or request error", details: msg }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();

    // Prevent overwriting immutable ID
    delete updates._id;

    // Check memory store
    const memStore = getMemoryStore();
    if (memStore.has(id)) {
      const existing = memStore.get(id)!;
      const updated: ProposalDocument = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      if (updates.status === "accepted" && !updated.acceptedAt) {
        updated.acceptedAt = new Date().toISOString();
      }
      memStore.set(id, updated);
      return NextResponse.json({ success: true, proposal: updated });
    }

    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db("scopeguard");

        let query: any;
        if (ObjectId.isValid(id)) {
          query = { _id: new ObjectId(id) };
        } else {
          query = { _id: id };
        }

        const updatePayload: any = {
          ...updates,
          updatedAt: new Date()
        };

        if (updates.status === "accepted" && !updates.acceptedAt) {
          updatePayload.acceptedAt = new Date();
        }

        await db.collection("proposals").updateOne(query, { $set: updatePayload });

        const updatedDoc = await db.collection("proposals").findOne(query);
        return NextResponse.json({ success: true, proposal: updatedDoc });
      } catch (dbErr) {
        console.warn("MongoDB update failed:", dbErr);
      }
    }

    return NextResponse.json({ error: "Could not find proposal to update" }, { status: 404 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Update failed", details: msg }, { status: 500 });
  }
}
