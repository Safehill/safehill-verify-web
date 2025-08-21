import type { AuthenticatedUser } from '@/lib/api/models/AuthenticatedUser';
import { type ClassValue, clsx } from 'clsx';
import ms from 'ms';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (timestamp: string | Date, timeOnly?: boolean): string => {
  if (!timestamp) {
    return 'never';
  }

  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

  if (isNaN(date.getTime())) {
    return 'invalid date';
  }

  return `${ms(Date.now() - date.getTime())}${
    timeOnly ? '' : ' ago'
  }`;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error('An unexpected error occurred');
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) {
    return '0';
  }
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, '$1') + item.symbol
    : '0';
}

export function capitalize(str: string) {
  'string'.toUpperCase();
  if (!str || typeof str !== 'string') {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) {
    return str;
  }
  return `${str.slice(0, length)}...`;
};

export const formattedDate = (date: Date, includeHour: boolean = false) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: includeHour ? 'numeric' : undefined,
    minute: includeHour ? 'numeric' : undefined,
  });
};

// Convert AuthedSession to AuthenticatedUser format
export const convertToAuthenticatedUser = (authedSession: any): AuthenticatedUser | null => {
  if (!authedSession) {
    return null;
  }

  return {
    authToken: authedSession.bearerToken,
    privateKey: authedSession.privateKey,
    privateSignature: authedSession.signature,
    user: authedSession.user,
  };
};
