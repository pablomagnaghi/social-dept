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

export interface TransactionRepositoryInterface {
  create(transaction: TransactionInsert): Promise<TransactionSelect>;
  getByMonth(userId: string, month: number, year: number): Promise<TransactionSelect[]>;
  getTransactionYearsRange(userId: string): Promise<number[]>; 
}