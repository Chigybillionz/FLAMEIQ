export type PaymentMethodType = "card" | "bank";

// Mirrors the backend TxStatus enum (backend/prisma/schema.prisma).
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface BankDetails {
  bankName: string;
  bankTag: string;
  accountName: string;
  accountNumber: string;
}

export interface PaymentSummary {
  orderId: string;
  amount: number;
  method: PaymentMethodType;
  reference: string;
  transactionTime: string;
  status: PaymentStatus;
}
