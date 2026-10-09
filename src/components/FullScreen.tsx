import styles from './FullScreen.module.css';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.screen}>
      <div className={styles.blobs} aria-hidden="true">
        <span className={styles.blobCyan} />
        <span className={styles.blobPurple} />
      </div>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}

export function FullScreenLoader({ label = 'loading dashboard…' }: { label?: string }) {
  return (
    <Shell>
      <div className={styles.logo}>p</div>
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.loadingText}>{label}</p>
    </Shell>
  );
}

export function ErrorScreen({
  message,
  onRetry,
  onLogout,
}: {
  message: string;
  onRetry: () => void;
  onLogout?: () => void;
}) {
  return (
    <Shell>
      <div className={styles.logo}>p</div>
      <h1 className={styles.errorTitle}>couldn’t load the dashboard</h1>
      <p className={styles.errorMsg}>{message}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={onRetry}>
          try again
        </button>
        {onLogout && <button type="button" className={styles.secondary} onClick={onLogout}>
          log out
        </button>}
      </div>
    </Shell>
  );
}
