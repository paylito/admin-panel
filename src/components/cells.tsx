import { assetColor } from '../lib/constants';
import type { Payment } from '../types';
import styles from './cells.module.css';

/** Muted em-dash used for fields hidden until a payment is completed. */
export function Dash() {
  return <span className={styles.dash}>—</span>;
}

/** Asset color dot + ticker, or a transparent dot + dash when not completed. */
export function AssetCell({ payment }: { payment: Payment }) {
  const completed = payment.status === 'completed' && !!payment.asset;
  return (
    <span className={styles.asset}>
      <span
        className={styles.dot}
        style={{ background: completed ? assetColor(payment.asset) : 'transparent' }}
      />
      {completed ? <span>{payment.asset}</span> : <Dash />}
    </span>
  );
}
