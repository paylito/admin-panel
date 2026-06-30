import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { StatusPill } from '../components/StatusPill';
import { AssetCell, Dash } from '../components/cells';
import { assetNetworkLabel, pageSlice } from '../lib/format';
import { useIsMobile } from '../lib/useMediaQuery';
import { useData } from '../data/AppDataContext';
import { ASSET_OPTIONS, NETWORK_OPTIONS, STATUS_OPTIONS } from '../lib/constants';
import styles from './Payments.module.css';

interface Filters {
  asset: string;
  network: string;
  date: string;
  status: string;
  merchantId: string;
}

const DEFAULT_FILTERS: Filters = {
  asset: 'any',
  network: 'any',
  date: '',
  status: 'any',
  merchantId: '',
};

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`${styles.field} ${className ?? ''}`}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

export function Payments() {
  const isMobile = useIsMobile();
  const { payments } = useData();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(0);
  };

  const clear = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(0);
  };

  const filtered = useMemo(() => {
    const m = filters.merchantId.trim().toLowerCase();
    // The API returns network (e.g. "ethereum") lowercase while the dropdowns
    // use display casing (e.g. "Ethereum"), so compare case-insensitively.
    const matches = (value: string | null, selected: string) =>
      (value ?? '').toLowerCase() === selected.toLowerCase();
    return payments.filter(
      (p) =>
        (filters.asset === 'any' || matches(p.asset, filters.asset)) &&
        (filters.network === 'any' || matches(p.network, filters.network)) &&
        (filters.status === 'any' || p.status === filters.status) &&
        (filters.date === '' || p.dateISO === filters.date) &&
        (m === '' || (p.merchantId ?? '').toLowerCase().includes(m)),
    );
  }, [payments, filters]);

  const pageItems = pageSlice(filtered, page);

  return (
    <>
      <PageHeader
        title="payments"
        subtitle="every payment processed through payli"
      />

      {/* ── filter bar ── */}
      <Card className={styles.filterBar} padding="16px 18px" radius={18}>
        <Field label="ASSET" className={styles.fAsset}>
          <select
            className={styles.control}
            value={filters.asset}
            onChange={(e) => update({ asset: e.target.value })}
          >
            {ASSET_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="NETWORK" className={styles.fNetwork}>
          <select
            className={styles.control}
            value={filters.network}
            onChange={(e) => update({ network: e.target.value })}
          >
            {NETWORK_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="DATE" className={styles.fDate}>
          <input
            type="date"
            className={styles.control}
            value={filters.date}
            onChange={(e) => update({ date: e.target.value })}
          />
        </Field>

        <Field label="STATUS" className={styles.fStatus}>
          <select
            className={styles.control}
            value={filters.status}
            onChange={(e) => update({ status: e.target.value })}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="MERCHANT ID" className={styles.fMerchant}>
          <input
            type="text"
            className={styles.control}
            placeholder="e.g. M-8800"
            value={filters.merchantId}
            onChange={(e) => update({ merchantId: e.target.value })}
          />
        </Field>

        <button type="button" className={styles.clear} onClick={clear}>
          clear
        </button>
      </Card>

      {/* ── table ── */}
      <Card className={styles.tableCard}>
        <div className={styles.tableHead}>
          <h2 className={styles.cardHeading}>all payments</h2>
          <span className={styles.count}>{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>no payments match these filters.</p>
        ) : isMobile ? (
          <div className={styles.mobileList}>
            {pageItems.map((p) => (
              <div key={p.id} className={styles.mCard}>
                <div className={styles.mTop}>
                  <span className={styles.mId}>{p.id}</span>
                  <StatusPill status={p.status} />
                </div>
                <div className={styles.mMerchant}>
                  <span className={styles.mHandle}>
                    {p.merchantHandle ?? '—'}
                  </span>
                  <span className={styles.mMerchantId}>
                    {p.merchantId ?? '—'}
                  </span>
                </div>
                <div className={styles.mBottom}>
                  <span className={styles.mAmount}>{p.usd}</span>
                  <span className={styles.mMeta}>{assetNetworkLabel(p)}</span>
                </div>
                <div className={styles.mPayout}>
                  payout{' '}
                  {p.status === 'completed' && p.payoutTx ? (
                    <span className={styles.mTx}>{p.payoutTx}</span>
                  ) : (
                    <Dash />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.table}>
            <div className={`${styles.rowGrid} ${styles.headRow}`}>
              <span>ID</span>
              <span>MERCHANT</span>
              <span>ASSET</span>
              <span>NETWORK</span>
              <span className={styles.right}>AMOUNT</span>
              <span>PAYOUT TX</span>
              <span className={styles.right}>STATUS</span>
            </div>
            {pageItems.map((p) => (
              <div key={p.id} className={`${styles.rowGrid} ${styles.bodyRow}`}>
                <span className={styles.cId}>
                  <span className={styles.idText}>{p.id}</span>
                  <span className={styles.idDate}>{p.date}</span>
                </span>
                <span className={styles.cMerchant}>
                  <span className={styles.mHandleText}>
                    {p.merchantHandle ?? '—'}
                  </span>
                  <span className={styles.mIdText}>{p.merchantId ?? '—'}</span>
                </span>
                <span className={styles.cAsset}>
                  <AssetCell payment={p} />
                </span>
                <span className={styles.cNetwork}>
                  {p.status === 'completed' && p.network ? p.network : <Dash />}
                </span>
                <span className={styles.amountCell}>
                  <span className={styles.amtUsd}>{p.usd}</span>
                  {p.status === 'completed' && p.crypto && (
                    <span className={styles.amtCrypto}>{p.crypto}</span>
                  )}
                </span>
                <span className={styles.cTx}>
                  {p.status === 'completed' && p.payoutTx ? (
                    <span className={styles.tx}>{p.payoutTx}</span>
                  ) : (
                    <Dash />
                  )}
                </span>
                <span className={`${styles.right} ${styles.cStatus}`}>
                  <StatusPill status={p.status} />
                </span>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} total={filtered.length} onPage={setPage} />
      </Card>
    </>
  );
}
