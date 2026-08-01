import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type DynamicRouteContext = {
  params?: { id: string } | Promise<{ id: string }>;
};

export async function DELETE(request: Request, context: DynamicRouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  let params = context?.params;
  if (params && typeof params.then === "function") params = await params;
  const id = params?.id as string;
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
