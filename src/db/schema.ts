import {
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTableCreator,
  text,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name) => `social-dept-finances_${name}`
);

export const categoryType = pgEnum("category_type", ["income", "expense"]);

export const categoriesTable = createTable("categories", (t) => ({
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  type: categoryType("type").notNull(),
}));;

export const transactionsTable = createTable(
  "transactions",
  (t) => ({
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id").notNull(),
    description: text().notNull(),
    amount: numeric().notNull(),
    transactionDate: date("transaction_date").notNull(),
    categoryId: integer("category_id")
      .references(() => categoriesTable.id)
      .notNull(),
  }),
  (t) => [index("transactions_userId_idx").on(t.userId)]
);
