import { NextResponse } from "next/server";
import { TransactionRepository } from "../transaction.repository";
import { TransactionHandler } from "../transaction.handler";
import { getUserIdOrUnauthorized } from "../../auth/user.auth";

export async function GET() {
  const userId = await getUserIdOrUnauthorized();  // <-- add await here

  if (!userId) {
    return NextResponse.json(
      { error: true, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const repo = new TransactionRepository();
  const handler = new TransactionHandler(repo);

  const result = await handler.getRecentTransactions(userId);

  if ("error" in result) {
    return NextResponse.json(
      { error: true, message: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}
