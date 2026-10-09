import { pageCount, pageInfo } from '../lib/format';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  total: number;
  onPage: (page: number) => void;
}

/** "showing x–y of n" + prev / numbered / next controls. Hidden for a single page. */
export function Pagination({ page, total, onPage }: PaginationProps) {
  const pages = pageCount(total);
  if (pages <= 1) return null;

  const { from, to } = pageInfo(page, total);

  return (
    <div className={styles.bar}>
      <span className={styles.summary}>
        showing {from}–{to} of {total}
      </span>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => onPage(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
        >
          ‹
        </button>
        {Array.from(new Set([0, ...Array.from({ length: 3 }, (_, i) => page - 1 + i), pages - 1]))
          .filter((i) => i >= 0 && i < pages).sort((a, b) => a - b).map((i, index, shown) => (
          <span key={i} className={styles.pageGroup}>
          {index > 0 && i - shown[index - 1] > 1 && <span aria-hidden="true">…</span>}
          <button
            type="button"
            className={`${styles.btn} ${i === page ? styles.active : ''}`}
            onClick={() => onPage(i)}
            aria-current={i === page ? 'page' : undefined}
          >
            {i + 1}
          </button>
          </span>
        ))}
        <button
          type="button"
          className={styles.btn}
          onClick={() => onPage(page + 1)}
          disabled={page === pages - 1}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
