import type { CSSProperties, ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  radius?: number;
  style?: CSSProperties;
}

/** White surface: bg + border + soft shadow. Padding/radius overridable. */
export function Card({
  children,
  className = '',
  padding = '22px',
  radius = 20,
  style,
}: CardProps) {
  return (
    <section
      className={`${styles.card} ${className}`}
      style={{ padding, borderRadius: radius, ...style }}
    >
      {children}
    </section>
  );
}
