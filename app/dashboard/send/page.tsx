"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/loading-spinner";
import { walletBalance, formatCurrency } from "@/lib/mock-data";

type FormState = "form" | "confirming" | "sending" | "success";

export default function SendMoneyPage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [formState, setFormState] = useState<FormState>("form");
  const [confirmedAmount, setConfirmedAmount] = useState(0);
  const [errors, setErrors] = useState<{
    recipient?: string;
    amount?: string;
  }>({});

  const parsedAmount = parseFloat(amount) || 0;

  function validate() {
    const newErrors: { recipient?: string; amount?: string } = {};
    if (!recipient.trim()) {
      newErrors.recipient = "Recipient is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) &&
      recipient.trim().length < 2
    ) {
      newErrors.recipient = "Enter a valid email or username";
    }
    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (parsedAmount <= 0) {
      newErrors.amount = "Amount must be greater than zero";
    } else if (parsedAmount > walletBalance.available) {
      newErrors.amount = "Insufficient balance";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleReview() {
    if (!validate()) return;
    setConfirmedAmount(parsedAmount);
    setFormState("confirming");
  }

  async function handleConfirm() {
    setFormState("sending");
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setFormState("success");
  }

  function handleDone() {
    router.push("/dashboard");
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Send Money</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Transfer funds to another user instantly
        </p>
      </div>

      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
              Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 px-6 pb-6 pt-0">
            {/* Recipient */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="recipient"
                className="text-sm font-medium text-foreground"
              >
                Recipient
              </label>
              <Input
                id="recipient"
                type="text"
                placeholder="Email or username"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  if (errors.recipient)
                    setErrors((prev) => ({ ...prev, recipient: undefined }));
                }}
                className={
                  errors.recipient
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.recipient && (
                <p className="text-xs text-destructive">{errors.recipient}</p>
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-foreground"
              >
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount)
                      setErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className={`pl-7 tabular-nums ${
                    errors.amount
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
              </div>
              {errors.amount ? (
                <p className="text-xs text-destructive">{errors.amount}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Available: {formatCurrency(walletBalance.available)}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="note"
                className="text-sm font-medium text-foreground"
              >
                Note{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Input
                id="note"
                type="text"
                placeholder="What is this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <Button
                className="h-11 w-full"
                onClick={handleReview}
              >
                Review Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={formState === "confirming" || formState === "sending"}
        onOpenChange={(open) => {
          if (!open && formState !== "sending") setFormState("form");
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>
              Please review the details before sending
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">To</span>
              <span className="text-sm font-medium text-foreground">
                {recipient}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(confirmedAmount)}
              </span>
            </div>
            {note && (
              <>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Note</span>
                  <span className="text-sm text-foreground">{note}</span>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setFormState("form")}
              disabled={formState === "sending"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={formState === "sending"}
            >
              {formState === "sending" ? (
                <>
                  <LoadingSpinner
                    size="sm"
                    className="text-primary-foreground"
                  />
                  Sending...
                </>
              ) : (
                "Confirm & Send"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={formState === "success"} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              Transfer Successful
            </DialogTitle>
            <DialogDescription className="text-center">
              {formatCurrency(confirmedAmount)} has been sent to {recipient}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Button className="w-full" onClick={handleDone}>
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFormState("form");
                  setRecipient("");
                  setAmount("");
                  setNote("");
                  setConfirmedAmount(0);
                }}
              >
                Send Another Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
