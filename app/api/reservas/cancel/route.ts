import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { cancelReservation } from "@/lib/reservations";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (user.rol !== "CLIENTE") return NextResponse.json({ error: "Sólo los clientes pueden cancelar sus reservas" }, { status: 403 });

    const body = await request.json();
    const { reservaId } = body;
    if (!reservaId) return NextResponse.json({ error: "Missing reservaId" }, { status: 400 });

    const canceled = await cancelReservation({ reservaId, userId: user.id });
    if (!canceled) return NextResponse.json({ error: "No autorizado o no existe" }, { status: 403 });
    return NextResponse.json({ reserva: canceled });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
