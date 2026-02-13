export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  fromUser: string;
  toUser: string;
  type: "credit" | "debit";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
}

export interface WalletBalance {
  available: number;
  pending: number;
  currency: string;
}

export type SavingsGoalStatus = "active" | "completed";

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  status: SavingsGoalStatus;
  deadline?: string;
  createdAt: string;
}
