import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookie = request.headers.get("cookie") ?? "";
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/api/repositories/${id}`, {
    method: "PATCH",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) return NextResponse.json({ error: "Update failed" }, { status: res.status });
  return NextResponse.json(await res.json());
}
