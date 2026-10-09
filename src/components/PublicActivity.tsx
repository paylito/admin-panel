import { Copyable } from './cells';
import { ExternalLinkIcon } from './icons';
import { StatusPill } from './StatusPill';
import { formatMoney, truncateMiddle } from '../lib/format';
import type { PublicPayment, PublicTransaction } from '../types';
import styles from './PublicActivity.module.css';

function Transaction({ transaction }: { transaction: PublicTransaction }) {
  return <span className={styles.hash}>
    <Copyable value={transaction.hash}>{truncateMiddle(transaction.hash, 8, 6)}</Copyable>
    {transaction.explorerUrl && <a href={transaction.explorerUrl} target="_blank" rel="noopener noreferrer" aria-label="View transaction on block explorer">
      <ExternalLinkIcon className={styles.linkIcon} />
    </a>}
  </span>;
}

export function PublicActivity({ payments }: { payments: PublicPayment[] }) {
  return <div className={styles.list}>
    {payments.map((payment) => <details key={payment.id} className={styles.payment}>
      <summary className={styles.summary}>
        <span className={styles.identity}><span className={styles.route}>{payment.source.network} → {payment.destination.network}</span><span className={styles.meta}>{payment.dateISO} · {payment.source.asset} → {payment.destination.asset}</span></span>
        <span className={styles.amount}><strong>{formatMoney(payment.amountUsd)}</strong><span className={styles.meta}>{formatMoney(payment.volumeUsd)} gross volume</span></span>
        <StatusPill status={payment.status} />
        <span className={styles.expand}>view trace</span>
      </summary>
      <div className={styles.trace}>
        <div className={styles.leg}><h3>payer funding</h3><p>{payment.source.network} · {payment.source.amount} {payment.source.asset}</p>
          {payment.payerTransactions.length ? payment.payerTransactions.map((tx) => <Transaction key={tx.hash} transaction={tx} />) : <span className={styles.missing}>deposit observed; hash unavailable</span>}
        </div>
        <div className={styles.leg}><h3>source execution</h3><p>{payment.source.network}</p>
          {payment.sourceTransaction ? <Transaction transaction={payment.sourceTransaction} /> : <span className={styles.missing}>awaiting source transaction</span>}
        </div>
        <div className={styles.leg}><h3>destination delivery</h3><p>{payment.destination.network} · {payment.destination.asset}</p>
          {payment.destinationTransaction ? <Transaction transaction={payment.destinationTransaction} /> : <span className={styles.missing}>{payment.status === 'completed' ? 'delivery confirmed; hash unavailable' : payment.status === 'failed' ? 'delivery not confirmed' : 'awaiting destination transaction'}</span>}
        </div>
      </div>
    </details>)}
  </div>;
}
