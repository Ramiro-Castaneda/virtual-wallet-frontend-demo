"use client";

import { useState } from "react";
import { Eye, EyeOff, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { walletBalance, formatCurrency } from "@/lib/mock-data";

export function BalanceCard() {
  const [visible, setVisible] = useState(true);

  return (
    <Card className="border-none bg-primary text-primary-foreground shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-primary-foreground/70">
              Available Balance
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {visible
                  ? formatCurrency(walletBalance.available)
                  : "$\u2022\u2022\u2022\u2022\u2022\u2022"}
              </h2>
              <span className="text-sm font-medium text-primary-foreground/60">
                {walletBalance.currency}
              </span>
            </div>
          </div>
          <button
            onClick={() => setVisible(!visible)}
            className="rounded-md p-2 text-primary-foreground/60 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label={visible ? "Hide balance" : "Show balance"}
          >
            {visible ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-foreground/10">
              <Clock className="h-3.5 w-3.5 text-primary-foreground/70" />
            </div>
            <div>
              <p className="text-xs text-primary-foreground/50">Pending</p>
              <p className="text-sm font-semibold">
                {visible
                  ? formatCurrency(walletBalance.pending)
                  : "$\u2022\u2022\u2022"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-foreground/10">
              <TrendingUp className="h-3.5 w-3.5 text-primary-foreground/70" />
            </div>
            <div>
              <p className="text-xs text-primary-foreground/50">This month</p>
              <p className="text-sm font-semibold">
                {visible ? "+$4,595.00" : "$\u2022\u2022\u2022"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
