export function buildStaticUrl(
  host: string | null,
  port: number | null,
  secure = false,
): string {
  if (!host) {
    return '';
  }
  const protocol = secure ? 'https' : 'http';
  if (!port || port === 80) {
    return `${protocol}://${host}`;
  }

  return `${protocol}://${host}:${port}`;
}
