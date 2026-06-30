import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/context';
import styles from './Login.module.css';

export function Login() {
  const { login } = useAuth();
  const [id, setId] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await login(id.trim(), secret.trim());
      // success → AuthProvider sets the token and this screen unmounts
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setBusy(false);
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobs} aria-hidden="true">
        <span className={styles.blobCyan} />
        <span className={styles.blobPurple} />
      </div>

      <form className={styles.card} onSubmit={onSubmit}>
        <div className={styles.brand}>
          <span className={styles.logo}>p</span>
          <span className={styles.wordmark}>payli</span>
        </div>

        <h1 className={styles.title}>owner dashboard</h1>
        <p className={styles.subtitle}>sign in with your admin credentials</p>

        <label className={styles.field}>
          <span className={styles.label}>ID</span>
          <input
            className={styles.input}
            type="text"
            autoComplete="username"
            autoFocus
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="admin id"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>SECRET</span>
          <input
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="admin secret"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submit}
          disabled={busy || !id.trim() || !secret.trim()}
        >
          {busy ? 'signing in…' : 'log in'}
        </button>
      </form>
    </div>
  );
}
