"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { transactions, formatCurrency, formatDate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function RecentTransactions() {
  const recentTxns = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">
          Recent Transactions
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <div className="flex flex-col">
          {recentTxns.map((txn, idx) => (
            <Link
              key={txn.id}
              href={`/dashboard/transactions/${txn.id}`}
              className={cn(
                "flex items-center gap-4 py-3.5 transition-colors hover:bg-muted/50 -mx-3 px-3 rounded-md",
                idx < recentTxns.length - 1 && "border-b border-border"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  txn.type === "credit"
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {txn.type === "credit" ? (
                  <ArrowDownLeft className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {txn.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(txn.date)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    txn.type === "credit"
                      ? "text-success"
                      : "text-foreground"
                  )}
                >
                  {txn.type === "credit" ? "+" : ""}
                  {formatCurrency(Math.abs(txn.amount))}
                </span>
                <StatusBadge status={txn.status} />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
