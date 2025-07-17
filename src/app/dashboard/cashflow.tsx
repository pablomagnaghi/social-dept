import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CashflowFilters from "./cashflow-filters";
import { CashflowContent } from "./cashflow-content";
import { getAnnualCashflow, getTransactionYearsRange } from "../api/transactions/transaction.action";

export default async function Cashflow({ year }: { year: number }) {
  const [cashflow, yearsRange] = await Promise.all([
    getAnnualCashflow(year),
    getTransactionYearsRange(),
  ]);

  const safeCshflow = Array.isArray(cashflow) ? cashflow : [];
  const safeYearsRange = Array.isArray(yearsRange) ? yearsRange : [];

  console.log("safeCshflow: ", safeCshflow)
  console.log("safeYearsRange: ", safeYearsRange)

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <CashflowFilters year={year} yearsRange={safeYearsRange} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_250px]">
        <CashflowContent annualCashflow={safeCshflow} />
      </CardContent>
    </Card>
  );
}