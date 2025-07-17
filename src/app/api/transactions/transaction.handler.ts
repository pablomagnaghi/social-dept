import z from "zod";
import { TransactionRepositoryInterface } from "./transaction.repotitory.interface";
import { transactionSchema } from "./transaction.schema";

const updateTransactionSchema = transactionSchema.and(
  z.object({
    id: z.number(),
  })
);
export class TransactionHandler {
  constructor(private repo: TransactionRepositoryInterface) {}

  async create(input: unknown, userId: string) {
    const parsed = transactionSchema.safeParse(input);

    if (!parsed.success) {
      return {
        error: true,
        status: 400,
        message: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }

    try {
      const transaction = await this.repo.create({
        ...parsed.data,
        userId,
      });

      return {
        success: true,
        status: 201,
        data: transaction,
      };
    } catch (error) {
      return {
        error: true,
        status: 500,
        message: (error as Error).message || "Internal Server Error",
      };
    }
  }

  async getTransactionsByMonth(userId: string, month: number, year: number) {
    try {
      const transactions = await this.repo.getByMonth(userId, month, year);
      return {
        success: true,
        status: 200,
        data: transactions,
      };
    } catch (error) {
      return {
        error: true,
        status: 500,
        message: (error as Error).message || "Internal Server Error",
      };
    }
  }

  async getTransactionYearsRange(userId: string) {
    try {
      const years = await this.repo.getTransactionYearsRange(userId);
      return {
        success: true,
        status: 200,
        data: years,
      };
    } catch (error) {
      return {
        error: true,
        status: 500,
        message: (error as Error).message || "Internal Server Error",
      };
    }
  }

  async getTransaction(userId: string, transactionId: number) {
    try {
      const transaction = await this.repo.getTransaction(userId, transactionId);
      if (!transaction) {
        return {
          error: true,
          status: 404,
          message: "Transaction not found",
        };
      }
      return {
        success: true,
        status: 200,
        data: transaction,
      };
    } catch (error) {
      return {
        error: true,
        status: 500,
        message: (error as Error).message || "Internal Server Error",
      };
    }
  }

  async updateTransaction(input: unknown, userId: string) {
    const validation = updateTransactionSchema.safeParse(input);

    if (!validation.success) {
      return {
        error: true,
        status: 400,
        message: validation.error.issues[0].message,
      };
    }

    const data = validation.data;

    try {
      await this.repo.updateTransaction({
        id: data.id,
        transactionDate: data.transactionDate,
        description: data.description,
        amount: data.amount,
        categoryId: data.categoryId,
        userId,
      });

      return {
        success: true,
        status: 200,
      };
    } catch (error) {
      const msg = (error as Error).message;
      const notFound =
        msg.includes("not found") || msg.includes("unauthorized");

      return {
        error: true,
        status: notFound ? 404 : 500,
        message: msg || "Internal Server Error",
      };
    }
  }

  async deleteTransaction(userId: string, transactionId: number) {
    try {
      await this.repo.deleteTransaction(userId, transactionId);

      return {
        success: true,
        status: 200,
      };
    } catch (error) {
      const msg = (error as Error).message;
      const notFound =
        msg.includes("not found") || msg.includes("unauthorized");

      return {
        error: true,
        status: notFound ? 404 : 500,
        message: msg || "Internal Server Error",
      };
    }
  }
}
