const LAST_SESSION_PREFIX = 'slothmove-random-session';

export function shuffleArray<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function distinctScope(...parts: Array<string | number | null | undefined>): string {
  return parts
    .filter((part) => part !== null && part !== undefined && String(part).length > 0)
    .map((part) => String(part))
    .join(':');
}

function stableSerialize(value: unknown, seen = new WeakSet<object>()): string {
  if (value === null) return 'null';
  const valueType = typeof value;
  if (valueType === 'undefined') return 'undefined';
  if (valueType === 'number' || valueType === 'boolean' || valueType === 'bigint') {
    return String(value);
  }
  if (valueType === 'string') return JSON.stringify(value);
  if (valueType === 'function' || valueType === 'symbol') {
    return String(value);
  }
  if (value instanceof Date) return `Date(${value.toISOString()})`;
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry, seen)).join(',')}]`;
  }
  if (valueType === 'object') {
    const obj = value as Record<string, unknown>;
    if (seen.has(obj)) return '[Circular]';
    seen.add(obj);
    const keys = Object.keys(obj).sort();
    const body = keys
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(obj[key], seen)}`)
      .join(',');
    return `{${body}}`;
  }
  return String(value);
}

function readLastSignature(scope: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(`${LAST_SESSION_PREFIX}:${scope}`);
  } catch {
    return null;
  }
}

function writeLastSignature(scope: string, signature: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${LAST_SESSION_PREFIX}:${scope}`, signature);
  } catch {
    // Ignore storage errors. The shuffle still works; it just can't remember the last session.
  }
}

export function buildDistinctRandomSession<T>(
  scope: string,
  generate: () => T[],
  options?: {
    maxAttempts?: number;
    signature?: (items: T[]) => unknown;
  }
): T[] {
  const maxAttempts = Math.max(1, options?.maxAttempts ?? 6);
  const lastSignature = readLastSignature(scope);
  let fallback: T[] = [];
  let fallbackSignature = '';

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = generate();
    const signatureValue = options?.signature ? options.signature(candidate) : candidate;
    const signature = stableSerialize(signatureValue);
    fallback = candidate;
    fallbackSignature = signature;

    if (candidate.length < 2 || signature !== lastSignature || attempt === maxAttempts - 1) {
      writeLastSignature(scope, signature);
      return candidate;
    }
  }

  if (fallbackSignature) {
    writeLastSignature(scope, fallbackSignature);
  }
  return fallback;
}
