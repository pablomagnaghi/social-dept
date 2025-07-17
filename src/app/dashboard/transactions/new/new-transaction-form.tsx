"use client";

import { useAuth } from "@clerk/nextjs"; // import Clerk's hook
import TransactionForm, {
  transactionFormSchema,
} from "@/components/transaction-form";
import { z } from "zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Category } from "@/app/api/categories/category.type";
import { useToast } from "@/hooks/use-toast";

export default function NewTransactionForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { getToken } = useAuth(); // getToken lets you get the session token

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    try {
      const token = await getToken(); // get Clerk session token

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // attach token here
        },
        body: JSON.stringify({
          amount: data.amount,
          transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
          categoryId: data.categoryId,
          description: data.description,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: result.error || "Something went wrong.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Transaction created.",
        variant: "success",
      });

      router.push("/dashboard/transactions");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return <TransactionForm onSubmit={handleSubmit} categories={categories} />;
}
