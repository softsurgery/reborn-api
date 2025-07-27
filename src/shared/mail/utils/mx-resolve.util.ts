import { promises as dns } from 'dns';

// Configurable settings
interface ResolveMXOptions {
  defaultPort?: number; // Fallback port (default: 587 for submission)
  defaultHost?: string; // Fallback host pattern (default: `mail.${domain}`)
  timeoutMs?: number; // DNS query timeout (default: 5000ms)
}

// Known email providers and their SMTP configurations
const KNOWN_PROVIDERS = [
  {
    match: /(google|googlemail|gmail)\./i,
    host: 'smtp.gmail.com',
    port: 587,
  },
  {
    match: /(outlook|office365|microsoft)\./i,
    host: 'smtp.office365.com',
    port: 587,
  },
  {
    match: /(yahoo|ymail)\./i,
    host: 'smtp.mail.yahoo.com',
    port: 465,
  },
  {
    match: /(zoho)\./i,
    host: 'smtp.zoho.com',
    port: 587,
  },
  {
    match: /(secureserver\.net|godaddy)\./i,
    host: 'smtpout.secureserver.net',
    port: 465,
  },
  {
    match: /(titan\.email|hostinger)\./i,
    host: 'smtp.titan.email',
    port: 587,
  },
  {
    match: /(protonmail|pm\.me)\./i,
    host: 'mail.protonmail.com',
    port: 587,
  },
  {
    match: /(icloud|me\.com)\./i,
    host: 'smtp.mail.me.com',
    port: 587,
  },
  {
    match: /(fastmail)\./i,
    host: 'smtp.fastmail.com',
    port: 587,
  },
] as const;

export const resolveMX = async (
  domain: string,
  options: ResolveMXOptions = {},
): Promise<{ host: string; port: number }> => {
  const {
    defaultPort = 587, // Default to submission port (587)
    defaultHost = `mail.${domain}`, // Fallback host pattern
    timeoutMs = 5000, // 5s timeout
  } = options;

  // Set DNS query timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const records = await dns.resolveMx(domain);
    clearTimeout(timeout);

    if (!records.length) {
      throw new Error(`No MX records found for domain: ${domain}`);
    }

    // Sort by priority (lower = higher priority)
    const sortedRecords = [...records].sort((a, b) => a.priority - b.priority);
    const mxHost = sortedRecords[0].exchange.toLowerCase();

    // Check against known providers
    const provider = KNOWN_PROVIDERS.find((p) => p.match.test(mxHost));
    if (provider) {
      return { host: provider.host, port: provider.port };
    }

    // Fallback to mail.{domain} or custom default
    return { host: defaultHost, port: defaultPort };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`DNS query timed out after ${timeoutMs}ms`);
    }
    throw err; // Re-throw other errors
  }
};
