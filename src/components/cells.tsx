import { useState } from 'react';
import type { ReactNode } from 'react';
import { assetColor, explorerTxUrl } from '../lib/constants';
import { truncateMiddle } from '../lib/format';
import { copyText } from '../lib/clipboard';
import { ExternalLinkIcon } from './icons';
import type { Payment } from '../types';
import styles from './cells.module.css';

/** Muted em-dash used for fields hidden until a payment is completed. */
export function Dash() {
  return <span className={styles.dash}>—</span>;
}

/**
 * Click-to-copy wrapper: renders `children` (or `value`) as a button that copies
 * `value` to the clipboard and briefly flashes green to confirm. `className`
 * styles the value itself; the button stays a neutral, inheriting element.
 */
export function Copyable({
  value,
  children,
  className,
}: {
  value: string;
  children?: ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (await copyText(value)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1100);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={copied ? 'copied!' : 'click to copy'}
      aria-label={`copy ${value}`}
      className={`${styles.copyable} ${copied ? styles.copied : ''} ${className ?? ''}`}
    >
      {children ?? value}
    </button>
  );
}

/** Asset color dot + copyable ticker, or a transparent dot + dash when not completed. */
export function AssetCell({ payment }: { payment: Payment }) {
  const completed = payment.status === 'completed' && !!payment.asset;
  return (
    <span className={styles.asset}>
      <span
        className={styles.dot}
        style={{ background: completed ? assetColor(payment.asset) : 'transparent' }}
      />
      {completed ? <Copyable value={payment.asset!}>{payment.asset}</Copyable> : <Dash />}
    </span>
  );
}

/**
 * Payout tx: a shortened, copyable hash plus an explorer link when the network
 * has a known block explorer. Renders a dash until the payment is completed.
 */
export function TxCell({ payment }: { payment: Payment }) {
  const { payoutTx, network, status } = payment;
  if (status !== 'completed' || !payoutTx) return <Dash />;

  const url = explorerTxUrl(network, payoutTx);
  return (
    <span className={styles.txWrap}>
      <Copyable value={payoutTx} className={styles.tx}>
        {truncateMiddle(payoutTx)}
      </Copyable>
      {url && (
        <a
          className={styles.txLink}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="view on explorer"
          aria-label="view transaction on block explorer"
        >
          <ExternalLinkIcon className={styles.txLinkIcon} />
        </a>
      )}
    </span>
  );
}
