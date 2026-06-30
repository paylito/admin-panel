import { createContext, useContext } from 'react';
import type { AppData } from '../types';

const AppDataContext = createContext<AppData | null>(null);

export const AppDataProvider = AppDataContext;

export function useData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useData must be used within an AppDataProvider');
  return ctx;
}
