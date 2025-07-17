import { NextRequest, NextResponse } from "next/server";
import { TransactionRepository } from "../transaction.repository";
import { TransactionHandler } from "../transaction.handler";
import { getUserIdOrUnauthorized } from "../../auth/user.auth";

const repo = new TransactionRepository();
const handler = new TransactionHandler(repo);

interface Params {
  params: {
    id: string;
  };
}

export async function GET(
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

  const result = await handler.getTransaction(userId, transactionId);

  if (!result.success) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}
