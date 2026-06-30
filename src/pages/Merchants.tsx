import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { StatStrip } from '../components/StatStrip';
import { compactMoney, formatInt, pageSlice } from '../lib/format';
import { initialOf } from '../lib/constants';
import { useIsMobile } from '../lib/useMediaQuery';
import { useData } from '../data/AppDataContext';
import styles from './Merchants.module.css';

export function Merchants() {
  const isMobile = useIsMobile();
  const { merchants } = useData();
  const [page, setPage] = useState(0);
  const pageItems = pageSlice(merchants, page);

  return (
    <>
      <PageHeader
        title="merchants"
        subtitle="businesses accepting crypto with payli"
      />

      <Card className={styles.card}>
        <div className={styles.head}>
          <h2 className={styles.cardHeading}>all merchants</h2>
          <span className={styles.count}>{merchants.length} merchants</span>
        </div>

        {merchants.length === 0 ? (
          <p className={styles.empty}>no merchants yet.</p>
        ) : isMobile ? (
          <div className={styles.mobileList}>
            {pageItems.map((m) => (
              <div key={m.id} className={styles.mCard}>
                <div className={styles.mHeadRow}>
                  <Avatar
                    bg={m.avatarBg}
                    initial={initialOf(m.name ?? m.username ?? m.id)}
                    size={38}
                  />
                  <div className={styles.mNameWrap}>
                    <span className={styles.mName}>{m.name ?? '—'}</span>
                    <span className={styles.mSub}>
                      {m.username ?? '—'} · {m.id}
                    </span>
                  </div>
                </div>
                <span className={styles.mDonates}>
                  donates as {m.donationUsername ?? '—'}
                </span>
                <StatStrip
                  stats={[
                    { label: 'PAYMENTS', value: formatInt(m.payments) },
                    { label: 'PAID OUT', value: compactMoney(m.paidOut) },
                    {
                      label: 'REVENUE',
                      value: compactMoney(m.revenue),
                      tone: 'green',
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.table}>
            <div className={`${styles.rowGrid} ${styles.headRow}`}>
              <span>NAME</span>
              <span>ID</span>
              <span>USERNAME</span>
              <span>DONATION USER</span>
              <span className={styles.right}>PAYMENTS</span>
              <span className={styles.right}>PAID OUT</span>
              <span className={styles.right}>REVENUE</span>
            </div>
            {pageItems.map((m) => (
              <div key={m.id} className={`${styles.rowGrid} ${styles.bodyRow}`}>
                <span className={styles.nameCell}>
                  <Avatar
                    bg={m.avatarBg}
                    initial={initialOf(m.name ?? m.username ?? m.id)}
                    size={34}
                  />
                  <span className={styles.name}>{m.name ?? '—'}</span>
                </span>
                <span className={styles.id}>{m.id}</span>
                <span className={styles.username}>{m.username ?? '—'}</span>
                <span className={styles.donation}>
                  {m.donationUsername ?? '—'}
                </span>
                <span className={`${styles.right} ${styles.figure}`}>
                  {formatInt(m.payments)}
                </span>
                <span className={`${styles.right} ${styles.figure}`}>
                  {compactMoney(m.paidOut)}
                </span>
                <span className={`${styles.right} ${styles.figureGreen}`}>
                  {compactMoney(m.revenue)}
                </span>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} total={merchants.length} onPage={setPage} />
      </Card>
    </>
  );
}
