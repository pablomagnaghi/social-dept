import { TransactionRepositoryInterface } from "./transaction.repotitory.interface";
import { transactionSchema } from "./transaction.schema";

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
}
