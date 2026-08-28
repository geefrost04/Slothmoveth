'use client';

import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics';

type TrackedLinkProps = PropsWithChildren<LinkProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | 'onClick'> & {
    eventName: string;
    parameters?: Parameters<typeof trackAnalyticsEvent>[1];
  };

export function TrackedLink({ eventName, parameters, onClick, children, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackAnalyticsEvent(eventName, parameters);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
