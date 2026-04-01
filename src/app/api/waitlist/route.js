import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const prisma = getPrisma();

  try {
    const entries = await prisma.waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/waitlist failed", error);
    return NextResponse.json({ error: "Falha ao listar registros." }, { status: 500 });
  }
}

export async function POST(request) {
  const prisma = getPrisma();

  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const company = String(body?.company || "").trim();

    if (!name || !email) {
      return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
    }

    const entry = await prisma.waitlistEntry.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        company: company || null,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/waitlist failed", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Esse e-mail já foi cadastrado." }, { status: 409 });
    }

    return NextResponse.json({ error: "Falha ao salvar registro." }, { status: 500 });
  }
}
