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
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json({ id: result.data!.id }, { status: result.status });
}

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const monthParam = url.searchParams.get("month");
  const yearParam = url.searchParams.get("year");

  if (!monthParam || !yearParam) {
    return NextResponse.json(
      { error: "Missing 'month' or 'year' query parameters" },
      { status: 400 }
    );
  }

  const month = parseInt(monthParam, 10);
  const year = parseInt(yearParam, 10);

  if (isNaN(month) || isNaN(year)) {
    return NextResponse.json(
      { error: "'month' and 'year' must be valid numbers" },
      { status: 400 }
    );
  }

  try {
    const transactions = await handler.getTransactionsByMonth(
      userId,
      month,
      year
    );
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}