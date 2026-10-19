import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { randomUUID } from 'node:crypto';

export const txTypeEnum = pgEnum('TxType', [
  'DEPOSIT',
  'PAYOUT',
  'WITHDRAWAL',
  'PAYMENT',
  'REFUND',
  'WALLET_PAY',
  'WALLET_FUND',
]);
export const txStatusEnum = pgEnum('TxStatus', ['PENDING', 'SUCCESS', 'FAILED']);
export const payoutStatusEnum = pgEnum('PayoutStatus', [
  'PENDING',
  'READY_FOR_PROCESSING',
  'PROCESSING',
  'PAID',
  'FAILED',
]);
export const orderStatusEnum = pgEnum('OrderStatus', [
  'PAYMENT_PENDING',
  'PAID',
  'PENDING',
  'ACCEPTED',
  'ON_ROUTE',
  'DELIVERED',
  'CONFIRMED',
  'REJECTED',
  'CANCELLED',
]);
export const orderTypeEnum = pgEnum('OrderType', ['STANDARD', 'QUICK']);
export const roleEnum = pgEnum('Role', ['USER', 'VENDOR', 'ADMIN']);
export const riskLevelEnum = pgEnum('RiskLevel', ['LOW', 'MEDIUM', 'HIGH']);
export const profileTypeEnum = pgEnum('ProfileType', ['USER', 'VENDOR', 'ADMIN']);
export const cylinderSizeEnum = pgEnum('CylinderSize', [
  'KG_3',
  'KG_6',
  'KG_12',
  'KG_12_5',
  'KG_25',
]);
export const ticketStatusEnum = pgEnum('TicketStatus', ['OPEN', 'IN_PROGRESS', 'RESOLVED']);

const id = () => text('id').primaryKey().$defaultFn(() => randomUUID());
const createdAt = () => timestamp('createdAt', { precision: 3 }).notNull().defaultNow();
const updatedAt = () => timestamp('updatedAt', { precision: 3 }).notNull().defaultNow();

export const users = pgTable(
  'User',
  {
    id: id(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    riskLevel: riskLevelEnum('riskLevel'),
    role: roleEnum('role').notNull().default('USER'),
    deletedAt: timestamp('deletedAt', { precision: 3 }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex('User_email_key').on(table.email), index('User_email_idx').on(table.email)],
);

export const profiles = pgTable(
  'Profile',
  {
    id: id(),
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    profileType: profileTypeEnum('profileType').notNull().default('USER'),
    businessName: text('businessName'),
    phone: text('phone'),
    profilePic: text('profilePic'),
    address: text('address'),
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude'),
    isVerified: boolean('isVerified').notNull().default(false),
    flutterwaveCustomerId: text('flutterwaveCustomerId'),
    walletBalance: numeric('walletBalance', { precision: 65, scale: 30 }).notNull().default('0.00'),
    bankCode: text('bankCode'),
    bankAccountNumber: text('bankAccountNumber'),
    flagCount: integer('flagCount').notNull().default(0),
    flagReason: text('flagReason'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp('deletedAt', { precision: 3 }),
  },
  (table) => [
    uniqueIndex('Profile_userId_key').on(table.userId),
    uniqueIndex('Profile_flutterwaveCustomerId_key').on(table.flutterwaveCustomerId),
  ],
);

export const otpVerifications = pgTable(
  'OtpVerification',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    codeHash: text('codeHash').notNull(),
    purpose: text('purpose').notNull(),
    expiresAt: timestamp('expiresAt', { precision: 3 }).notNull(),
    usedAt: timestamp('usedAt', { precision: 3 }),
    createdAt: createdAt(),
  },
  (table) => [index('OtpVerification_userId_idx').on(table.userId)],
);

export const cylinders = pgTable(
  'Cylinder',
  {
    id: id(),
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    size: cylinderSizeEnum('size').notNull(),
    serialNumber: text('serialNumber'),
    nickname: text('nickname'),
    lastRefill: timestamp('lastRefill', { precision: 3 }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex('Cylinder_serialNumber_key').on(table.serialNumber)],
);

export const gasPredictions = pgTable(
  'GasPrediction',
  {
    id: id(),
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    cylinderId: text('cylinderId').references(() => cylinders.id, { onDelete: 'set null' }),
    estimatedEmptyDate: timestamp('estimatedEmptyDate', { precision: 3 }).notNull(),
    confidence: doublePrecision('confidence'),
    predictionInput: jsonb('prediction_input'),
    createdAt: createdAt(),
  },
  (table) => [
    index('GasPrediction_userId_idx').on(table.userId),
    index('GasPrediction_cylinderId_idx').on(table.cylinderId),
  ],
);

export const notifications = pgTable(
  'Notification',
  {
    id: id(),
    userId: text('userId').notNull().references(() => users.id),
    title: text('title').notNull().default('Notification'),
    message: text('message').notNull(),
    type: text('type').notNull().default('info'),
    isRead: boolean('isRead').notNull().default(false),
    createdAt: createdAt(),
  },
  (table) => [index('Notification_userId_idx').on(table.userId)],
);

export const supportTickets = pgTable(
  'SupportTicket',
  {
    id: id(),
    userId: text('userId').notNull().references(() => users.id),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    status: ticketStatusEnum('status').notNull().default('OPEN'),
    createdAt: createdAt(),
  },
  (table) => [index('SupportTicket_userId_idx').on(table.userId)],
);

export const loginHistories = pgTable(
  'LoginHistory',
  {
    id: id(),
    userId: text('userId').notNull().references(() => users.id),
    ipAddress: text('ipAddress').notNull(),
    userAgent: text('userAgent'),
    createdAt: createdAt(),
  },
  (table) => [index('LoginHistory_userId_idx').on(table.userId)],
);

export const transactions = pgTable(
  'Transaction',
  {
    id: id(),
    orderId: text('orderId'),
    amount: numeric('amount', { precision: 65, scale: 30 }).notNull(),
    commission: numeric('commission', { precision: 65, scale: 30 }).notNull().default('0.00'),
    type: txTypeEnum('type').notNull(),
    status: txStatusEnum('status').notNull(),
    reference: text('reference').notNull(),
    description: text('description'),
    gateway: text('gateway'),
    gatewayReference: text('gatewayReference'),
    createdAt: createdAt(),
    sourceUserId: text('sourceUserId'),
    destinationUserId: text('destinationUserId'),
    userId: text('userId'),
  },
  (table) => [
    uniqueIndex('Transaction_reference_key').on(table.reference),
    uniqueIndex('Transaction_gatewayReference_key').on(table.gatewayReference),
    index('Transaction_orderId_idx').on(table.orderId),
    index('Transaction_sourceUserId_idx').on(table.sourceUserId),
    index('Transaction_destinationUserId_idx').on(table.destinationUserId),
    index('Transaction_userId_idx').on(table.userId),
  ],
);

export const orders = pgTable(
  'Order',
  {
    id: id(),
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    vendorId: text('vendorId').notNull().references(() => users.id),
    status: orderStatusEnum('status').notNull().default('PENDING'),
    type: orderTypeEnum('type').notNull(),
    totalAmount: numeric('totalAmount', { precision: 65, scale: 30 }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    cylinderId: text('cylinderId').references(() => cylinders.id, { onDelete: 'set null' }),
    beforeFillImage: text('beforeFillImage'),
    afterFillImage: text('afterFillImage'),
  },
  (table) => [index('Order_userId_idx').on(table.userId), index('Order_vendorId_idx').on(table.vendorId)],
);

export const payouts = pgTable(
  'Payout',
  {
    id: id(),
    orderId: text('orderId').notNull().references(() => orders.id),
    vendorId: text('vendorId').notNull().references(() => users.id),
    amount: numeric('amount', { precision: 65, scale: 30 }).notNull(),
    status: payoutStatusEnum('status').notNull().default('PENDING'),
    gatewayReference: text('gatewayReference'),
    reference: text('reference').notNull(),
    failureReason: text('failureReason'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex('Payout_orderId_key').on(table.orderId),
    uniqueIndex('Payout_gatewayReference_key').on(table.gatewayReference),
    uniqueIndex('Payout_reference_key').on(table.reference),
  ],
);

export const orderItems = pgTable(
  'OrderItem',
  {
    id: id(),
    orderId: text('orderId').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    quantity: numeric('quantity', { precision: 65, scale: 30 }).notNull(),
    price: numeric('price', { precision: 65, scale: 30 }).notNull(),
  },
  (table) => [index('OrderItem_orderId_idx').on(table.orderId)],
);

export const reviews = pgTable(
  'Review',
  {
    id: id(),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    authorId: text('authorId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    targetUserId: text('targetUserId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    orderId: text('orderId').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  },
  (table) => [
    uniqueIndex('Review_orderId_key').on(table.orderId),
    index('Review_authorId_idx').on(table.authorId),
    index('Review_targetUserId_idx').on(table.targetUserId),
  ],
);

export const vendorListings = pgTable(
  'VendorListing',
  {
    id: id(),
    vendorId: text('vendorId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    pricePerKg: numeric('pricePerKg', { precision: 65, scale: 30 }).notNull(),
    maxKg: numeric('maxKg', { precision: 65, scale: 30 }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex('VendorListing_vendorId_key').on(table.vendorId)],
);

export type UserRecord = typeof users.$inferSelect;
export type ProfileRecord = typeof profiles.$inferSelect;
export type OrderRecord = typeof orders.$inferSelect;
export type TransactionRecord = typeof transactions.$inferSelect;
export type PayoutRecord = typeof payouts.$inferSelect;
