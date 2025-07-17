import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";

import { format } from "date-fns";
import {
  TransactionInsert,
  TransactionRepositoryInterface,
  TransactionSelect,
} from "./transaction.repotitory.interface";
import { and, desc, eq, gte, lte, asc } from "drizzle-orm";

export class TransactionRepository implements TransactionRepositoryInterface {
  async create(transaction: TransactionInsert): Promise<TransactionSelect> {
    const formattedDate =
      transaction.transactionDate instanceof Date
        ? format(transaction.transactionDate, "yyyy-MM-dd")
        : transaction.transactionDate;

    const [inserted] = await db
      .insert(transactionsTable)
      .values({
        ...transaction,
        transactionDate: formattedDate,
        amount: transaction.amount.toString(),
      })
      .returning();

    if (!inserted) {
      throw new Error("Failed to insert transaction");
    }

    return inserted;
  }

  async getByMonth(
    userId: string,
    month: number,
    year: number
  ): Promise<Transaction[]> {
    const earliestDate = new Date(year, month - 1, 1);
    const latestDate = new Date(year, month, 0);

    const transactions = await db
      .select({
        id: transactionsTable.id,
        userId: transactionsTable.userId,
        categoryId: transactionsTable.categoryId,
        description: transactionsTable.description,
        amount: transactionsTable.amount,
        transactionDate: transactionsTable.transactionDate,
        category: categoriesTable.name,
        transactionType: categoriesTable.type,
      })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.userId, userId),
          gte(
            transactionsTable.transactionDate,
            format(earliestDate, "yyyy-MM-dd")
          ),
          lte(
            transactionsTable.transactionDate,
            format(latestDate, "yyyy-MM-dd")
          )
        )
      )
      .orderBy(desc(transactionsTable.transactionDate))
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id)
      );

    const transactionsSelect = transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      categoryId: t.categoryId,
      description: t.description,
      amount: Number(t.amount),
      transactionDate: t.transactionDate,
      category: t.category ?? "Uncategorized",
      transactionType: t.transactionType ?? "expense",
    }));

    return transactionsSelect;
  }

  async getTransactionYearsRange(userId: string): Promise<number[]> {
    const [earliestTransaction] = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, userId))
      .orderBy(asc(transactionsTable.transactionDate))
      .limit(1);

    const today = new Date();
    const currentYear = today.getFullYear();
    const earliestYear = earliestTransaction
      ? new Date(earliestTransaction.transactionDate).getFullYear()
      : currentYear;

    const years = Array.from({ length: currentYear - earliestYear + 1 }).map(
      (_, i) => currentYear - i
    );

    return years;
  }
}
