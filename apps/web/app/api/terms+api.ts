import fs from 'fs';
import path from 'path';

// Helper function to get English fallback content
function getEnglishFallback(type: 'privacy' | 'terms'): string {
  const fallbackPath = fs.existsSync(path.resolve(process.cwd(), `${type}.md`))
    ? path.resolve(process.cwd(), `${type}.md`)  // Production: files copied to root
    : path.resolve(process.cwd(), `docs/${type}.md`);  // Development
    
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
      // English - files are copied to root in production, check multiple possible locations
      if (fs.existsSync(path.resolve(process.cwd(), 'terms.md'))) {
        docsPath = path.resolve(process.cwd(), 'terms.md');  // Production: files copied to root
      } else if (fs.existsSync(path.resolve(process.cwd(), 'docs/terms.md'))) {
        docsPath = path.resolve(process.cwd(), 'docs/terms.md');  // Development
      } else {
        docsPath = path.resolve(process.cwd(), '../docs/terms.md');  // Alternative dev
      }
    } else {
      // Other languages - use proper Docusaurus i18n structure
      const localizedPath = path.resolve(process.cwd(), `docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/terms.md`);  // Production
      const devLocalizedPath = path.resolve(process.cwd(), `../docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/terms.md`);  // Dev
      
      if (fs.existsSync(localizedPath)) {
        docsPath = localizedPath;
      } else if (fs.existsSync(devLocalizedPath)) {
        docsPath = devLocalizedPath;
      } else {
        // Fallback to English if localized version doesn't exist
        if (fs.existsSync(path.resolve(process.cwd(), 'terms.md'))) {
          docsPath = path.resolve(process.cwd(), 'terms.md');  // Production: files copied to root
        } else if (fs.existsSync(path.resolve(process.cwd(), 'docs/terms.md'))) {
          docsPath = path.resolve(process.cwd(), 'docs/terms.md');  // Development
        } else {
          docsPath = path.resolve(process.cwd(), '../docs/terms.md');  // Alternative dev
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
    return new Response('Terms of service not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
