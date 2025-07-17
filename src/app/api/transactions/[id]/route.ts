import { NextResponse } from "next/server";
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

export async function GET(request: Request, { params }: Params) {
  const userId = await getUserIdOrUnauthorized();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactionId = parseInt(params.id, 10);
  if (isNaN(transactionId)) {
    return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
  }

  try {
    const transaction = await handler.getTransaction(userId, transactionId);
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
