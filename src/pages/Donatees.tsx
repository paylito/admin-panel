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
import styles from './Donatees.module.css';

export function Donatees() {
  const isMobile = useIsMobile();
  const { donatees } = useData();
  const [page, setPage] = useState(0);
  const pageItems = pageSlice(donatees, page);

  return (
    <>
      <PageHeader
        title="donatees"
        subtitle="recipients collecting donations through payli"
      />

      <Card className={styles.card}>
        <div className={styles.head}>
          <h2 className={styles.cardHeading}>all donatees</h2>
          <span className={styles.count}>{donatees.length} recipients</span>
        </div>

        {donatees.length === 0 ? (
          <p className={styles.empty}>no donatees yet.</p>
        ) : isMobile ? (
          <div className={styles.mobileList}>
            {pageItems.map((d, i) => (
              <div key={d.donationUsername ?? i} className={styles.mCard}>
                <div className={styles.mHeadRow}>
                  <Avatar
                    bg={d.avatarBg}
                    initial={initialOf(d.donationUsername)}
                    size={38}
                  />
                  <div className={styles.mNameWrap}>
                    <span className={styles.mUser}>
                      {d.donationUsername ?? '—'}
                    </span>
                    <span className={styles.mTelegram}>{d.telegram ?? '—'}</span>
                  </div>
                </div>
                <StatStrip
                  stats={[
                    { label: 'DONATIONS', value: formatInt(d.donations) },
                    {
                      label: 'RAISED',
                      value: compactMoney(d.raised),
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
              <span>DONATION USER</span>
              <span className={styles.right}>DONATIONS</span>
              <span className={styles.right}>RAISED</span>
              <span>TELEGRAM</span>
            </div>
            {pageItems.map((d, i) => (
              <div
                key={d.donationUsername ?? i}
                className={`${styles.rowGrid} ${styles.bodyRow}`}
              >
                <span className={styles.userCell}>
                  <Avatar
                    bg={d.avatarBg}
                    initial={initialOf(d.donationUsername)}
                    size={32}
                  />
                  <span className={styles.user}>
                    {d.donationUsername ?? '—'}
                  </span>
                </span>
                <span className={`${styles.right} ${styles.figure}`}>
                  {formatInt(d.donations)}
                </span>
                <span className={`${styles.right} ${styles.figureGreen}`}>
                  {compactMoney(d.raised)}
                </span>
                <span className={styles.telegram}>{d.telegram ?? '—'}</span>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} total={donatees.length} onPage={setPage} />
      </Card>
    </>
  );
}
