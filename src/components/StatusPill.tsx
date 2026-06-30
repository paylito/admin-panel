import type { Status } from '../types';
import styles from './StatusPill.module.css';

export function StatusPill({ status }: { status: Status }) {
  return <span className={`${styles.pill} ${styles[status]}`}>{status}</span>;
}
