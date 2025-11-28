// Client-side module for handling language and theme switching
export function handleLanguageChange(locale: string) {
  // Store preference
  localStorage.setItem('docusaurus-locale', locale);
  
  // Get current dark mode setting
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  
  // Redirect to main site with both locale and dark mode parameters
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8081' 
    : 'https://human-0.com';
  
  const currentPath = window.location.pathname;
  
  // If we're on privacy or terms pages, redirect to main site equivalents
  if (currentPath.includes('/privacy') || currentPath.includes('/terms')) {
    window.location.href = `${baseUrl}${currentPath.replace('/documentation', '')}?locale=${locale}&dark=${currentTheme === 'dark'}`;
  } else {
    // For other pages, redirect to main site home with language and theme
    window.location.href = `${baseUrl}?locale=${locale}&dark=${currentTheme === 'dark'}`;
  }
}

// Initialize theme and locale from URL parameters
export function initializeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Handle locale
  const urlLocale = urlParams.get('locale');
  const savedLocale = localStorage.getItem('docusaurus-locale');
  const detectedLocale = urlLocale || savedLocale || 'en';
  
  if (urlLocale) {
    localStorage.setItem('docusaurus-locale', urlLocale);
  }
  
  // Handle dark mode
  const urlTheme = urlParams.get('dark');
  const savedTheme = localStorage.getItem('theme');
  
  let finalTheme = savedTheme;
  
  if (urlTheme !== null) {
    finalTheme = urlTheme === 'true' ? 'dark' : 'light';
  } else if (!savedTheme) {
    // Use system preference as fallback
    finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply theme
  document.documentElement.setAttribute('data-theme', finalTheme);
  localStorage.setItem('theme', finalTheme);
}

// Make functions available globally
if (typeof window !== 'undefined') {
  (window as any).handleLanguageChange = handleLanguageChange;
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', initializeFromURL);
}
