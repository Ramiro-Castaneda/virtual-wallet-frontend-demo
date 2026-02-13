"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { ErrorState } from "@/components/error-state";
import {
  transactions,
  formatCurrency,
  formatDateTime,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const txn = transactions.find((t) => t.id === id);
  const [copied, setCopied] = useState(false);

  if (!txn) {
    return (
      <div className="space-y-8">
        <ErrorState
          title="Transaction not found"
          description="The transaction you are looking for does not exist or has been removed."
        />
      </div>
    );
  }

  function handleCopyId() {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link
          href="/dashboard/transactions"
          className="flex items-center gap-1.5 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Link>
      </Button>

      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                txn.type === "credit"
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {txn.type === "credit" ? (
                <ArrowDownLeft className="h-5 w-5" />
              ) : (
                <ArrowUpRight className="h-5 w-5" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {txn.description}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatDateTime(txn.date)}
              </p>
            </div>
          </div>
          <StatusBadge status={txn.status} />
        </div>

        {/* Amount card */}
        <Card className="mb-6 border-none bg-muted/50">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                {txn.type === "credit" ? "Amount Received" : "Amount Sent"}
              </p>
              <p
                className={cn(
                  "text-4xl font-bold tracking-tight",
                  txn.type === "credit"
                    ? "text-success"
                    : "text-foreground"
                )}
              >
                {txn.type === "credit" ? "+" : "-"}
                {formatCurrency(Math.abs(txn.amount))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-border">
              <DetailRow label="Transaction ID">
                <div className="flex items-center gap-2">
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm text-foreground">
                    {txn.id}
                  </code>
                  <button
                    onClick={handleCopyId}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Copy transaction ID"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </DetailRow>

              <DetailRow label="Status">
                <StatusBadge status={txn.status} />
              </DetailRow>

              <DetailRow label="Date & Time">
                <span className="text-sm text-foreground">
                  {formatDateTime(txn.date)}
                </span>
              </DetailRow>

              <DetailRow label="From">
                <span className="text-sm font-medium text-foreground">
                  {txn.fromUser}
                </span>
              </DetailRow>

              <DetailRow label="To">
                <span className="text-sm font-medium text-foreground">
                  {txn.toUser}
                </span>
              </DetailRow>

              <DetailRow label="Type">
                <span className="text-sm capitalize text-foreground">
                  {txn.type === "credit" ? "Incoming" : "Outgoing"}
                </span>
              </DetailRow>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
