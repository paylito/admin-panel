export type Status = 'completed' | 'pending' | 'failed';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'finished'
  | 'expired'
  | 'failed'
  | 'manual_review';

export interface Payment {
  id: string;
  merchantHandle: string | null;
  merchantId: string | null;
  asset: string | null; // null unless completed
  network: string | null; // null unless completed
  status: Status;
  orderStatus: OrderStatus;
  dateISO: string; // "2026-06-27" (date filter)
  date: string; // "jun 27, 2026" (pre-formatted display)
  usd: string; // "$13.00" (pre-formatted display)
  amountUsd: number;
  crypto: string | null; // null unless completed
  payoutTx: string | null; // null unless completed
}

/** As returned by the API (no avatarBg). */
export interface MerchantApi {
  name: string | null;
  id: string;
  username: string | null;
  donationUsername: string | null;
  payments: number;
  paidOut: number;
  revenue: number;
}

export interface Merchant extends MerchantApi {
  avatarBg: string; // assigned client-side
}

export interface DonateeApi {
  donationUsername: string | null;
  donations: number;
  raised: number;
  telegram: string | null;
}

export interface Donatee extends DonateeApi {
  avatarBg: string; // assigned client-side
}

export interface PaymentMethod {
  asset: string;
  amount: number;
  count: number;
  pct: number;
}

export interface TopMerchantApi {
  merchantId: string | null;
  name: string | null;
  handle: string | null;
  payments: number;
  paidOut: number;
}

export interface TopMerchant extends TopMerchantApi {
  avatarBg: string;
}

/** As returned by the API. */
export interface OverviewApi {
  totalVolume: number;
  revenue: number;
  pendingPayouts: { amount: number; queued: number };
  dailyPayments: number;
  avgTransactionValue: number;
  successRate: number;
  totalMerchants: number;
  newSignupsToday: number;
  paymentMethods: PaymentMethod[];
  topMerchants: TopMerchantApi[];
  recentPayments: Payment[];
  /** Optional fields the API may add later — rendered only when present. */
  volumeSeries?: number[];
  volumeDelta?: string;
}

export interface Overview extends Omit<OverviewApi, 'topMerchants'> {
  topMerchants: TopMerchant[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  from: number;
  to: number;
}

/** Everything the dashboard needs, fetched once on load. */
export interface AppData {
  overview: Overview;
  payments: Payment[];
  merchants: Merchant[];
  donatees: Donatee[];
}
