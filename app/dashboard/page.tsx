import { BalanceCard } from "@/components/balance-card";
import { RecentTransactions } from "@/components/recent-transactions";
import { QuickActions } from "@/components/quick-actions";
import { SavingsOverview } from "@/components/savings-overview";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your wallet activity
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-2 min-w-0">
          <BalanceCard />
          <RecentTransactions />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 min-w-0">
          <QuickActions />
          <SavingsOverview />

          {/* Activity summary card */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Monthly Summary
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Money sent
                </span>
                <span className="text-sm font-medium text-foreground">
                  $1,162.48
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Money received
                </span>
                <span className="text-sm font-medium text-success">
                  $5,744.99
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Transactions
                </span>
                <span className="text-sm font-medium text-foreground">12</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Failed
                </span>
                <span className="text-sm font-medium text-destructive">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
