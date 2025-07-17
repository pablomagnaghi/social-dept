import { NextResponse } from "next/server";
import { TransactionRepository } from "./transaction.repository";
import { TransactionHandler } from "./transaction.handler";
import { getUserIdOrUnauthorized } from "../auth/user.auth";

const repo = new TransactionRepository();
const handler = new TransactionHandler(repo);
interface Params {
  params: {
    id: string;
  };
}

function parseMonthYear(url: URL): {
  month?: number;
  year?: number;
  error?: string;
} {
  const monthParam = url.searchParams.get("month");
  const yearParam = url.searchParams.get("year");

  if (!monthParam || !yearParam) {
    return { error: "Missing 'month' or 'year' query parameters" };
  }

  const month = parseInt(monthParam, 10);
  const year = parseInt(yearParam, 10);

  if (isNaN(month) || isNaN(year)) {
    return { error: "'month' and 'year' must be valid numbers" };
  }

  return { month, year };
}

export async function POST(req: Request) {
  const userId = await getUserIdOrUnauthorized();
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
  const userId = await getUserIdOrUnauthorized();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const { month, year, error } = parseMonthYear(url);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const transactions = await handler.getTransactionsByMonth(
      userId,
      month!,
      year!
    );
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdOrUnauthorized();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const transactionId = parseInt(id, 10);
  if (isNaN(transactionId)) {
    return NextResponse.json(
      { error: "Invalid transaction ID" },
      { status: 400 }
    );
  }

  const body = await req.json();

  const result = await handler.updateTransaction(
    { ...body, id: transactionId },
    userId
  );

  if ("error" in result) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json({ success: true }, { status: result.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdOrUnauthorized();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const transactionId = parseInt(id, 10);

  if (isNaN(transactionId)) {
    return NextResponse.json(
      { error: "Invalid transaction ID" },
      { status: 400 }
    );
  }

  const result = await handler.deleteTransaction(userId, transactionId);

  if (result.error) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json({ success: true }, { status: result.status });
}
