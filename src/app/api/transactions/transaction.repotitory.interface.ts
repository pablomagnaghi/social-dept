export interface TransactionInsert {
  userId: string;
  amount: number | string;
  transactionDate: Date | string;
  description: string;
  categoryId: number;
}

export interface TransactionSelect {
  id: number;
  userId: string;
  amount: number | string;
  transactionDate: Date | string;
  description: string;
  categoryId: number;
}

export interface RecentTransaction {
  id: number;
  description: string;
  amount: string;
  transactionDate: string;
  category: string | null;
  transactionType: "income" | "expense" | null;
};

export interface MonthlyCashflow {
  month: number;
  income: number;
  expenses: number;
}

export interface TransactionRepositoryInterface {
  create(transaction: TransactionInsert): Promise<TransactionSelect>;
  getByMonth(
    userId: string,
    month: number,
    year: number
  ): Promise<TransactionSelect[]>;
  getTransactionYearsRange(userId: string): Promise<number[]>;
  getTransaction(
    userId: string,
    transactionId: number
  ): Promise<TransactionSelect | null>;
  updateTransaction(data: {
    id: number;
    transactionDate: Date | string;
    description: string;
    amount: number;
    categoryId: number;
    userId: string;
  }): Promise<void>;
  deleteTransaction(userId: string, transactionId: number): Promise<void>;
  getAnnualCashflow(
    userId: string,
    year: number
  ): Promise<
    {
      month: number;
      income: number;
      expenses: number;
    }[]
  >;
  getRecentTransactions(userId: string): Promise<RecentTransaction[]>;
}
