import { createContext, useContext } from 'react';
import type { PublicOverview } from '../types';

const PublicDataContext = createContext<PublicOverview | null>(null);
export const PublicDataProvider = PublicDataContext;
export function usePublicData() {
  const data = useContext(PublicDataContext);
  if (!data) throw new Error('Public data is unavailable');
  return data;
}
