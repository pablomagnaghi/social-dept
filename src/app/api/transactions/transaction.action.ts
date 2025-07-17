"use server";

import { auth } from "@clerk/nextjs/server";
import { TransactionRepository } from "./transaction.repository";
import { transactionSchema } from "./transaction.schema";
import z from "zod";

const repo = new TransactionRepository();

async function getUserIdOrUnauthorized() {
  const { userId } = await auth();
  return userId || null;
}

const updateTransactionSchema = transactionSchema.and(
  z.object({
    id: z.number(),
  })
);

export async function getTransactionYearsRange() {
  const userId = await getUserIdOrUnauthorized();
  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  return repo.getTransactionYearsRange(userId);
}

export async function getTransactionsByMonth({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  return repo.getByMonth(userId, month, year);
}

export async function getTransaction(transactionId: number) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  return repo.getTransaction(userId, transactionId);
}

export async function updateTransaction(data: {
  id: number;
  transactionDate: string;
  description: string;
  amount: number;
  categoryId: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const validation = updateTransactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

  return repo.updateTransaction({
    id: data.id,
    transactionDate: data.transactionDate,
    description: data.description,
    amount: data.amount,
    categoryId: data.categoryId,
    userId,
  });
}

export async function deleteTransaction(transactionId: number) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  return repo.deleteTransaction(userId, transactionId);
}

export async function getAnnualCashflow(year: number) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  try {
    return await repo.getAnnualCashflow(userId, year);
  } catch (error) {
    return {
      error: true,
      message: (error as Error).message || "Internal Server Error",
    };
  }
}

export async function getRecentTransactions() {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  return repo.getRecentTransactions(userId);
}
