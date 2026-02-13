"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  Calendar,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  savingsGoals as initialGoals,
  walletBalance,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";
import type { SavingsGoal, SavingsGoalStatus } from "@/lib/types";

const statusConfig: Record<
  SavingsGoalStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  active: {
    label: "Active",
    dotClass: "bg-success",
    badgeClass: "bg-success/10 text-success border-success/20",
  },
  completed: {
    label: "Completed",
    dotClass: "bg-primary",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
};

type ModalMode = "add" | "withdraw";

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastAction, setLastAction] = useState<{
    mode: ModalMode;
    amount: number;
    goalName: string;
  } | null>(null);

  // Create goal state
  const [createOpen, setCreateOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [createErrors, setCreateErrors] = useState<{
    name?: string;
    target?: string;
  }>({});
  const [isCreating, setIsCreating] = useState(false);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const activeCount = goals.filter((g) => g.status === "active").length;

  function openModal(goal: SavingsGoal, mode: ModalMode) {
    setSelectedGoal(goal);
    setModalMode(mode);
    setAmount("");
    setError("");
    setModalOpen(true);
  }

  function validate(): boolean {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid amount greater than $0");
      return false;
    }
    if (modalMode === "add" && parsed > walletBalance.available) {
      setError("Amount exceeds your available balance");
      return false;
    }
    if (modalMode === "add" && selectedGoal) {
      const remaining = selectedGoal.targetAmount - selectedGoal.currentAmount;
      if (parsed > remaining) {
        setError(`Amount exceeds the remaining target (${formatCurrency(remaining)})`);
        return false;
      }
    }
    if (modalMode === "withdraw" && selectedGoal && parsed > selectedGoal.currentAmount) {
      setError("Amount exceeds the goal balance");
      return false;
    }
    setError("");
    return true;
  }

  async function handleConfirm() {
    if (!validate() || !selectedGoal) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    const parsed = parseFloat(amount);
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== selectedGoal.id) return g;
        const newAmount =
          modalMode === "add" ? g.currentAmount + parsed : g.currentAmount - parsed;
        const newStatus: SavingsGoalStatus =
          newAmount >= g.targetAmount ? "completed" : "active";
        return { ...g, currentAmount: newAmount, status: newStatus };
      })
    );

    setLastAction({ mode: modalMode, amount: parsed, goalName: selectedGoal.name });
    setIsProcessing(false);
    setModalOpen(false);
    setSuccessOpen(true);
  }

  function getProgressPercent(goal: SavingsGoal) {
    if (goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }

  function getProgressColor(pct: number) {
    if (pct >= 100) return "bg-success";
    if (pct >= 60) return "bg-primary";
    if (pct >= 30) return "bg-warning";
    return "bg-primary/60";
  }

  function openCreateModal() {
    setNewGoalName("");
    setNewGoalTarget("");
    setNewGoalDeadline("");
    setCreateErrors({});
    setCreateOpen(true);
  }

  function validateCreate(): boolean {
    const errs: { name?: string; target?: string } = {};
    if (!newGoalName.trim()) {
      errs.name = "Goal name is required";
    }
    const parsed = parseFloat(newGoalTarget);
    if (!newGoalTarget || isNaN(parsed) || parsed <= 0) {
      errs.target = "Enter a valid target amount greater than $0";
    }
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleCreateGoal() {
    if (!validateCreate()) return;
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 800));

    const newGoal: SavingsGoal = {
      id: `goal_${Date.now()}`,
      name: newGoalName.trim(),
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: 0,
      status: "active",
      deadline: newGoalDeadline ? `${newGoalDeadline}T00:00:00Z` : undefined,
      createdAt: new Date().toISOString(),
    };

    setGoals((prev) => [newGoal, ...prev]);
    setIsCreating(false);
    setCreateOpen(false);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-3 -ml-2 h-8 gap-1.5 text-muted-foreground"
        >
          <Link href="/dashboard">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Savings Goals</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your savings and track progress toward your financial goals.
            </p>
          </div>
          <Button className="h-9 gap-1.5" onClick={openCreateModal}>
            <Plus className="h-3.5 w-3.5" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Saved
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatCurrency(totalSaved)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Active Goals
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Available Balance
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {formatCurrency(walletBalance.available)}
          </p>
        </div>
      </div>

      {/* Goal cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((goal) => {
          const pct = getProgressPercent(goal);
          const config = statusConfig[goal.status];
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <Card key={goal.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Top color bar */}
                <div
                  className={cn(
                    "h-1",
                    goal.status === "completed" ? "bg-success" : "bg-primary"
                  )}
                />
                <div className="p-6">
                  {/* Name + Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          goal.status === "completed"
                            ? "bg-success/10"
                            : "bg-primary/10"
                        )}
                      >
                        <Target
                          className={cn(
                            "h-5 w-5",
                            goal.status === "completed"
                              ? "text-success"
                              : "text-primary"
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{goal.name}</h3>
                        {goal.deadline && (
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(goal.deadline)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        config.badgeClass
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
                      {config.label}
                    </span>
                  </div>

                  {/* Amounts */}
                  <div className="mt-5 flex items-baseline justify-between">
                    <span className="text-xl font-bold text-foreground">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      of {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          getProgressColor(pct)
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{Math.round(pct)}% completed</span>
                      {goal.status === "active" && (
                        <span>{formatCurrency(remaining)} remaining</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {goal.status === "active" && (
                    <div className="mt-5 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-9 flex-1 gap-1.5"
                        onClick={() => openModal(goal, "add")}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Money
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 flex-1 gap-1.5"
                        onClick={() => openModal(goal, "withdraw")}
                        disabled={goal.currentAmount === 0}
                      >
                        <Minus className="h-3.5 w-3.5" />
                        Withdraw
                      </Button>
                    </div>
                  )}

                  {goal.status === "completed" && (
                    <div className="mt-5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-full gap-1.5"
                        onClick={() => openModal(goal, "withdraw")}
                      >
                        <Minus className="h-3.5 w-3.5" />
                        Withdraw Funds
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add / Withdraw Modal */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open && !isProcessing) {
            setModalOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "add" ? "Add Money" : "Withdraw Funds"}
            </DialogTitle>
            <DialogDescription>
              {modalMode === "add"
                ? `Move money from your wallet into "${selectedGoal?.name}".`
                : `Withdraw money from "${selectedGoal?.name}" back to your wallet.`}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-4">
            {/* Info bar */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
              <span className="text-xs text-muted-foreground">
                {modalMode === "add" ? "Available balance" : "Goal balance"}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(
                  modalMode === "add"
                    ? walletBalance.available
                    : selectedGoal?.currentAmount ?? 0
                )}
              </span>
            </div>

            {modalMode === "add" && selectedGoal && (
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
                <span className="text-xs text-muted-foreground">Remaining target</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(selectedGoal.targetAmount - selectedGoal.currentAmount)}
                </span>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label
                htmlFor="modal-amount"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Amount
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="modal-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  className={cn("pl-7", error && "border-destructive")}
                  disabled={isProcessing}
                />
              </div>
              {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
            </div>

            {/* Confirm */}
            <Button
              className="h-11 w-full"
              onClick={handleConfirm}
              disabled={isProcessing || !amount}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Confirm ${modalMode === "add" ? "Deposit" : "Withdrawal"}`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              {lastAction?.mode === "add"
                ? "Deposit Successful"
                : "Withdrawal Successful"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {lastAction &&
                `${formatCurrency(lastAction.amount)} has been ${
                  lastAction.mode === "add" ? "added to" : "withdrawn from"
                } "${lastAction.goalName}".`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <Button className="w-full" onClick={() => setSuccessOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Goal Modal */}
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (!open && !isCreating) setCreateOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Savings Goal</DialogTitle>
            <DialogDescription>
              Set a target and start saving toward a specific goal.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Goal name */}
            <div>
              <label
                htmlFor="goal-name"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Goal Name
              </label>
              <Input
                id="goal-name"
                type="text"
                placeholder="e.g. Emergency Fund, New Car"
                value={newGoalName}
                onChange={(e) => {
                  setNewGoalName(e.target.value);
                  if (createErrors.name)
                    setCreateErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={cn(createErrors.name && "border-destructive")}
                disabled={isCreating}
              />
              {createErrors.name && (
                <p className="mt-1.5 text-xs text-destructive">
                  {createErrors.name}
                </p>
              )}
            </div>

            {/* Target amount */}
            <div>
              <label
                htmlFor="goal-target"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Target Amount
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="goal-target"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={newGoalTarget}
                  onChange={(e) => {
                    setNewGoalTarget(e.target.value);
                    if (createErrors.target)
                      setCreateErrors((prev) => ({
                        ...prev,
                        target: undefined,
                      }));
                  }}
                  className={cn(
                    "pl-7",
                    createErrors.target && "border-destructive"
                  )}
                  disabled={isCreating}
                />
              </div>
              {createErrors.target && (
                <p className="mt-1.5 text-xs text-destructive">
                  {createErrors.target}
                </p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label
                htmlFor="goal-deadline"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Deadline{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Input
                id="goal-deadline"
                type="date"
                value={newGoalDeadline}
                onChange={(e) => setNewGoalDeadline(e.target.value)}
                disabled={isCreating}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGoal}
              disabled={isCreating || !newGoalName.trim() || !newGoalTarget}
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Goal"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
