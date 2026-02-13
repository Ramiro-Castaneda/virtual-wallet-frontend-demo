import type { Transaction, User, WalletBalance, SavingsGoal } from "./types";

export const currentUser: User = {
  id: "usr_01",
  name: "Alex Morgan",
  email: "alex.morgan@email.com",
  avatarInitials: "AM",
};

export const walletBalance: WalletBalance = {
  available: 12_480.5,
  pending: 350.0,
  currency: "USD",
};

export const transactions: Transaction[] = [
  {
    id: "txn_7f3a9b2c",
    date: "2026-02-12T14:30:00Z",
    description: "Payment to Sarah Chen",
    amount: -250.0,
    status: "completed",
    fromUser: "Alex Morgan",
    toUser: "Sarah Chen",
    type: "debit",
  },
  {
    id: "txn_4e8d1c5a",
    date: "2026-02-11T09:15:00Z",
    description: "Received from James Wilson",
    amount: 1_200.0,
    status: "completed",
    fromUser: "James Wilson",
    toUser: "Alex Morgan",
    type: "credit",
  },
  {
    id: "txn_2b6f8e9d",
    date: "2026-02-10T16:45:00Z",
    description: "Payment to Acme Corp",
    amount: -89.99,
    status: "pending",
    fromUser: "Alex Morgan",
    toUser: "Acme Corp",
    type: "debit",
  },
  {
    id: "txn_9c1d4a7f",
    date: "2026-02-09T11:20:00Z",
    description: "Refund from TechStore",
    amount: 149.99,
    status: "completed",
    fromUser: "TechStore",
    toUser: "Alex Morgan",
    type: "credit",
  },
  {
    id: "txn_5a3e7b2c",
    date: "2026-02-08T08:00:00Z",
    description: "Payment to Maria Lopez",
    amount: -500.0,
    status: "failed",
    fromUser: "Alex Morgan",
    toUser: "Maria Lopez",
    type: "debit",
  },
  {
    id: "txn_8d2c6f1a",
    date: "2026-02-07T13:30:00Z",
    description: "Received from David Kim",
    amount: 75.0,
    status: "completed",
    fromUser: "David Kim",
    toUser: "Alex Morgan",
    type: "credit",
  },
  {
    id: "txn_1f9b4e8c",
    date: "2026-02-06T10:00:00Z",
    description: "Payment to CloudHost Inc",
    amount: -29.99,
    status: "completed",
    fromUser: "Alex Morgan",
    toUser: "CloudHost Inc",
    type: "debit",
  },
  {
    id: "txn_3c7a2d5e",
    date: "2026-02-05T15:45:00Z",
    description: "Payment to Emma Thompson",
    amount: -180.0,
    status: "pending",
    fromUser: "Alex Morgan",
    toUser: "Emma Thompson",
    type: "debit",
  },
  {
    id: "txn_6e4b9f1d",
    date: "2026-02-04T09:30:00Z",
    description: "Received from Freelance Co",
    amount: 3_500.0,
    status: "completed",
    fromUser: "Freelance Co",
    toUser: "Alex Morgan",
    type: "credit",
  },
  {
    id: "txn_0a8c3e7b",
    date: "2026-02-03T17:00:00Z",
    description: "Payment to Office Supply Ltd",
    amount: -67.5,
    status: "completed",
    fromUser: "Alex Morgan",
    toUser: "Office Supply Ltd",
    type: "debit",
  },
  {
    id: "txn_7d1f5b9a",
    date: "2026-02-02T12:15:00Z",
    description: "Received from Partner Inc",
    amount: 820.0,
    status: "completed",
    fromUser: "Partner Inc",
    toUser: "Alex Morgan",
    type: "credit",
  },
  {
    id: "txn_4c9e2a6d",
    date: "2026-02-01T08:45:00Z",
    description: "Payment to Robert Brown",
    amount: -45.0,
    status: "failed",
    fromUser: "Alex Morgan",
    toUser: "Robert Brown",
    type: "debit",
  },
];

export const savingsGoals: SavingsGoal[] = [
  {
    id: "goal_01",
    name: "Emergency Fund",
    targetAmount: 10_000,
    currentAmount: 6_500,
    status: "active",
    deadline: "2026-12-31T00:00:00Z",
    createdAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "goal_02",
    name: "New Laptop",
    targetAmount: 2_500,
    currentAmount: 2_500,
    status: "completed",
    createdAt: "2025-09-15T00:00:00Z",
  },
  {
    id: "goal_03",
    name: "Vacation Fund",
    targetAmount: 5_000,
    currentAmount: 1_200,
    status: "active",
    deadline: "2026-08-01T00:00:00Z",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "goal_04",
    name: "Investment Portfolio",
    targetAmount: 20_000,
    currentAmount: 8_750,
    status: "active",
    deadline: "2027-06-30T00:00:00Z",
    createdAt: "2025-03-01T00:00:00Z",
  },
];

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(dateStr));
}
