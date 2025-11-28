/**
 * Returns the base URL for the docs site.
 * - In development: http://localhost:3001 (Docusaurus dev server)
 * - In production: /documentation (GitHub Pages subdirectory)
 */
export function getDocsBaseUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/documentation';
  }
  return '/documentation';
}

/**
 * Returns a full URL for a docs path.
 * Example: getDocsUrl('/docs/intro') → '/documentation/docs/intro' in prod
 */
export function getDocsUrl(path: string): string {
  const baseUrl = getDocsBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Returns the base URL for the main site from documentation.
 * - In development: http://localhost:8081 (Next.js dev server)
 * - In production: https://human-0.com (main site)
 */
export function getMainSiteBaseUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8081';
  }
  return 'https://human-0.com';
}

/**
 * Returns a full URL for the main site.
 * Example: getMainSiteUrl('/about') → 'http://localhost:8081/about' in dev
 */
export function getMainSiteUrl(path?: string): string {
  const baseUrl = getMainSiteBaseUrl();
  if (!path) return baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
