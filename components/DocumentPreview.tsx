
import React from 'react';
import { EditorialDocument, LayoutSettings } from '../types';

interface DocumentPreviewProps {
  doc: EditorialDocument;
  settings: LayoutSettings;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ doc, settings: rawSettings }) => {
  // Check background lightness for border contrast
  const isDarkColor = (color: string) => {
    if (!color) return false;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq < 128;
  };

  const getLuminance = (colorStr: string, underlyingColor?: string) => {
    if (!colorStr) return 0;
    
    let r, g, b;

    if (colorStr.startsWith('rgba')) {
      const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const ar = parseInt(match[1]);
        const ag = parseInt(match[2]);
        const ab = parseInt(match[3]);
        const alpha = match[4] ? parseFloat(match[4]) : 1;
        
        if (alpha < 1 && underlyingColor) {
          // Blend with underlying color
          const bgHex = underlyingColor.replace('#', '');
          const br = parseInt(bgHex.substr(0, 2), 16) || 0;
          const bg = parseInt(bgHex.substr(2, 2), 16) || 0;
          const bb = parseInt(bgHex.substr(4, 2), 16) || 0;
          
          r = (ar * alpha + br * (1 - alpha)) / 255;
          g = (ag * alpha + bg * (1 - alpha)) / 255;
          b = (ab * alpha + bb * (1 - alpha)) / 255;
        } else {
          r = ar / 255; g = ag / 255; b = ab / 255;
        }
      } else {
        return 0;
      }
    } else {
      let hex = colorStr.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      r = (parseInt(hex.substr(0, 2), 16) || 0) / 255;
      g = (parseInt(hex.substr(2, 2), 16) || 0) / 255;
      b = (parseInt(hex.substr(4, 2), 16) || 0) / 255;
    }

    const [rr, gg, bb] = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
  };

  const getSafeColor = (bgHex: string, textHex: string, underlyingDocBg?: string) => {
    const bgLum = underlyingDocBg ? getLuminance(bgHex, underlyingDocBg) : getLuminance(bgHex);
    const textLum = getLuminance(textHex);
    const lighter = Math.max(bgLum, textLum);
    const darker = Math.min(bgLum, textLum);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    if (ratio < 4.5) return bgLum > 0.5 ? '#1a1a1a' : '#fcfcfc';
    return textHex;
  };

  const settings = {
    ...rawSettings,
    colorText: getSafeColor(rawSettings.colorBackground, rawSettings.colorText),
    colorTitle: getSafeColor(rawSettings.colorBackground, rawSettings.colorTitle),
    colorCardText: getSafeColor(rawSettings.colorCard, rawSettings.colorCardText, rawSettings.colorBackground),
    colorCardAccent: getSafeColor(rawSettings.colorCard, rawSettings.colorCardAccent, rawSettings.colorBackground),
  };
  
  const isBgDark = isDarkColor(settings.colorBackground);
  // Bordas mais expressivas para garantir delineamento das formas mesmo se fundo e card forem iguais
  const cardBorderColor = isDarkColor(settings.colorCard) ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)';
  const docBorderColor = isBgDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

  const densityClasses = {
    compact: 'py-8 space-y-16',
    elegant: 'py-16 space-y-24',
    spacious: 'py-24 space-y-40'
  };

  const familyClasses = {
    playfair: 'serif',
    syne: 'syne',
    inter: 'font-sans',
    montserrat: 'montserrat',
    caveat: "font-['Caveat']",
    cormorant: "font-['Cormorant_Garamond']",
    jetbrains: "font-['JetBrains_Mono']"
  };

  const styleSettings = {
    classic: {
      heading: `${familyClasses[settings.fontTitle] || 'serif'} font-bold uppercase tracking-tight`,
      border: `border-l-4 pl-12`,
      decoration: true,
      cardPadding: 'p-8'
    },
    modern: {
      heading: `${familyClasses[settings.fontTitle] || 'syne'} font-bold uppercase tracking-tighter scale-y-105`,
      border: `border-t-4 pt-12`,
      decoration: true,
      cardPadding: 'p-10'
    },
    minimal: {
      heading: `${familyClasses[settings.fontTitle] || 'font-sans'} font-light uppercase tracking-[0.4em]`,
      border: `pl-6 border-l`,
      decoration: false,
      cardPadding: 'p-6'
    }
  };

  const currentStyle = styleSettings[settings.fontStyle];

  const getBackgroundPattern = () => {
    const bgColor = settings.colorBackground.replace('#', '%23');
    const shapeColor = isBgDark ? '%23ffffff' : '%23000000';
    const opacity = isBgDark ? '0.04' : '0.03';
    
    switch (settings.backgroundPattern) {
      case 'morangos':
      case 'linhas':
        return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='${shapeColor}' fill-opacity='${opacity}' fill-rule='evenodd'/%3E%3C/svg%3E")`;
      case 'nuvens':
      case 'ondas':
        return `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.392-5.33 4.254-9.236 9.58-9.95C36.032 9.33 39.992 5.1 40 0v20zM0 0v20h21.184c-.392-5.33-4.254-9.236-9.58-9.95C6.336 9.33 2.376 5.1 2 0z' fill='${shapeColor}' fill-opacity='${opacity}' fill-rule='evenodd'/%3E%3C/svg%3E")`;
      case 'pontinhos':
        return `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='${shapeColor}' fill-opacity='${opacity}'/%3E%3C/svg%3E")`;
      case 'grid':
        return `url("data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 30 0 L 0 0 0 30' fill='none' stroke='${shapeColor}' stroke-width='0.5' stroke-opacity='${opacity}'/%3E%3C/svg%3E")`;
      default:
        return 'none';
    }
  };

  const globalScale = (settings.baseFontSize || 16) / 16;

  return (
    <>
    <style>{`
      #editorial-doc {
        --doc-scale: ${globalScale};
      }
      #editorial-doc .text-xs { font-size: calc(0.75rem * var(--doc-scale)); leading: calc(1rem * var(--doc-scale)); }
      #editorial-doc .text-sm { font-size: calc(0.875rem * var(--doc-scale)); leading: calc(1.25rem * var(--doc-scale)); }
      #editorial-doc .text-base, #editorial-doc p { font-size: calc(1rem * var(--doc-scale)); leading: calc(1.5rem * var(--doc-scale)); }
      #editorial-doc .text-lg { font-size: calc(1.125rem * var(--doc-scale)); leading: calc(1.75rem * var(--doc-scale)); }
      #editorial-doc .text-xl { font-size: calc(1.25rem * var(--doc-scale)); leading: calc(1.75rem * var(--doc-scale)); }
      #editorial-doc .text-2xl { font-size: calc(1.5rem * var(--doc-scale)); leading: calc(2rem * var(--doc-scale)); }
      #editorial-doc .text-3xl { font-size: calc(1.875rem * var(--doc-scale)); leading: calc(2.25rem * var(--doc-scale)); }
      #editorial-doc .text-4xl { font-size: calc(2.25rem * var(--doc-scale)); leading: calc(2.5rem * var(--doc-scale)); }
      #editorial-doc .text-5xl { font-size: calc(3rem * var(--doc-scale)); leading: 1; }
      #editorial-doc .text-7xl { font-size: calc(4.5rem * var(--doc-scale)); leading: 1; }
    `}</style>
    <div 
      id="editorial-doc" 
      className={`shadow-2xl min-h-screen max-w-5xl mx-auto border transition-all duration-500 overflow-hidden relative ${densityClasses[settings.contentDensity]} ${familyClasses[settings.fontBody] || 'font-sans'}`}
      style={{ 
        padding: '20mm', 
        backgroundColor: settings.colorBackground,
        color: settings.colorText,
        backgroundImage: getBackgroundPattern(),
        borderColor: isBgDark ? '#333' : '#eee'
      }}
    >
      {/* 1. CAPA DO PLANEJAMENTO */}
      {settings.showCover && (
        <header className={`mb-24 page-break-avoid relative z-10 ${currentStyle.border}`} style={{ borderColor: settings.colorTitle }}>
          {settings.watermarkImage && (
            <img 
              src={settings.watermarkImage} 
              alt="Brand Header"
              className="absolute top-0 right-0 w-40 object-contain"
              style={{ 
                opacity: settings.watermarkOpacity || 0.12,
                filter: settings.watermarkGrayscale === false ? 'none' : 'grayscale(100%)'
              }}
            />
          )}
          <h1 className={`${currentStyle.heading} text-5xl md:text-7xl mb-4 leading-tight font-bold`} style={{ color: settings.colorTitle }}>
            {doc.title}
          </h1>
          <p className={`text-xl font-light mb-12 tracking-wide uppercase italic opacity-80`} style={{ color: settings.colorText }}>
            {doc.subtitle}
          </p>
          {currentStyle.decoration && <div className="h-px w-24 mb-6" style={{ backgroundColor: settings.colorTitle }}></div>}
          <p className={`text-sm tracking-[0.3em] font-bold uppercase`} style={{ color: settings.colorTitle }}>
            {doc.positionPhrase}
          </p>
        </header>
      )}
      {/* 2. ARQUITETURA ESTRATÉGICA */}
      {settings.showArchitecture && (
        <section className="mb-24 page-break-avoid">
          <h2 className={`text-[10px] font-bold tracking-[0.4em] uppercase mb-8 flex items-center gap-4`} style={{ color: settings.colorTitle }}>
            ESTRATÉGIA BASE <span className={`h-px flex-1`} style={{ backgroundColor: docBorderColor }}></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Atmosfera', 'Foco de Dor', 'Autoridade'].map((key, i) => (
              <div key={i} className={`${currentStyle.cardPadding} border`} style={{ backgroundColor: settings.colorCard, borderColor: cardBorderColor, color: settings.colorCardText }}>
                <span className={`text-[9px] uppercase tracking-widest block mb-3 font-bold`} style={{ color: settings.colorTitle }}>{key}</span>
                <p className="text-base font-medium leading-relaxed">
                  {i === 0 ? doc.architecture.feeling : i === 1 ? doc.architecture.pain : doc.architecture.authority}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. CALENDÁRIO DIÁRIO */}
      {settings.showDays && (
        <section className="space-y-32 mb-32 relative z-10">
          <h2 className={`text-[10px] font-bold tracking-[0.4em] uppercase mb-0 flex items-center gap-4`} style={{ color: settings.colorTitle }}>
            PLANO DE EXECUÇÃO <span className={`h-px flex-1`} style={{ backgroundColor: docBorderColor }}></span>
          </h2>
          {doc.sessions.map((sessionPlan, idx) => (
            <div key={idx} className={`border-t pt-16 page-break-avoid relative overflow-hidden`} style={{ borderColor: docBorderColor }}>
              
              {settings.watermarkImage && (
                <img 
                  src={settings.watermarkImage} 
                  alt="Brand Header"
                  className="absolute top-8 right-0 w-32 object-contain pointer-events-none z-0"
                  style={{ 
                    opacity: settings.watermarkOpacity || 0.12,
                    filter: settings.watermarkGrayscale === false ? 'none' : 'grayscale(100%)'
                  }}
                />
              )}

              <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4 relative z-10">
                <h3 className={`${currentStyle.heading} text-5xl font-bold`} style={{ color: settings.colorTitle }}>
                  {settings.sessionLabelType.toUpperCase()} {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </h3>
                <div className="flex gap-4 items-center">
                  <span className="px-5 py-2 text-white text-[10px] font-bold uppercase tracking-[0.3em]" style={{ backgroundColor: settings.colorCardAccent, color: settings.colorCardText }}>
                    {sessionPlan.format}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* LADO ESQUERDO: ESTRATÉGIA */}
                <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-8">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2`} style={{ color: settings.colorTitle }}>Tema Principal</p>
                      <p className="text-sm font-bold leading-relaxed">{sessionPlan.theme}</p>
                    </div>
                    <div className={`p-6 border-l-4`} style={{ backgroundColor: settings.colorCard, color: settings.colorCardText, borderColor: settings.colorCardAccent }}>
                      <p className={`text-[9px] font-bold uppercase tracking-widest mb-2`} style={{ color: settings.colorTitle }}>Briefing Criativo</p>
                      <p className={`text-[11px] font-medium leading-relaxed opacity-80`}>{sessionPlan.creativeDirection}</p>
                    </div>
                  </div>

                  <div className={`p-8 shadow-2xl`} style={{ backgroundColor: settings.colorTitle, color: settings.colorBackground }}>
                    <p className={`text-[9px] font-bold uppercase tracking-[0.4em] mb-6 border-b pb-2`} style={{ borderColor: settings.colorBackground }}>
                      STORIES SUGERIDOS
                    </p>
                    <ul className="space-y-5">
                      {sessionPlan.storySuggestions.map((story, sIdx) => (
                        <li key={sIdx} className={`text-[11px] leading-relaxed relative pl-4 border-l`} style={{ borderColor: settings.colorBackground }}>
                          {story}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* LADO DIREITO: DESIGN E CONTEÚDO */}
                <div className="lg:col-span-8 space-y-12">
                  
                  {sessionPlan.reelsScript ? (
                    <div className={`p-8 border-b-8 shadow-2xl`} style={{ backgroundColor: settings.colorCard, color: settings.colorCardText, borderColor: settings.colorTitle }}>
                      <div className="flex justify-between items-center mb-10 border-b pb-4" style={{ borderColor: docBorderColor }}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: settings.colorTitle }}>REELS SCRIPT</p>
                        <span className="text-[9px] font-mono opacity-50">ID: {idx+1}</span>
                      </div>
                      
                      <div className="mb-10 p-6 border-l-4" style={{ backgroundColor: settings.colorBackground, borderColor: settings.colorTitle }}>
                        <p className="text-[9px] uppercase font-bold mb-2 tracking-[0.2em] opacity-60">GANCHO (0-3s)</p>
                        <p className={`${currentStyle.heading.includes('syne') ? 'syne' : 'serif'} text-2xl italic tracking-tighter`}>
                          "{sessionPlan.reelsScript.hook}"
                        </p>
                      </div>
                      
                      <div className="space-y-12">
                        {sessionPlan.reelsScript.scenes.map((scene) => (
                          <div key={scene.sceneNumber} className="relative pl-12 border-l" style={{ borderColor: docBorderColor }}>
                            <span className="absolute -left-3 top-0 text-[36px] font-bold leading-none opacity-20" style={{ color: settings.colorTitle }}>
                              {scene.sceneNumber}
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-4">
                                <p className="text-[8px] uppercase font-bold opacity-60">AÇÃO VISUAL</p>
                                <p className="text-[12px] leading-relaxed opacity-90">{scene.visualAction}</p>
                              </div>
                              <div className="space-y-4">
                                <p className="text-[8px] uppercase font-bold opacity-60">LOCUÇÃO</p>
                                <p className="text-[12px] leading-relaxed italic font-semibold p-4 border" style={{ backgroundColor: settings.colorBackground, borderColor: docBorderColor, color: settings.colorText }}>
                                  {scene.audioSpeech}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-12 pt-8 border-t" style={{ borderColor: docBorderColor }}>
                         <p className="text-xl font-bold uppercase tracking-tighter" style={{ color: settings.colorTitle }}>{sessionPlan.reelsScript.cta}</p>
                      </div>
                    </div>
                  ) : sessionPlan.carouselSlides && sessionPlan.carouselSlides.length > 0 ? (
                    <div className="space-y-10">
                      <div className="flex items-center gap-4 mb-6">
                        <p className={`text-[10px] font-bold uppercase tracking-[0.4em] opacity-50`}>TELA DO CARROSSEL</p>
                        <div className={`h-px flex-1 ${isBgDark ? 'bg-white/10' : 'bg-gray-100'}`}></div>
                      </div>
                      {sessionPlan.carouselSlides.map((slide) => (
                        <div key={slide.slideNumber} className={`border shadow-sm hover:shadow-2xl transition-all page-break-avoid`} style={{ backgroundColor: settings.colorCard, borderColor: docBorderColor, color: settings.colorCardText }}>
                          <div className="flex justify-between items-center p-5 opacity-90 border-b" style={{ backgroundColor: settings.colorBackground, color: settings.colorTitle }}>
                            <span className="text-[10px] font-bold">TELA {slide.slideNumber < 10 ? `0${slide.slideNumber}` : slide.slideNumber}</span>
                          </div>
                          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                              <p className={`text-[10px] uppercase font-bold opacity-50`}>DESIGNER BRIEF</p>
                              <p className="text-[13px] font-bold leading-relaxed">{slide.visualDescription}</p>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-white shadow-2xl min-h-[220px]" style={{ backgroundColor: settings.colorTitle, color: settings.colorBackground }}>
                                 <p className={`${currentStyle.heading} text-2xl italic leading-none z-10 drop-shadow-xl`}>
                                      {slide.textOnCard}
                                  </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : sessionPlan.staticPostInfo ? (
                    <div className={`border shadow-2xl page-break-avoid overflow-hidden border-t-8`} style={{ backgroundColor: settings.colorCard, borderColor: settings.colorTitle, color: settings.colorCardText }}>
                      <div className="p-10 grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-5 space-y-6">
                           <p className={`text-[10px] uppercase font-bold opacity-50`}>VISUAL CONCEPT</p>
                           <p className="text-[14px] font-bold leading-snug">{sessionPlan.staticPostInfo.visualComposition}</p>
                        </div>
                        <div className="md:col-span-7">
                          <div className="flex-1 p-20 flex flex-col items-center justify-center text-center shadow-2xl text-white relative min-h-[300px]" style={{ backgroundColor: settings.colorTitle, color: settings.colorBackground }}>
                              <p className={`${currentStyle.heading} text-4xl italic leading-none z-10 drop-shadow-2xl`}>
                                  {sessionPlan.staticPostInfo.headlineOnCard}
                              </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* LEGENDA */}
                  <div className="page-break-avoid pt-12 border-t mt-12 border-gray-100">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-6`} style={{ color: settings.colorTitle }}>LEGENDA FINAL</p>
                    <div className={`border p-10 text-[16px] font-light leading-relaxed whitespace-pre-wrap italic`} style={{ backgroundColor: settings.colorBackground, borderColor: docBorderColor, color: settings.colorText }}>
                      {sessionPlan.caption}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 5. VEREDITO */}
      {settings.showFooter && (
        <footer className={`mt-40 pt-12 border-t page-break-avoid relative z-10`} style={{ borderColor: docBorderColor, color: settings.colorText }}>
          <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
              {doc.observation && settings.showObservation && (
                <p className={`${currentStyle.heading} text-2xl leading-snug flex-1 italic font-medium tracking-tight opacity-80`}>
                "{doc.observation}"
                </p>
              )}
              
              <div className="flex flex-row gap-12 items-end">
                {settings.socialMediaSignature && (
                  <div className="flex flex-col items-end">
                     <span className={`text-[7px] uppercase tracking-[0.4em] opacity-50 mb-1 block`}>SOCIAL MEDIA</span>
                     <span className={`${currentStyle.heading.includes('syne') ? 'syne' : 'serif'} text-lg italic tracking-tighter block mb-2 text-right`}>{settings.socialMediaSignature}</span>
                     <div className={`w-16 h-px ${isBgDark ? 'bg-white/20' : 'bg-black/20'}`}></div>
                  </div>
                )}
                
                {settings.designerSignature && (
                  <div className="flex flex-col items-end">
                     <span className={`text-[7px] uppercase tracking-[0.4em] opacity-50 mb-1 block`}>DESIGNER</span>
                     <span className={`${currentStyle.heading.includes('syne') ? 'syne' : 'serif'} text-lg italic tracking-tighter block mb-2 text-right`}>{settings.designerSignature}</span>
                     <div className={`w-16 h-px ${isBgDark ? 'bg-white/20' : 'bg-black/20'}`}></div>
                  </div>
                )}

                {settings.agencySignature && (
                  <div className="flex flex-col items-end">
                     <span className={`text-[7px] uppercase tracking-[0.4em] opacity-50 mb-1 block`}>AGÊNCIA</span>
                     <span className={`${currentStyle.heading.includes('syne') ? 'syne' : 'serif'} text-lg italic tracking-tighter block mb-2 text-right font-bold`}>{settings.agencySignature}</span>
                     <div className={`w-16 h-px ${isBgDark ? 'bg-white/20' : 'bg-black/20'}`}></div>
                  </div>
                )}

                <div className="flex flex-col items-end pl-8 border-l border-gray-200/30">
                    <div className={`text-[8px] font-bold uppercase tracking-[0.6em] opacity-80 mb-2`}>
                        {settings.companyName || 'STUDIO OS'}
                    </div>
                </div>
              </div>
          </div>
        </footer>
      )}
    </div>
    </>
  );
};

export default DocumentPreview;
