'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const embedScript = document.createElement('script');
    embedScript.type = 'text/javascript';
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);

    // Add CSS to hide branding elements and make canvas more persistent
    const style = document.createElement('style');
    style.textContent = `
      [data-us-project] {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 1 !important;
        overflow: hidden !important;
        pointer-events: none !important;
      }
      
      [data-us-project] canvas {
        clip-path: inset(0 0 5% 0) !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      
      [data-us-project] * {
        pointer-events: none !important;
      }
      
      /* Aggressively remove all Unicorn Studio branding */
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] div[title*="made with"],
      [data-us-project] div[title*="UNICORN"],
      [data-us-project] div[title*="Unicorn"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"],
      [data-us-project] [class*="logo"],
      [data-us-project] [class*="signature"],
      [data-us-project] [class*="attribution"],
      [data-us-project] [data-unicorn],
      [data-us-project] [id*="unicorn"],
      [data-us-project] [id*="brand"],
      [data-us-project] [id*="logo"],
      [data-us-project] footer,
      [data-us-project] .footer,
      [data-us-project] .branding,
      [data-us-project] .made-with,
      [data-us-project] .powered-by,
      [data-us-project] .created-by,
      [data-us-project] *[style*="position: absolute"][style*="bottom"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }
      
      /* Hide any text containing branding keywords */
      [data-us-project] *:contains("Made with"),
      [data-us-project] *:contains("made with"),
      [data-us-project] *:contains("UNICORN"),
      [data-us-project] *:contains("Unicorn"),
      [data-us-project] *:contains("unicorn"),
      [data-us-project] *:contains("Studio") {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      
      /* ASCII Animation for mobile */
      .ascii-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
        overflow: hidden;
        background: radial-gradient(circle at center, #0a0a0a 0%, #000 100%);
      }
      
      .ascii-art {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Courier New', monospace;
        font-size: 8px;
        line-height: 1;
        color: #333;
        white-space: pre;
        text-align: center;
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
        50% { transform: translate(-50%, -50%) translateY(-10px); }
      }
      
      .ascii-art span {
        display: inline-block;
        animation: twinkle 3s ease-in-out infinite;
      }
      
      .ascii-art span:nth-child(even) {
        animation-delay: 0.5s;
      }
      
      .ascii-art span:nth-child(3n) {
        animation-delay: 1s;
      }
      
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Function to aggressively hide branding
    const hideBranding = () => {
      const projectDiv = document.querySelector('[data-us-project]');
      if (projectDiv) {
        // Find and remove any elements containing branding text
        const allElements = projectDiv.querySelectorAll('*');
        allElements.forEach(el => {
          const htmlEl = el as HTMLElement;
          const text = (htmlEl.textContent || '').toLowerCase();
          const title = (htmlEl.title || '').toLowerCase();
          const className = (htmlEl.className || '').toLowerCase();
          const id = (htmlEl.id || '').toLowerCase();
          
          // Remove elements with any branding indicators
          if (
            text.includes('made with') || 
            text.includes('unicorn') ||
            text.includes('studio') ||
            title.includes('made with') ||
            title.includes('unicorn') ||
            title.includes('studio') ||
            className.includes('brand') ||
            className.includes('credit') ||
            className.includes('watermark') ||
            className.includes('logo') ||
            className.includes('signature') ||
            className.includes('attribution') ||
            id.includes('brand') ||
            id.includes('logo') ||
            id.includes('unicorn') ||
            htmlEl.tagName.toLowerCase() === 'footer' ||
            (htmlEl.style && htmlEl.style.position === 'absolute' && htmlEl.style.bottom)
          ) {
            htmlEl.remove(); // Completely remove the element
          }
        });
        
        // Also look for any elements with specific attributes
        const brandedElements = projectDiv.querySelectorAll([
          '[class*="brand"]',
          '[class*="credit"]',
          '[class*="watermark"]',
          '[class*="logo"]',
          '[class*="signature"]',
          '[class*="attribution"]',
          '[id*="brand"]',
          '[id*="logo"]',
          '[id*="unicorn"]',
          '[data-unicorn]',
          'footer',
          '.made-with',
          '.powered-by',
          '.created-by'
        ].join(','));
        
        brandedElements.forEach(el => (el as HTMLElement).remove());
      }
    };

    // Run immediately and periodically
    hideBranding();
    const interval = setInterval(hideBranding, 100);
    
    // Also try after delays
    setTimeout(hideBranding, 1000);
    setTimeout(hideBranding, 3000);
    setTimeout(hideBranding, 5000);

    return () => {
      clearInterval(interval);
      document.head.removeChild(embedScript);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Vitruvian man animation - fixed position for desktop */}
      <div className="fixed inset-0 w-full h-full hidden lg:block">
        <div 
          data-us-project="whwOGlfJ5Rz2rHaEUgHl" 
          style={{ width: '100vw', height: '100vh' }}
        />
      </div>

      {/* ASCII Animation for mobile */}
      <div className="fixed inset-0 w-full h-full lg:hidden ascii-container">
        <div className="ascii-art">
          <pre style={{ margin: 0, padding: 0 }}>
            <span>    </span><span>╔════════════════════════╗</span><span>    </span>
            <span>    </span><span>║      ◯      ◯      ║</span><span>    </span>
            <span>    </span><span>║        ╲╱        ║</span><span>    </span>
            <span>    </span><span>║         │         ║</span><span>    </span>
            <span>    </span><span>║        ╱╲        ║</span><span>    </span>
            <span>    </span><span>║      ◯      ◯      ║</span><span>    </span>
            <span>    </span><span>║        ││        ║</span><span>    </span>
            <span>    </span><span>║      ╱╲╱╲      ║</span><span>    </span>
            <span>    </span><span>║     ╱      ╲     ║</span><span>    </span>
            <span>    </span><span>║    ╱        ╲    ║</span><span>    </span>
            <span>    </span><span>║   ╱          ╲   ║</span><span>    </span>
            <span>    </span><span>║  ╱            ╲  ║</span><span>    </span>
            <span>    </span><span>║ ╱              ╲ ║</span><span>    </span>
            <span>    </span><span>╚════════════════════════╝</span><span>    </span>
          </pre>
        </div>
      </div>

      {/* Mobile stars background - removed since ASCII covers it */}

      {/* Corner Frame Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-white/30 z-20"></div>
      <div className="absolute top-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-white/30 z-20"></div>
      <div className="absolute left-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-white/30 z-20" style={{ bottom: '5vh' }}></div>
      <div className="absolute right-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-white/30 z-20" style={{ bottom: '5vh' }}></div>

      <div className="relative z-10 flex min-h-screen items-center pt-16 lg:pt-0" style={{ marginTop: '5vh' }}>
        <div className="container mx-auto px-6 lg:px-16 lg:ml-[10%]">
          <div className="max-w-lg relative">
            {/* Top decorative line */}
            <div className="flex items-center gap-2 mb-3 opacity-60">
              <div className="w-8 h-px bg-white"></div>
              <span className="text-white text-[10px] font-mono tracking-wider">001</span>
              <div className="flex-1 h-px bg-white"></div>
            </div>

            {/* Title with dithered accent */}
            <div className="relative">
              <div className="hidden lg:block absolute -left-3 top-0 bottom-0 w-1 dither-pattern opacity-40"></div>
              <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 lg:mb-4 leading-tight font-mono tracking-wider" style={{ letterSpacing: '0.1em' }}>
                SUSTAINABLE
                <span className="block text-white mt-1 lg:mt-2 opacity-90">
                  BLOCKCHAIN
                </span>
              </h1>
            </div>

            {/* Decorative dots pattern - desktop only */}
            <div className="hidden lg:flex gap-1 mb-3 opacity-40">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-white rounded-full"></div>
              ))}
            </div>

            {/* Description with subtle grid pattern */}
            <div className="relative">
              <p className="text-xs lg:text-base text-gray-300 mb-5 lg:mb-6 leading-relaxed font-mono opacity-80">
                Where environmental impact meets digital transparency — Carbon neutrality through Web3 innovation
              </p>
              
              {/* Technical corner accent - desktop only */}
              <div className="hidden lg:block absolute -right-4 top-1/2 w-3 h-3 border border-white opacity-30" style={{ transform: 'translateY(-50%)' }}>
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white" style={{ transform: 'translate(-50%, -50%)' }}></div>
              </div>
            </div>

            {/* Buttons with technical accents */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              <button 
                onClick={() => window.location.href = '/canvas'}
                className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent text-white font-mono text-xs lg:text-sm border border-white hover:bg-white hover:text-black transition-all duration-200 group"
              >
                <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                EXPLORE CANVAS
              </button>
              
              <button 
                onClick={() => window.location.href = '/pdf-download'}
                className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent border border-white text-white font-mono text-xs lg:text-sm hover:bg-white hover:text-black transition-all duration-200" 
                style={{ borderWidth: '1px' }}
              >
                DOWNLOAD PDF
              </button>
            </div>

            {/* Bottom technical notation - desktop only */}
            <div className="hidden lg:flex items-center gap-2 mt-6 opacity-40">
              <span className="text-white text-[9px] font-mono">∞</span>
              <div className="flex-1 h-px bg-white"></div>
              <span className="text-white text-[9px] font-mono">WEB3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="absolute left-0 right-0 z-20 border-t border-white/20 bg-black/40 backdrop-blur-sm" style={{ bottom: '5vh' }}>
        <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-6 text-[8px] lg:text-[9px] font-mono text-white/50">
            <span className="hidden lg:inline">SYSTEM.ACTIVE</span>
            <span className="lg:hidden">SYS.ACT</span>
            <div className="hidden lg:flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-1 h-3 bg-white/30" style={{ height: `${Math.random() * 12 + 4}px` }}></div>
              ))}
            </div>
            <span>V1.0.0</span>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4 text-[8px] lg:text-[9px] font-mono text-white/50">
            <span className="hidden lg:inline">◐ RENDERING</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="hidden lg:inline">FRAME: ∞</span>
          </div>
        </div>
      </div>

      <style>{`
        .dither-pattern {
          background-image: 
            repeating-linear-gradient(0deg, transparent 0px, transparent 1px, white 1px, white 2px),
            repeating-linear-gradient(90deg, transparent 0px, transparent 1px, white 1px, white 2px);
          background-size: 3px 3px;
        }
      `}</style>
    </main>
  );
}
