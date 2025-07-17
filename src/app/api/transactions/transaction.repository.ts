import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";

import { format } from "date-fns";
import {
  MonthlyCashflow,
  RecentTransaction,
  TransactionByMontht,
  TransactionInsert,
  TransactionRepositoryInterface,
  TransactionSelect,
} from "./transaction.repotitory.interface";
import { and, desc, eq, gte, lte, asc, sql, sum } from "drizzle-orm";

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
  ): Promise<TransactionByMontht[]> {
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

  async getTransaction(
    userId: string,
    transactionId: number
  ): Promise<TransactionSelect | null> {
    const [transaction] = await db
      .select()
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, transactionId),
          eq(transactionsTable.userId, userId)
        )
      );

    return transaction;
  }

  async updateTransaction(data: {
    id: number;
    transactionDate: string;
    description: string;
    amount: number;
    categoryId: number;
    userId: string;
  }): Promise<void> {
    const result = await db
      .update(transactionsTable)
      .set({
        transactionDate: data.transactionDate,
        description: data.description,
        amount: data.amount.toString(),
        categoryId: data.categoryId,
      })
      .where(
        and(
          eq(transactionsTable.id, data.id),
          eq(transactionsTable.userId, data.userId)
        )
      );

    if (result.rowCount === 0) {
      throw new Error("Transaction not found or unauthorized");
    }
  }

  async deleteTransaction(
    userId: string,
    transactionId: number
  ): Promise<void> {
    const result = await db
      .delete(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, transactionId),
          eq(transactionsTable.userId, userId)
        )
      );

    if (result.rowCount === 0) {
      throw new Error("Transaction not found or unauthorized");
    }
  }

  async getAnnualCashflow(
    userId: string,
    year: number
  ): Promise<MonthlyCashflow[]> {
    const monthExtract = sql`EXTRACT(MONTH FROM ${transactionsTable.transactionDate})`;

    const rawCashflow = await db
      .select({
        month: monthExtract,
        totalIncome: sum(
          sql`CASE WHEN ${categoriesTable.type} = 'income' THEN ${transactionsTable.amount} ELSE 0 END`
        ),
        totalExpenses: sum(
          sql`CASE WHEN ${categoriesTable.type} = 'expense' THEN ${transactionsTable.amount} ELSE 0 END`
        ),
      })
      .from(transactionsTable)
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id)
      )
      .where(
        and(
          eq(transactionsTable.userId, userId),
          sql`EXTRACT(YEAR FROM ${transactionsTable.transactionDate}) = ${year}`
        )
      )
      .groupBy(monthExtract);

    // Build full 12 months with 0 values for months without data
    const annualCashflow: MonthlyCashflow[] = Array.from(
      { length: 12 },
      (_, i) => {
        const monthNum = i + 1;
        const monthlyData = rawCashflow.find(
          (entry) => Number(entry.month) === monthNum
        );

        return {
          month: monthNum,
          income: Math.round(Number(monthlyData?.totalIncome ?? 0) * 100) / 100,
          expenses:
            Math.round(Number(monthlyData?.totalExpenses ?? 0) * 100) / 100,
        };
      }
    );

    return annualCashflow;
  }

  async getRecentTransactions(userId: string): Promise<RecentTransaction[]> {
    const transactions = await db
      .select({
        id: transactionsTable.id,
        description: transactionsTable.description,
        amount: transactionsTable.amount,
        transactionDate: transactionsTable.transactionDate,
        category: categoriesTable.name,
        transactionType: categoriesTable.type,
      })
      .from(transactionsTable)
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id)
      )
      .where(eq(transactionsTable.userId, userId))
      .orderBy(desc(transactionsTable.transactionDate))
      .limit(5);

    return transactions;
  }
}
