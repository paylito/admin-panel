import type { SVGProps } from 'react';

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function OverviewIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 4h6v6H4z M14 4h6v6h-6z M14 14h6v6h-6z M4 14h6v6H4z" />
    </Icon>
  );
}

export function PaymentsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M3 7h18v10H3z M3 11h18 M7 15h3" />
    </Icon>
  );
}

export function MerchantsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M6 8h12l-1 12H7L6 8z M9 8V6a3 3 0 0 1 6 0v2" />
    </Icon>
  );
}

export function DonateesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 20s-6.5-4-9-8C1.5 9 3 5.5 6.3 5.5c1.9 0 3.2 1.3 5.7 3.6 2.5-2.3 3.8-3.6 5.7-3.6 3.3 0 4.8 3.5 3.3 6.5-2.5 4-9 8-9 8z" />
    </Icon>
  );
}

export function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M15 3h6v6 M21 3l-9 9 M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5" />
    </Icon>
  );
}

export function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M16 17l5-5-5-5 M21 12H9 M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
    </Icon>
  );
}
