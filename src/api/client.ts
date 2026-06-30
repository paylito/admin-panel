import { avatarColor } from '../lib/constants';
import type {
  AppData,
  DonateeApi,
  MerchantApi,
  OverviewApi,
  Pagination,
  Payment,
} from '../types';

/**
 * Empty by default → the app calls relative `/admin/*` URLs, which the Vite
 * dev proxy forwards to the API and which resolve to the same origin in prod.
 * Set VITE_API_BASE to point at a cross-origin API.
 */
const BASE = import.meta.env.VITE_API_BASE ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface Envelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface Paginated<T> {
  success: boolean;
  data: T[];
  pagination?: Pagination;
  message?: string;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Could not reach the API. Is it running?');
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON body */
  }

  const envelope = json as { success?: boolean; message?: string } | null;
  if (!res.ok || envelope?.success === false) {
    throw new ApiError(
      res.status,
      envelope?.message ?? `Request failed (${res.status})`,
    );
  }
  return json as T;
}

export interface LoginResult {
  token: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: string;
}

export function login(id: string, secret: string): Promise<LoginResult> {
  return request<Envelope<LoginResult>>('/admin/login', {
    method: 'POST',
    body: { id, secret },
  }).then((r) => r.data);
}

export interface MeResult {
  authenticated: boolean;
  sub: string;
  issuedAt: string | null;
  expiresAt: string | null;
}

export function getMe(token: string): Promise<MeResult> {
  return request<Envelope<MeResult>>('/admin/me', { token }).then((r) => r.data);
}

function getOverview(token: string): Promise<OverviewApi> {
  return request<Envelope<OverviewApi>>('/admin/overview', { token }).then(
    (r) => r.data,
  );
}

/** Walk every page of a paginated endpoint and return the full list. */
async function getAll<T>(path: string, token: string): Promise<T[]> {
  const LIMIT = 100;
  const MAX_PAGES = 500; // safety backstop against a misbehaving cursor
  const out: T[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const sep = path.includes('?') ? '&' : '?';
    const res = await request<Paginated<T>>(
      `${path}${sep}page=${page}&limit=${LIMIT}`,
      { token },
    );
    out.push(...res.data);
    if (!res.pagination?.hasNext) break;
  }
  return out;
}

/**
 * Fetch everything the dashboard renders in one shot, augmenting list items
 * with a client-side avatar color. Any 401 propagates so the caller can log out.
 */
export async function loadAll(token: string): Promise<AppData> {
  const [overviewRaw, payments, merchantsRaw, donateesRaw] = await Promise.all([
    getOverview(token),
    getAll<Payment>('/admin/payments', token),
    getAll<MerchantApi>('/admin/merchants', token),
    getAll<DonateeApi>('/admin/donatees', token),
  ]);

  return {
    overview: {
      ...overviewRaw,
      topMerchants: overviewRaw.topMerchants.map((m, i) => ({
        ...m,
        avatarBg: avatarColor(i),
      })),
    },
    payments,
    merchants: merchantsRaw.map((m, i) => ({ ...m, avatarBg: avatarColor(i) })),
    donatees: donateesRaw.map((d, i) => ({ ...d, avatarBg: avatarColor(i) })),
  };
}
