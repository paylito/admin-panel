import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { PublicActivity } from '../components/PublicActivity';
import { Sparkline } from '../components/Sparkline';
import { usePublicData } from '../data/PublicDataContext';
import { assetColor } from '../lib/constants';
import { compactMoney, formatInt, formatMoney } from '../lib/format';
import styles from './Overview.module.css';
import publicStyles from './PublicOverview.module.css';

export function PublicOverviewPage() {
  const overview = usePublicData();
  const tiles = [
    { label: 'payments received', value: formatInt(overview.totalPayments) },
    { label: 'completed payments', value: formatInt(overview.completedPayments) },
    { label: 'tracked transfer legs', value: formatInt(overview.transferLegs) },
    { label: 'avg completed payment', value: formatMoney(overview.avgPaymentValue) },
    { label: 'payments today (UTC)', value: formatInt(overview.dailyPayments) },
  ];
  return <>
    <PageHeader title="overview" subtitle="public payment activity across payli" />
    <div className={styles.hero}>
      <div className={`${styles.volumeCard} ${publicStyles.volume}`}>
        <div className={styles.ring} aria-hidden="true" />
        <div className={styles.volumeBody}>
          <span className={`${styles.volumeLabel} ${publicStyles.volumeText}`}>gross transfer volume</span>
          <span className={styles.volumeValue}>{compactMoney(overview.totalVolume)}</span>
          <span className={`${styles.volumeCaption} ${publicStyles.volumeText}`}>payer funding + source execution + destination delivery</span>
        </div>
        <div className={styles.sparkWrap} role="img" aria-label="Gross transfer volume over the last 30 days">
          <Sparkline data={overview.volumeSeries.map((day) => day.volume)} height={100} />
        </div>
      </div>
      <div className={styles.sideCol}>
        <Card className={styles.sideCard} padding="20px 22px"><span className={styles.sideLabel}>completed payment volume</span><span className={styles.sideValue}>{compactMoney(overview.paymentVolume)}</span><span className={publicStyles.caption}>each completed payment counted once</span></Card>
        <Card className={styles.sideCard} padding="20px 22px"><span className={styles.sideLabel}>registered users</span><span className={styles.sideValue}>{formatInt(overview.totalUsers)}</span><span className={publicStyles.caption}>registered accounts, including waitlist accounts</span></Card>
      </div>
    </div>
    <p className={publicStyles.methodology}>A $10 payment contributes up to $30 in gross transfer volume. Each observed leg uses the payment’s reference USD value. Swaps count input and output separately, even in one transaction. Unconfirmed destination transfers don’t count.</p>
    <div className={styles.tilesRow}>{tiles.map((tile) => <Card key={tile.label} className={`${styles.tile} ${publicStyles.tile}`} padding="18px 20px" radius={18}><span className={styles.tileLabel}>{tile.label}</span><span className={styles.tileValue}>{tile.value}</span></Card>)}</div>
    <div className={styles.splitRow}>
      <Card className={styles.panel}><h2 className={styles.cardHeading}>payment methods</h2>
        <div className={styles.methodList}>{overview.paymentMethods.map((method) => <div key={method.asset} className={styles.methodRow}><div className={styles.methodTop}><span className={styles.methodSwatch} style={{ background: assetColor(method.asset) }} /><span className={styles.methodAsset}>{method.asset}</span><span className={styles.methodAmount}>{compactMoney(method.amount)}</span><span className={styles.methodPct}>{Math.round(method.pct)}%</span></div><div className={styles.track}><span className={styles.fill} style={{ width: `${Math.min(100, method.pct)}%`, background: assetColor(method.asset) }} /></div></div>)}</div>
        {!overview.paymentMethods.length && <p className={publicStyles.empty}>no payments yet</p>}
      </Card>
      <Card className={styles.panel}><h2 className={styles.cardHeading}>source networks</h2><div className={styles.topList}>{overview.networks.map((network) => <div key={network.network} className={styles.topRow}><div className={styles.topInfo}><span className={styles.topName}>{network.network}</span><span className={publicStyles.caption}>{formatInt(network.payments)} payments</span></div><span className={styles.topValue}>{compactMoney(network.volume)}</span></div>)}</div>{!overview.networks.length && <p className={publicStyles.empty}>no network activity yet</p>}</Card>
    </div>
    <Card><div className={styles.recentHead}><h2 className={styles.cardHeading}>recent transactions</h2><Link to="/payments" className={styles.viewAll}>view all</Link></div><PublicActivity payments={overview.recentPayments} />{!overview.recentPayments.length && <p className={publicStyles.empty}>no transactions yet</p>}</Card>
    <p className={publicStyles.privacy}>Names, usernames, and contact details are hidden. Transaction links open public blockchain records, where wallet addresses are visible.</p>
  </>;
}
