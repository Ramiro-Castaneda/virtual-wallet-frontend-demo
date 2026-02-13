"use client";

import Link from "next/link";
import { ArrowUpRight, History, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 px-6 pb-6 pt-0">
        <Button asChild className="h-12 w-full justify-start gap-3">
          <Link href="/dashboard/send">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-foreground/15">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">Send Money</span>
              <span className="text-xs text-primary-foreground/60">
                Transfer to anyone
              </span>
            </div>
          </Link>
        </Button>

        <Button
          variant="outline"
          asChild
          className="h-12 w-full justify-start gap-3"
        >
          <Link href="/dashboard/transactions">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
              <History className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">View History</span>
              <span className="text-xs text-muted-foreground">
                All transactions
              </span>
            </div>
          </Link>
        </Button>

        <Button
          variant="outline"
          className="h-12 w-full justify-start gap-3"
          disabled
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Add Funds</span>
            <span className="text-xs text-muted-foreground">Coming soon</span>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
