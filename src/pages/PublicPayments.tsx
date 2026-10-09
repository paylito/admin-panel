import { useEffect, useState } from 'react';
import { getPublicPayments } from '../api/client';
import type { PublicFilters } from '../api/client';
import type { Pagination as PaginationMeta, PublicPayment } from '../types';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { PublicActivity } from '../components/PublicActivity';
import { ASSET_OPTIONS, NETWORK_OPTIONS, STATUS_OPTIONS } from '../lib/constants';
import styles from './Payments.module.css';

const DEFAULT_FILTERS: PublicFilters = { asset: 'any', network: 'any', date: '', status: 'any' };

export function PublicPaymentsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<{ data: PublicPayment[]; pagination: PaginationMeta } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setResult(null);
    setError(null);
    getPublicPayments(page, filters, controller.signal).then((response) => {
      if (controller.signal.aborted) return;
      if (!response.pagination) throw new Error('Missing pagination from the API');
      setResult({ data: response.data, pagination: response.pagination });
    }).catch((err: unknown) => {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Could not load transactions');
    });
    return () => controller.abort();
  }, [page, filters, reload]);
  const update = (patch: Partial<PublicFilters>) => { setFilters((old) => ({ ...old, ...patch })); setPage(0); };
  return <>
    <PageHeader title="transactions" subtitle="follow payments from payer funding to destination delivery" />
    <Card className={styles.filterBar} padding="16px 18px" radius={18}>
      {([{ key: 'asset', label: 'ASSET', options: ASSET_OPTIONS }, { key: 'network', label: 'SOURCE NETWORK', options: NETWORK_OPTIONS }, { key: 'status', label: 'STATUS', options: STATUS_OPTIONS }] as const).map(({ key, label, options }) => <label key={key} className={`${styles.field} ${styles.fAsset}`}><span className={styles.fieldLabel}>{label}</span><select aria-label={label} className={styles.control} value={filters[key]} onChange={(e) => update({ [key]: e.target.value })}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>)}
      <label className={`${styles.field} ${styles.fDate}`}><span className={styles.fieldLabel}>DATE (UTC)</span><input type="date" className={styles.control} value={filters.date} onChange={(e) => update({ date: e.target.value })} /></label>
      <button type="button" className={styles.clear} onClick={() => { setFilters(DEFAULT_FILTERS); setPage(0); }}>clear</button>
    </Card>
    <Card className={styles.tableCard}><div className={styles.tableHead}><h2 className={styles.cardHeading}>all transactions</h2>{result && <span className={styles.count}>{result.pagination.total} payments</span>}</div>
      <div aria-live="polite" aria-busy={!result && !error}>
        {error ? <div className={styles.empty}><p role="alert">{error}</p><button type="button" className={styles.clear} onClick={() => setReload((value) => value + 1)}>try again</button></div> : !result ? <p className={styles.empty}>loading transactions…</p> : !result.data.length ? <p className={styles.empty}>no payments match these filters.</p> : <PublicActivity payments={result.data} />}
      </div>
      {result && <Pagination page={page} total={result.pagination.total} onPage={setPage} />}
    </Card>
  </>;
}
