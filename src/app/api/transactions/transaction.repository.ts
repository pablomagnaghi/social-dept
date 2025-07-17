import { db } from "@/db";
import { transactionsTable } from "@/db/schema";

import { format } from "date-fns";
import { TransactionInsert, TransactionRepositoryInterface, TransactionSelect } from "./transaction.repotitory.interface";

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
}
