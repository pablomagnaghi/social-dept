import { NextRequest, NextResponse } from "next/server";
import { TransactionHandler } from "../transaction.handler";
import { TransactionRepository } from "../transaction.repository";
import { getUserIdOrUnauthorized } from "../../auth/user.auth";


const handler = new TransactionHandler(new TransactionRepository());

export async function GET(req: NextRequest) {
  const userId = await getUserIdOrUnauthorized(); // <-- add await here
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));

  if (!year) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  const result = await handler.getAnnualCashflowAction(userId, year);
  return NextResponse.json(result, { status: result.status });
}