import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    let mongoConnected = false;
    let dbName = null;

    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db("scopeguard");
        await db.command({ ping: 1 });
        mongoConnected = true;
        dbName = db.databaseName;
      } catch (e: unknown) {
        console.warn("MongoDB ping failed:", e);
      }
    }

    const openrouterConfigured = !!process.env.OPENROUTER_API_KEY;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        mongodb: {
          connected: mongoConnected,
          database: dbName,
          mode: mongoConnected ? "Atlas" : "Memory fallback"
        },
        aiGateway: {
          provider: "OpenRouter",
          configured: openrouterConfigured,
          preferredModels: [
            "google/gemma-2-27b-it",
            "google/gemma-2-9b-it:free",
            "google/gemma-3-12b-it:free"
          ]
        }
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: "error", error: message }, { status: 500 });
  }
}
