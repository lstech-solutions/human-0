import fs from 'fs';
import path from 'path';

// Helper function to get English fallback content
function getEnglishFallback(type: 'privacy' | 'terms'): string {
  const fallbackPath = fs.existsSync(path.resolve(process.cwd(), `docs/${type}.md`))
    ? path.resolve(process.cwd(), `docs/${type}.md`)
    : path.resolve(process.cwd(), `../docs/${type}.md`);
    
  return fs.readFileSync(fallbackPath, 'utf-8');
}

export async function GET(request: Request) {
  try {
    // Get locale from query params, default to 'en'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // Normalize locale (handle variants like es-CO, es-ES, etc.)
    const normalizedLocale = locale.split('-')[0]; // Get base locale (es from es-CO)
    
    // Determine file path based on locale
    let docsPath: string;
    
    if (normalizedLocale === 'en') {
      // English - use markdown files, try multiple possible locations
      const possiblePaths = [
        path.resolve(process.cwd(), 'docs/privacy.md'),
        path.resolve(process.cwd(), '../docs/privacy.md'),
        path.resolve(__dirname, '../../../docs/privacy.md'),
        path.resolve(__dirname, '../../../../docs/privacy.md')
      ];
      
      docsPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
    } else {
      // Other languages - use proper Docusaurus i18n structure
      const localizedPaths = [
        path.resolve(process.cwd(), `docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/privacy.md`),
        path.resolve(process.cwd(), `../docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/privacy.md`),
        path.resolve(__dirname, `../../../docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/privacy.md`)
      ];
      
      docsPath = localizedPaths.find(p => fs.existsSync(p));
      
      // Fallback to English if localized version doesn't exist
      if (!docsPath) {
        const fallbackPaths = [
          path.resolve(process.cwd(), 'docs/privacy.md'),
          path.resolve(process.cwd(), '../docs/privacy.md'),
          path.resolve(__dirname, '../../../docs/privacy.md')
        ];
        docsPath = fallbackPaths.find(p => fs.existsSync(p)) || fallbackPaths[0];
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
