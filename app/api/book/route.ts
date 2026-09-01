import { NextResponse } from "next/server";
import { submitLead } from "@/lib/book/submit";

// Thin HTTP wrapper around lib/book. Node runtime so a real EmailLeadSink /
// WebhookLeadSink (owner wires later) can use Node APIs.
export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Could not read the request body." } },
      { status: 400 },
    );
  }

  const result = await submitLead(body);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
