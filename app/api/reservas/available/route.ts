import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/reservations";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const serviceId = url.searchParams.get("serviceId") || "";
  const barberId = url.searchParams.get("barberId") || "";
  const date = url.searchParams.get("date") || ""; // YYYY-MM-DD

  if (!serviceId || !barberId || !date) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const slots = await getAvailableSlots(serviceId, barberId, date);
  return NextResponse.json({ slots });
}
