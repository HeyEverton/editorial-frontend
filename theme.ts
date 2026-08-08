/* ════════════════════════════════════════════════════════════════════
   SISTEMA DE DESIGN E PADRONIZAÇÃO DE TEMA (THEME DESIGN TOKENS)
   Elite Editorial Architect
════════════════════════════════════════════════════════════════════ */

export const theme = {
  colors: {
    // Cores Principais do Sistema (Monocromático de Luxo Editorial)
    black: '#000000',
    dark: '#0d0d0d',
    grayDark: '#141414',
    offwhite: '#fafafa',
    white: '#ffffff',

    // BORDAS & DIVISORES
    border: '#e5e7eb',
    borderLight: 'rgba(0, 0, 0, 0.06)',
    borderDark: 'rgba(255, 255, 255, 0.1)',
    borderFocus: '#000000',

    // TEXTOS & HIERARQUIA
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    textFaint: '#cbd5e1',

    // ACCENT / BRAND PRIMARY (Sempre consistente com o padrão do projeto)
    brandPrimary: '#000000',
    brandPrimaryHover: '#1e293b',
    brandSecondary: '#334155',

    // FEEDBACKS & STATUS
    success: '#10b981',
    successBg: '#f0fdf4',
    warning: '#f59e0b',
    warningBg: '#fffbeb',
    danger: '#ef4444',
    dangerBg: '#fef2f2',
    info: '#3b82f6',
    infoBg: '#eff6ff',
  },

  fonts: {
    body: "'Inter', sans-serif",
    serif: "'Playfair Display', serif",
    syne: "'Syne', sans-serif",
    montserrat: "'Montserrat', sans-serif",
  },

  shadows: {
    subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
    card: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    hoverCard: '0 12px 30px -4px rgba(0, 0, 0, 0.08)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    focusGlow: '0 0 0 3px rgba(0, 0, 0, 0.08)',
  },

  transitions: {
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
  },
};
