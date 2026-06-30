import { NavLink, Outlet } from 'react-router-dom';
import {
  DonateesIcon,
  LogoutIcon,
  MerchantsIcon,
  OverviewIcon,
  PaymentsIcon,
} from './icons';
import type { SVGProps } from 'react';
import { useAuth } from '../auth/context';
import styles from './Layout.module.css';

interface NavItem {
  to: string;
  label: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'overview', Icon: OverviewIcon, end: true },
  { to: '/payments', label: 'payments', Icon: PaymentsIcon },
  { to: '/merchants', label: 'merchants', Icon: MerchantsIcon },
  { to: '/donatees', label: 'donatees', Icon: DonateesIcon },
];

function TopNav() {
  const { logout } = useAuth();
  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <div className={styles.brand}>
          <span className={styles.logo}>p</span>
          <span className={styles.wordmark}>payli</span>
        </div>
        <ul className={styles.navItems}>
          {NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={styles.logout}
          onClick={logout}
          title="Log out"
        >
          <LogoutIcon className={styles.navIcon} />
          <span className={styles.navLabel}>log out</span>
        </button>
      </div>
    </nav>
  );
}

export function Layout() {
  return (
    <div className={styles.app}>
      <div className={styles.blobs} aria-hidden="true">
        <span className={styles.blobCyan} />
        <span className={styles.blobPurple} />
      </div>
      <TopNav />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
