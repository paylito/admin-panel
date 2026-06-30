import styles from './Avatar.module.css';

interface AvatarProps {
  bg: string;
  initial: string;
  size?: number;
}

/** Colored rounded square with a single white initial (Gabarito 800). */
export function Avatar({ bg, initial, size = 36 }: AvatarProps) {
  return (
    <span
      className={styles.avatar}
      style={{
        background: bg,
        width: size,
        height: size,
        borderRadius: Math.max(8, Math.round(size * 0.28)),
        fontSize: Math.round(size * 0.4),
      }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
