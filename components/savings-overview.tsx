"use client";

import Link from "next/link";
import { Target, PiggyBank, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { savingsGoals, formatCurrency } from "@/lib/mock-data";

export function SavingsOverview() {
  const activeGoals = savingsGoals.filter((g) => g.status === "active");
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Savings Goals</CardTitle>
        <Button variant="ghost" size="sm" asChild className="h-8 gap-1.5 text-xs text-muted-foreground">
          <Link href="/dashboard/savings">
            View Goals
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(totalSaved)}
            </p>
            <p className="text-xs text-muted-foreground">Total saved across all goals</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Overall progress</span>
            <span className="font-medium text-foreground">
              {Math.min(Math.round(overallProgress), 100)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-success/10">
              <Target className="h-3.5 w-3.5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-sm font-semibold text-foreground">{activeGoals.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <PiggyBank className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-sm font-semibold text-foreground">
                {savingsGoals.filter((g) => g.status === "completed").length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
