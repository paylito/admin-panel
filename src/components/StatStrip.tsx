import styles from './StatStrip.module.css';

export interface Stat {
  label: string;
  value: string;
  tone?: 'green';
}

/** Row of equal-width labeled stat chips used on mobile list cards. */
export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className={styles.strip}>
      {stats.map((s) => (
        <div key={s.label} className={styles.chip}>
          <span className={styles.label}>{s.label}</span>
          <span
            className={`${styles.value} ${s.tone === 'green' ? styles.green : ''}`}
          >
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}
