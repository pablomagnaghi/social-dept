import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { getCategories } from "@/app/api/categories/category.action";
import EditTransactionForm from "./edit-transaction-form";
import DeleteTransactionDialog from "./delete-transaction-dialog";
import { getTransaction } from "@/app/api/transactions/transaction.action";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const paramsValues = await params;
  const transactionId = Number(paramsValues.transactionId);

  if (isNaN(transactionId)) {
    notFound();
  }

  const categories = await getCategories();
  const transaction = await getTransaction(transactionId);

  // Narrow the type by checking for error property
  if (!transaction || "error" in transaction) {
    notFound();
  }

  // Now TypeScript knows transaction has id and transactionDate
  return (
    <Card className="mt-4 max-w-screen-md">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <DeleteTransactionDialog
            transactionId={transaction.id}
            transactionDate={
              typeof transaction.transactionDate === "string"
                ? transaction.transactionDate
                : transaction.transactionDate.toISOString()
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditTransactionForm
          transaction={{
            id: transaction.id,
            categoryId: transaction.categoryId,
            amount: String(transaction.amount),
            description: transaction.description,
            transactionDate:
              typeof transaction.transactionDate === "string"
                ? transaction.transactionDate
                : transaction.transactionDate.toISOString(),
          }}
          categories={categories}
        />
      </CardContent>
    </Card>
  );
}
