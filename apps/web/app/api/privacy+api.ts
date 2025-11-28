import fs from 'fs';
import path from 'path';

// Map of supported locales to their directory names
const localeMap: Record<string, string> = {
  'en': 'en',
  'es': 'es',
  'de': 'de', 
  'fr': 'fr',
  'pt': 'pt',
  'zh': 'zh',
  'ar': 'ar'
};

export async function GET(request: Request) {
  try {
    // Get locale from query params, default to 'en'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // Normalize locale (handle variants like es-CO, es-ES, etc.)
    const normalizedLocale = localeMap[locale.split('-')[0]] || localeMap[locale] || 'en';
    
    // Determine file path based on locale
    let docsPath: string;
    
    if (normalizedLocale === 'en') {
      // English - check deployed location first, fallback to development
      if (fs.existsSync(path.resolve(process.cwd(), 'docs/privacy.md'))) {
        docsPath = path.resolve(process.cwd(), 'docs/privacy.md');
      } else {
        docsPath = path.resolve(process.cwd(), '../docs/privacy.md');
      }
    } else {
      // Other languages - check deployed location first, fallback to development
      const localizedPath = path.resolve(process.cwd(), `docs/i18n/${normalizedLocale}/privacy.md`);
      const devLocalizedPath = path.resolve(process.cwd(), `../docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/privacy.md`);
      
      if (fs.existsSync(localizedPath)) {
        docsPath = localizedPath;
      } else if (fs.existsSync(devLocalizedPath)) {
        docsPath = devLocalizedPath;
      } else {
        // Fallback to English if localized version doesn't exist
        if (fs.existsSync(path.resolve(process.cwd(), 'docs/privacy.md'))) {
          docsPath = path.resolve(process.cwd(), 'docs/privacy.md');
        } else {
          docsPath = path.resolve(process.cwd(), '../docs/privacy.md');
        }
      }
    }
    
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Language': normalizedLocale,
      },
    });
  } catch (error) {
    return new Response('Privacy policy not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
