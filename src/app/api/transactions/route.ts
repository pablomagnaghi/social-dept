import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { TransactionRepository } from "./transaction.repository";
import { TransactionHandler } from "./transaction.handler";

const repo = new TransactionRepository();
const handler = new TransactionHandler(repo);

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = await handler.create(body, userId);

  if (result.error) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json({ id: result.data!.id }, { status: result.status });
}
