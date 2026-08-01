import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { cancelReservation } from "@/lib/reservations";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const body = await request.json();
    const { reservaId } = body;
    if (!reservaId) return NextResponse.json({ error: "Missing reservaId" }, { status: 400 });

    const canceled = await cancelReservation({ reservaId, userId: session.userId });
    if (!canceled) return NextResponse.json({ error: "No autorizado o no existe" }, { status: 403 });
    return NextResponse.json({ reserva: canceled });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
