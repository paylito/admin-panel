import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { useAuth } from './auth/context';
import { AppDataProvider } from './data/AppDataContext';
import { ApiError, getPublicOverview, loadAll } from './api/client';
import { ErrorScreen, FullScreenLoader } from './components/FullScreen';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { Payments } from './pages/Payments';
import { Merchants } from './pages/Merchants';
import { Donatees } from './pages/Donatees';
import { PublicDataProvider } from './data/PublicDataContext';
import { PublicOverviewPage } from './pages/PublicOverview';
import { PublicPaymentsPage } from './pages/PublicPayments';
import type { AppData, PublicOverview } from './types';

function Dashboard() {
  const { token, logout } = useAuth();
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setData(null);
    setError(null);

    loadAll(token)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // A stored token that no longer works → drop it and show login.
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          logout();
          return;
        }
        setError(err instanceof Error ? err.message : 'Something went wrong');
      });

    return () => {
      cancelled = true;
    };
  }, [token, reloadKey, logout]);

  if (error) {
    return (
      <ErrorScreen
        message={error}
        onRetry={() => setReloadKey((k) => k + 1)}
        onLogout={logout}
      />
    );
  }

  if (!data) return <FullScreenLoader />;

  return (
    <AppDataProvider value={data}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/merchants" element={<Merchants />} />
            <Route path="/donatees" element={<Donatees />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
    </AppDataProvider>
  );
}

function PublicDashboard() {
  const [overview, setOverview] = useState<PublicOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    getPublicOverview(controller.signal).then((data) => {
      if (!controller.signal.aborted) setOverview(data);
    }).catch((err: unknown) => {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Could not load public activity');
    });
    return () => controller.abort();
  }, [reload]);
  if (error) return <ErrorScreen message={error} onRetry={() => setReload((value) => value + 1)} />;
  if (!overview) return <FullScreenLoader label="loading public activity…" />;
  return <PublicDataProvider value={overview}><Routes>
    <Route element={<Layout publicView />}>
      <Route path="/" element={<PublicOverviewPage />} />
      <Route path="/payments" element={<PublicPaymentsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes></PublicDataProvider>;
}

function Gate() {
  const { token } = useAuth();
  if (!token) return <Routes><Route path="/login" element={<Login />} /><Route path="*" element={<PublicDashboard />} /></Routes>;
  // Remount the loader whenever the token changes (login / re-login).
  return <Dashboard key={token} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter><Gate /></BrowserRouter>
    </AuthProvider>
  );
}
