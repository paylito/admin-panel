import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Sparkline } from '../components/Sparkline';
import { StatusPill } from '../components/StatusPill';
import { AssetCell, Dash } from '../components/cells';
import { assetColor, initialOf } from '../lib/constants';
import {
  assetNetworkLabel,
  compactMoney,
  formatInt,
  formatMoney,
  formatPct,
} from '../lib/format';
import { useIsMobile } from '../lib/useMediaQuery';
import { useData } from '../data/AppDataContext';
import styles from './Overview.module.css';

function Empty({ text }: { text: string }) {
  return <p className={styles.cardEmpty}>{text}</p>;
}

export function Overview() {
  const isMobile = useIsMobile();
  const { overview } = useData();
  const [showSecondary, setShowSecondary] = useState(true);

  const tiles = [
    { label: 'daily payments', value: formatInt(overview.dailyPayments) },
    { label: 'avg transaction value', value: formatMoney(overview.avgTransactionValue) },
    { label: 'success rate', value: formatPct(overview.successRate) },
    { label: 'total merchants', value: formatInt(overview.totalMerchants) },
    { label: 'new signups today', value: formatInt(overview.newSignupsToday) },
  ];
  const shownTiles = showSecondary ? tiles : tiles.slice(0, 2);

  const hasChart = !!overview.volumeSeries?.length;
  const recent = overview.recentPayments.slice(0, 7);

  return (
    <>
      <PageHeader
        title="overview"
        subtitle="a complete view of everything happening across payli"
      />

      {/* ── hero bento ── */}
      <div className={styles.hero}>
        <div
          className={`${styles.volumeCard} ${hasChart ? '' : styles.volumeCentered}`}
        >
          <div className={styles.ring} aria-hidden="true" />
          <div className={styles.volumeBody}>
            <span className={styles.volumeLabel}>total volume processed</span>
            <div className={styles.volumeValueRow}>
              <span className={styles.volumeValue}>
                {compactMoney(overview.totalVolume)}
              </span>
              {overview.volumeDelta && (
                <span className={styles.volumePill}>▲ {overview.volumeDelta}</span>
              )}
            </div>
            <span className={styles.volumeCaption}>
              settled to merchant wallets via li.fi
            </span>
          </div>
          {hasChart && (
            <div className={styles.sparkWrap}>
              <Sparkline
                data={overview.volumeSeries!}
                height={isMobile ? 120 : 132}
              />
            </div>
          )}
        </div>

        <div className={styles.sideCol}>
          <Card className={styles.sideCard} padding="20px 22px">
            <div className={styles.sideTop}>
              <span className={styles.swatch} style={{ background: '#50AF95' }} />
              <span className={styles.sideLabel}>revenue / fees earned</span>
            </div>
            <span className={styles.sideValue}>
              {compactMoney(overview.revenue)}
            </span>
          </Card>

          <Card className={styles.sideCard} padding="20px 22px">
            <div className={styles.sideTop}>
              <span className={styles.swatch} style={{ background: '#F59E0B' }} />
              <span className={styles.sideLabel}>pending payouts</span>
            </div>
            <span className={styles.sideValue}>
              {compactMoney(overview.pendingPayouts.amount)}
            </span>
            <span className={`${styles.deltaPill} ${styles.amber}`}>
              {formatInt(overview.pendingPayouts.queued)} queued
            </span>
          </Card>
        </div>
      </div>

      {/* ── metric tiles ── */}
      <div className={styles.tilesSection}>
        <div className={styles.tilesHead}>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowSecondary((v) => !v)}
          >
            {showSecondary ? 'show fewer metrics' : 'show all metrics'}
          </button>
        </div>
        <div className={styles.tilesRow}>
          {shownTiles.map((t) => (
            <Card
              key={t.label}
              className={styles.tile}
              padding="18px 20px"
              radius={18}
            >
              <span className={styles.tileLabel}>{t.label}</span>
              <span className={styles.tileValue}>{t.value}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* ── methods + top merchants ── */}
      <div className={styles.splitRow}>
        <Card className={styles.panel}>
          <h2 className={styles.cardHeading}>payment methods</h2>
          {overview.paymentMethods.length === 0 ? (
            <Empty text="no payment activity yet" />
          ) : (
            <div className={styles.methodList}>
              {overview.paymentMethods.map((m) => (
                <div key={m.asset} className={styles.methodRow}>
                  <div className={styles.methodTop}>
                    <span
                      className={styles.methodSwatch}
                      style={{ background: assetColor(m.asset) }}
                    />
                    <span className={styles.methodAsset}>{m.asset}</span>
                    <span className={styles.methodAmount}>
                      {compactMoney(m.amount)}
                    </span>
                    <span className={styles.methodPct}>{Math.round(m.pct)}%</span>
                  </div>
                  <div className={styles.track}>
                    <span
                      className={styles.fill}
                      style={{
                        width: `${Math.min(100, m.pct)}%`,
                        background: assetColor(m.asset),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className={styles.panel}>
          <h2 className={styles.cardHeading}>top merchants</h2>
          {overview.topMerchants.length === 0 ? (
            <Empty text="no merchants yet" />
          ) : (
            <div className={styles.topList}>
              {overview.topMerchants.map((m, i) => (
                <div key={m.merchantId ?? i} className={styles.topRow}>
                  <span className={styles.rank}>{i + 1}</span>
                  <Avatar
                    bg={m.avatarBg}
                    initial={initialOf(m.handle ?? m.name)}
                    size={36}
                  />
                  <div className={styles.topInfo}>
                    <span className={styles.topName}>
                      {m.handle ?? m.name ?? m.merchantId ?? '—'}
                    </span>
                    <span className={styles.topSub}>
                      {formatInt(m.payments)} payments
                    </span>
                  </div>
                  <span className={styles.topValue}>
                    {compactMoney(m.paidOut)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── recent payments ── */}
      <Card className={styles.recentCard}>
        <div className={styles.recentHead}>
          <h2 className={styles.cardHeading}>recent payments</h2>
          <Link to="/payments" className={styles.viewAll}>
            view all
          </Link>
        </div>

        {recent.length === 0 ? (
          <Empty text="no payments yet" />
        ) : isMobile ? (
          <div className={styles.mobileList}>
            {recent.map((p) => (
              <div key={p.id} className={styles.mCard}>
                <div className={styles.mTop}>
                  <span className={styles.mId}>{p.id}</span>
                  <StatusPill status={p.status} />
                </div>
                <span className={styles.mMerchant}>
                  {p.merchantHandle ?? p.merchantId ?? '—'}
                </span>
                <div className={styles.mBottom}>
                  <span className={styles.mAmount}>{p.usd}</span>
                  <span className={styles.mMeta}>{assetNetworkLabel(p)}</span>
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
              <span className={styles.right}>STATUS</span>
            </div>
            {recent.map((p) => (
              <div key={p.id} className={`${styles.rowGrid} ${styles.bodyRow}`}>
                <span className={styles.cId}>{p.id}</span>
                <span className={styles.cMerchant}>
                  {p.merchantHandle ?? p.merchantId ?? '—'}
                </span>
                <span className={styles.cAsset}>
                  <AssetCell payment={p} />
                </span>
                <span className={styles.cNetwork}>
                  {p.status === 'completed' && p.network ? p.network : <Dash />}
                </span>
                <span className={`${styles.cAmount} ${styles.right}`}>
                  {p.usd}
                </span>
                <span className={`${styles.right} ${styles.cStatus}`}>
                  <StatusPill status={p.status} />
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
