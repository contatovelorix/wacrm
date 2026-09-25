import { describe, expect, it } from 'vitest';
import nextConfig from '../next.config';

describe('document cache policy', () => {
  it('prevents shared caching for application pages', async () => {
    expect(nextConfig.headers).toBeTypeOf('function');
    const rules = await nextConfig.headers!();
    const documentRule = rules.find(
      (rule) => rule.source === '/:path((?!_next/static|_next/image|api).*)'
    );
    const cacheControl = documentRule?.headers.find(
      (header) => header.key.toLowerCase() === 'cache-control'
    )?.value;

    expect(cacheControl).toContain('private');
    expect(cacheControl).toContain('no-store');
    expect(cacheControl).not.toContain('public');
    expect(cacheControl).not.toContain('s-maxage');
  });

  it('keeps API responses out of caches', async () => {
    const rules = await nextConfig.headers!();
    const apiRule = rules.find((rule) => rule.source === '/api/:path*');

    expect(apiRule?.headers).toContainEqual({
      key: 'Cache-Control',
      value: 'no-store',
    });
  });
});
