import { NextResponse } from "next/server";
import { TransactionHandler } from "../transaction.handler";
import { TransactionRepository } from "../transaction.repository";
import { getUserIdOrUnauthorized } from "../../auth/user.auth";

const repo = new TransactionRepository();
const handler = new TransactionHandler(repo);

export async function GET(req: Request) {
  const userId = await getUserIdOrUnauthorized();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await handler.getTransactionYearsRange(userId);

  if (result.error) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json(result.data, { status: result.status });
}

