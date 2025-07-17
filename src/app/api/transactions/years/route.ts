import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { TransactionHandler } from "../transaction.handler";
import { TransactionRepository } from "../transaction.repository";

const repo = new TransactionRepository();
const handler = new TransactionHandler(repo);

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await handler.getTransactionYearsRange(userId);

  if (result.error) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json(result.data, { status: result.status });
}
