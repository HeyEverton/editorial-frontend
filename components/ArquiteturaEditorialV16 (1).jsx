import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, ChevronDown, Check, Quote,
  Layers, Award, Target, Users, Zap, Eye, PenTool,
  BarChart3, Film, Image, BookOpen, Share2, Shield,
  Star, Play, Download
} from "lucide-react";

const FontInjector = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);
  return null;
};

const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, vis];
};

const R = ({ children, delay = 0, y = 28, style = {} }) => {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : `translateY(${y}px)`,
      transition: `opacity 0.85s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.85s cubic-bezier(.16,1,.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
};

const T = {
  white: "#ffffff",
  offwhite: "#f8f8f8",
  snow: "#fafafa",
  black: "#000000",
  ink: "#111111",
  charcoal: "#222222",
  muted: "#555555",
  faint: "#999999",
  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.18)",
};

const GridTexture = ({ opacity = 0.04, size = 40 }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
    <defs>
      <pattern id={`g${size}${opacity}`} width={size} height={size} patternUnits="userSpaceOnUse">
        <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={`rgba(0,0,0,${opacity})`} strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#g${size}${opacity})`} />
  </svg>
);

const DotTexture = ({ opacity = 0.06 }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
    <defs>
      <pattern id={`d${opacity}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill={`rgba(0,0,0,${opacity})`} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#d${opacity})`} />
  </svg>
);

const Rule = ({ style = {}, invert = false }) => (
  <div style={{ width: 56, height: 1, background: invert ? "rgba(255,255,255,0.2)" : T.black, margin: "0 auto", ...style }} />
);

const Label = ({ children, invert = false }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 10,
    fontFamily: "'Syne', sans-serif", fontSize: 9, fontWeight: 700,
    letterSpacing: 3.5, textTransform: "uppercase",
    color: invert ? "rgba(255,255,255,0.5)" : T.muted, marginBottom: 20,
  }}>
    <span style={{ display: "block", width: 20, height: 1, background: invert ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }} />
    {children}
    <span style={{ display: "block", width: 20, height: 1, background: invert ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }} />
  </div>
);

const CTABtn = ({ children = "Acessar o Estúdio Elite", invert = false, large = false }) => {
  const [h, sH] = useState(false);
  return (
    <button onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)} style={{
      fontFamily: "'Syne', sans-serif", fontWeight: 700,
      fontSize: large ? 11 : 10,
      letterSpacing: h ? "3.5px" : (large ? "3px" : "2.5px"),
      textTransform: "uppercase",
      background: invert ? (h ? T.white : "transparent") : (h ? T.charcoal : T.black),
      color: invert ? (h ? T.black : T.white) : T.white,
      border: invert ? "1px solid rgba(255,255,255,0.35)" : "none",
      padding: large ? "20px 60px" : "14px 36px",
      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 12,
      transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
      boxShadow: h ? "0 12px 40px rgba(0,0,0,0.2)" : "none",
    }}>
      {children}
      <ArrowRight size={13} style={{ transition: "transform 0.3s", transform: h ? "translateX(5px)" : "none" }} />
    </button>
  );
};

/* ── NAVBAR ── */
const Navbar = () => {
  const [sc, setSc] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: 68, padding: "0 56px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: sc ? "rgba(255,255,255,0.95)" : "transparent",
      backdropFilter: sc ? "blur(20px)" : "none",
      borderBottom: sc ? `1px solid ${T.border}` : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 26, height: 26, border: `1.5px solid ${T.black}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 10, height: 10, background: T.black }} />
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, letterSpacing: 1.5, color: T.black }}>AE·Studio</span>
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        {["Solução", "Presets", "Recursos", "FAQ"].map(l => (
          <a key={l} href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", color: T.muted, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = T.black}
            onMouseLeave={e => e.target.style.color = T.muted}>{l}</a>
        ))}
      </div>
      <button style={{ fontFamily: "'Syne', sans-serif", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", background: "transparent", color: T.black, border: `1px solid ${T.borderStrong}`, padding: "9px 22px", cursor: "pointer", transition: "all 0.25s" }}
        onMouseEnter={e => { e.currentTarget.style.background = T.black; e.currentTarget.style.color = T.white; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.black; }}>
        Entrar
      </button>
    </nav>
  );
};

/* ── HERO ── */
const Hero = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);
  const a = (d) => ({ opacity: ready ? 1 : 0, transform: ready ? "none" : "translateY(28px)", transition: `opacity 1s cubic-bezier(.16,1,.3,1) ${d}s, transform 1s cubic-bezier(.16,1,.3,1) ${d}s` });

  return (
    <section style={{ minHeight: "100vh", background: T.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 100px", position: "relative", overflow: "hidden" }}>
      <GridTexture opacity={0.035} />
      <div style={{ position: "absolute", top: "16%", left: "6%", width: 1, height: 90, background: "linear-gradient(180deg,transparent,rgba(0,0,0,0.15),transparent)" }} />
      <div style={{ position: "absolute", top: "22%", right: "6%", width: 1, height: 60, background: "linear-gradient(180deg,transparent,rgba(0,0,0,0.1),transparent)" }} />

      <div style={{ ...a(0.1), display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
        <span style={{ display: "block", width: 36, height: 1, background: "rgba(0,0,0,0.15)" }} />
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: T.muted }}>Estúdio Elite V16 — Ferramenta de Elite</span>
        <span style={{ display: "block", width: 36, height: 1, background: "rgba(0,0,0,0.15)" }} />
      </div>

      <h1 style={{ ...a(0.22), fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(52px,8.5vw,108px)", lineHeight: 0.97, color: T.black, maxWidth: 1000, marginBottom: 10, letterSpacing: -1 }}>
        Transforme estratégia
      </h1>
      <h1 style={{ ...a(0.32), fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: "italic", fontSize: "clamp(52px,8.5vw,108px)", lineHeight: 0.97, color: T.black, opacity: 0.35, maxWidth: 1000, marginBottom: 44, letterSpacing: -1 }}>
        bruta em design irrefutável.
      </h1>

      <p style={{ ...a(0.44), fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 16, lineHeight: 1.9, color: T.muted, maxWidth: 520, marginBottom: 60 }}>
        O Estúdio Elite para estrategistas que não aceitam o básico. Da <strong style={{ fontWeight: 500, color: T.black }}>engenharia de prompt</strong> à <strong style={{ fontWeight: 500, color: T.black }}>exportação A3</strong> em minutos.
      </p>

      <div style={{ ...a(0.54), display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", justifyContent: "center", marginBottom: 88 }}>
        <CTABtn large />
        <button style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: T.muted, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, textDecoration: "underline", textDecorationColor: "rgba(0,0,0,0.15)" }}>
          <Play size={11} fill={T.muted} /> Ver como funciona
        </button>
      </div>

      <div style={{ ...a(0.66), width: "100%", maxWidth: 840, position: "relative" }}>
        <div style={{ background: T.ink, padding: "28px 36px", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 48px 120px rgba(0,0,0,0.14)" }}>
          <div style={{ display: "flex", gap: 7, marginBottom: 20 }}>
            {["#ff5f57","#ffbd2e","#28ca41"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Nicho ✓", "Público ✓", "Dores ✓", "Objetivo ✓", "Tom de Voz ✓"].map((s, i) => (
              <div key={i} style={{ background: i === 4 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", padding: "6px 14px", fontFamily: "'Syne', sans-serif", fontSize: 9, letterSpacing: 1.5, color: i === 4 ? T.white : "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{s}</div>
            ))}
          </div>
          <div style={{ marginTop: 20, fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.25)" }}>gerando arquitetura editorial...</div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.2 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 8, letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
        <ChevronDown size={12} />
      </div>
    </section>
  );
};

/* ── FORMULA ── */
const pillars = [
  { icon: Target, num: "01", name: "Nicho", desc: "Defina o território onde sua marca opera com precisão cirúrgica." },
  { icon: Users, num: "02", name: "Público", desc: "Mapeie a audiência: comportamentos, desejos e gatilhos." },
  { icon: Zap, num: "03", name: "Dores", desc: "Identifique as fricções que sua estratégia irá disolver." },
  { icon: BarChart3, num: "04", name: "Objetivo", desc: "KPIs reais: alcance, autoridade ou conversão direta." },
  { icon: PenTool, num: "05", name: "Tom de Voz", desc: "A personalidade editorial que ressoa com sua audiência." },
];

const Formula = () => (
  <section style={{ background: T.offwhite, padding: "128px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <DotTexture opacity={0.05} />
    <R style={{ marginBottom: 80 }}>
      <Label>Engenharia de Prompt Invisível</Label>
      <Rule style={{ marginBottom: 40 }} />
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(34px,5vw,62px)", color: T.black, maxWidth: 680, margin: "0 auto 20px", lineHeight: 1.1 }}>
        5 perguntas estratégicas.<br /><em style={{ fontStyle: "italic", opacity: 0.35 }}>Uma arquitetura completa.</em>
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 15, color: T.muted, maxWidth: 460, margin: "0 auto", lineHeight: 1.85 }}>Sem prompts técnicos. O formulário extrai os pilares estratégicos e a IA gera o cronograma editorial.</p>
    </R>
    <div style={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
      <div style={{ position: "absolute", top: 40, left: "8%", right: "8%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.07),transparent)", zIndex: 0 }} />
      {pillars.map((p, i) => {
        const Icon = p.icon;
        return (
          <R key={i} delay={i * 0.1} style={{ flex: "1 1 180px", maxWidth: 210, zIndex: 1 }}>
            <div style={{ background: T.white, border: `1px solid ${T.border}`, padding: "48px 24px 36px", textAlign: "center", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 56px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = T.borderStrong; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = T.border; }}>
              <div style={{ width: 46, height: 46, border: `1px solid ${T.borderStrong}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Icon size={17} color={T.black} />
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: 3, color: T.faint, marginBottom: 8 }}>{p.num}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 500, color: T.black, marginBottom: 10 }}>{p.name}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 12, color: T.muted, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          </R>
        );
      })}
    </div>
  </section>
);

/* ── DUAL BRAIN ── */
const DualBrain = () => (
  <section style={{ background: T.black, padding: "128px 24px", position: "relative", overflow: "hidden" }}>
    <GridTexture opacity={0.07} />
    <R style={{ textAlign: "center", marginBottom: 80 }}>
      <Label invert>O Cérebro Digital Duplo</Label>
      <Rule invert style={{ marginBottom: 40 }} />
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(34px,5vw,60px)", color: T.white, maxWidth: 660, margin: "0 auto 20px", lineHeight: 1.1 }}>
        Não é IA genérica.<br /><em style={{ fontStyle: "italic", opacity: 0.35 }}>É inteligência especializada.</em>
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 440, margin: "0 auto", lineHeight: 1.85 }}>Dois perfis especializados. Juntos, formam o braço estratégico que você nunca teve.</p>
    </R>
    <div style={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", maxWidth: 880, margin: "0 auto" }}>
      {[
        { icon: Eye, name: "O Diretor Criativo", sub: "Impacto emocional e conversão", items: ["Ganchos magnéticos que param o scroll", "Legendas que vendem sem parecer venda", "Direções de arte de alto impacto", "CTAs calibrados por etapa do funil"] },
        { icon: Layers, name: "O Arquiteto Editorial", sub: "Hierarquia, fluxo e clareza estratégica", items: ["Hierarquia visual de conteúdo", "Organização e sequência editorial", "Coerência entre formatos e plataformas", "Mapeamento de jornada de autoridade"] },
      ].map((b, i) => (
        <R key={i} delay={i * 0.15} style={{ flex: "1 1 380px", maxWidth: 430 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderTop: `2px solid rgba(255,255,255,0.8)`, padding: "52px 44px", transition: "background 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <b.icon size={17} color={T.white} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 500, color: T.white }}>{b.name}</h3>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 9, letterSpacing: 1.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: 3 }}>{b.sub}</p>
              </div>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginTop: 28 }}>
              {b.items.map((item, j) => (
                <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 300, lineHeight: 1.6 }}>
                  <Check size={12} color="rgba(255,255,255,0.5)" style={{ marginTop: 2, flexShrink: 0 }} />{item}
                </li>
              ))}
            </ul>
          </div>
        </R>
      ))}
    </div>
  </section>
);

/* ── PRESETS ── */
const presets = [
  { name: "Classic Gold", sub: "Dourado Atemporal", bg: "#fffaf0", fg: "#1a1a1a", border: "rgba(0,0,0,0.1)", desc: "Serifa clássica, espaços amplos. Para marcas que prezam tradição e autoridade." },
  { name: "Dark Onyx", sub: "Onyx Premium", bg: "#0a0a0a", fg: "#ffffff", border: "rgba(255,255,255,0.08)", desc: "Fundo absoluto. Para marcas que dominam o digital com presença magnética." },
  { name: "Modern Obsidian", sub: "Obsidiana Moderna", bg: "#111111", fg: "#e0e0e0", border: "rgba(255,255,255,0.06)", desc: "Cinza premium. Para agências que entregam sofisticação sem ostentação." },
  { name: "Luxury Cream", sub: "Creme de Luxo", bg: "#fdfbf7", fg: "#111111", border: "rgba(0,0,0,0.08)", desc: "Creme suave. Para estrategistas de moda, beleza e lifestyle premium." },
  { name: "Minimal Sand", sub: "Areia Minimal", bg: "#f4f0e8", fg: "#2a2a2a", border: "rgba(0,0,0,0.09)", desc: "Tons terrosos. Para marcas de bem-estar, arquitetura e design sustentável." },
];

const PresetsSection = () => {
  const [active, setActive] = useState(1);
  const p = presets[active];
  return (
    <section style={{ background: T.snow, padding: "128px 24px", position: "relative", overflow: "hidden" }}>
      <GridTexture opacity={0.03} />
      <R style={{ textAlign: "center", marginBottom: 64 }}>
        <Label>Estúdio de Edição em Tempo Real</Label>
        <Rule style={{ marginBottom: 40 }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(34px,5vw,60px)", color: T.black, maxWidth: 660, margin: "0 auto 20px", lineHeight: 1.1 }}>
          Troque o preset.<br /><em style={{ fontStyle: "italic", opacity: 0.35 }}>Transforme a identidade.</em>
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 15, color: T.muted, maxWidth: 440, margin: "0 auto", lineHeight: 1.85 }}>5 presets pré-calibrados. Um clique muda fonte, paleta e layout simultaneamente.</p>
      </R>
      <div style={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
        {presets.map((pr, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ fontFamily: "'Syne', sans-serif", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", padding: "10px 20px", border: "1px solid", borderColor: i === active ? T.black : T.border, background: i === active ? T.black : "transparent", color: i === active ? T.white : T.muted, cursor: "pointer", transition: "all 0.22s" }}>{pr.name}</button>
        ))}
      </div>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ background: p.bg, border: `1px solid ${p.border}`, padding: "56px 60px", position: "relative", overflow: "hidden", boxShadow: "0 32px 100px rgba(0,0,0,0.09)", transition: "all 0.4s ease" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.fg, opacity: 0.7 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 8, letterSpacing: 3.5, textTransform: "uppercase", color: p.fg, opacity: 0.35, marginBottom: 8 }}>{p.sub}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: p.fg }}>{p.name}</h3>
            </div>
            <div style={{ width: 34, height: 34, border: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, background: p.fg, opacity: 0.7 }} />
            </div>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 14, color: p.fg, opacity: 0.5, lineHeight: 1.8, maxWidth: 440, marginBottom: 28 }}>{p.desc}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Tipografia calibrada", "Paleta exclusiva", "Grid editorial"].map(tag => (
              <span key={tag} style={{ fontFamily: "'Syne', sans-serif", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", padding: "5px 12px", border: `1px solid ${p.border}`, color: p.fg, opacity: 0.5 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── MULTI FORMAT ── */
const formats = [
  { icon: Film, name: "Scripts de Reels", tag: "Vídeo", desc: "Ganchos de abertura, cenas numeradas, transições e sugestão de áudio — prontos para execução.", chips: ["Gancho 3s", "Cenas", "CTA", "Áudio"] },
  { icon: Layers, name: "Design de Carrosséis", tag: "Carrossel", desc: "Briefing visual tela a tela. Cada slide com texto, direção de arte e hierarquia tipográfica.", chips: ["Slide a slide", "Gancho visual", "Hierarquia", "Copy"] },
  { icon: Image, name: "Posts & Memes Estáticos", tag: "Post", desc: "Composições visuais prontas com paleta, fonte e copy definidos por objetivo de engajamento.", chips: ["Composição", "Copy", "Paleta", "Formato"] },
  { icon: BookOpen, name: "Stories Estratégicos", tag: "Stories", desc: "Sequências de 3 a 5 stories com fluxo narrativo, calls-to-action e timing de publicação.", chips: ["3-5 stories", "Narrativa", "CTA", "Timing"] },
];

const MultiFormat = () => (
  <section style={{ background: T.white, padding: "128px 24px" }}>
    <R style={{ textAlign: "center", marginBottom: 80 }}>
      <Label>Arquitetura Multi-Formato</Label>
      <Rule style={{ marginBottom: 40 }} />
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(34px,5vw,60px)", color: T.black, maxWidth: 640, margin: "0 auto 20px", lineHeight: 1.1 }}>
        Uma estratégia.<br /><em style={{ fontStyle: "italic", opacity: 0.35 }}>Todos os formatos.</em>
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 15, color: T.muted, maxWidth: 440, margin: "0 auto", lineHeight: 1.85 }}>Reels, Carrosséis, Posts e Stories gerados de forma coerente — alinhados à mesma arquitetura.</p>
    </R>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 2, maxWidth: 1040, margin: "0 auto" }}>
      {formats.map((f, i) => {
        const Icon = f.icon;
        return (
          <R key={i} delay={i * 0.09}>
            <div style={{ background: T.offwhite, border: `1px solid ${T.border}`, padding: "44px 32px", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.boxShadow = "0 16px 56px rgba(0,0,0,0.07)"; e.currentTarget.style.borderColor = T.borderStrong; e.currentTarget.style.transform = "translateY(-5px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.offwhite; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div style={{ width: 42, height: 42, border: `1px solid ${T.borderStrong}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={T.black} />
                </div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: T.muted, border: `1px solid ${T.border}`, padding: "4px 10px" }}>{f.tag}</span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 500, color: T.black, marginBottom: 10 }}>{f.name}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 13, color: T.muted, lineHeight: 1.75, marginBottom: 20 }}>{f.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {f.chips.map(c => <span key={c} style={{ fontFamily: "'Syne', sans-serif", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${T.border}`, color: T.muted }}>{c}</span>)}
              </div>
            </div>
          </R>
        );
      })}
    </div>
  </section>
);

/* ── A3 SHOWCASE ── */
const A3Showcase = () => (
  <section style={{ background: T.black, padding: "140px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <GridTexture opacity={0.07} />
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 60%)", pointerEvents: "none" }} />
    <R style={{ marginBottom: 80 }}>
      <Label invert>O Troféu de Entrega</Label>
      <Rule invert style={{ marginBottom: 48 }} />
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(40px,6vw,80px)", color: T.white, maxWidth: 800, margin: "0 auto 24px", lineHeight: 1.05 }}>
        O PDF A3<br /><em style={{ fontStyle: "italic", opacity: 0.35 }}>que encanta qualquer cliente.</em>
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.38)", maxWidth: 460, margin: "0 auto 60px", lineHeight: 1.85 }}>Não é uma lista. É um documento de agência elite em A3 — o padrão de consultorias que cobram cinco dígitos por um planejamento.</p>
    </R>
    <R delay={0.15} style={{ maxWidth: 720, margin: "0 auto 80px" }}>
      <div style={{ background: T.white, aspectRatio: "1.41 / 1", padding: "48px 56px", position: "relative", overflow: "hidden", boxShadow: "0 60px 160px rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <GridTexture opacity={0.025} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: T.black }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, position: "relative" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 8, letterSpacing: 4, textTransform: "uppercase", color: T.faint, marginBottom: 8 }}>Arquitetura Editorial · Documento Estratégico</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.black }}>Planejamento Q3 2025</h3>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 8, letterSpacing: 2, color: T.faint, textAlign: "right" }}>
            <div>Versão 1.0</div><div>Formato A3</div><div style={{ color: T.black, marginTop: 4, fontWeight: 700 }}>Elite Studio</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10, position: "relative" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: i < 3 ? 56 : 36, background: i === 0 ? "rgba(0,0,0,0.07)" : "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ height: 2, background: i === 0 ? T.black : "transparent" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[70, 30].map((w, i) => <div key={i} style={{ flex: w, height: 70, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" }} />)}
        </div>
        <div style={{ position: "absolute", bottom: 24, right: 48, display: "flex", gap: 20, alignItems: "center" }}>
          {["Designer", "Social Media", "Agência"].map(r => (
            <div key={r} style={{ textAlign: "center" }}>
              <div style={{ width: 40, height: 1, background: "rgba(0,0,0,0.12)", marginBottom: 4 }} />
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 7, letterSpacing: 1.5, textTransform: "uppercase", color: T.faint }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </R>
    <div style={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
      {[{ icon: Award, text: "Layout de agência de alto padrão" }, { icon: Share2, text: "Assinatura tripla: Designer, SM, Agência" }, { icon: Download, text: "Exportação em alta resolução" }, { icon: Shield, text: "Marca d'água personalizada" }].map((b, i) => {
        const Icon = b.icon;
        return (
          <R key={i} delay={i * 0.07}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", padding: "24px 28px", display: "flex", alignItems: "center", gap: 14, minWidth: 228, transition: "background 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
              <Icon size={15} color="rgba(255,255,255,0.4)" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{b.text}</span>
            </div>
          </R>
        );
      })}
    </div>
  </section>
);

/* ── SOCIAL PROOF ── */
const testimonials = [
  { quote: "Desde que comecei a entregar o A3, ninguém mais questiona o valor do meu serviço. O formato fala por si.", name: "Camila Rodrigues", role: "Estrategista de Conteúdo · SP" },
  { quote: "A pergunta sobre Objetivo me fez perceber que eu nunca havia definido um KPI real para nenhum cliente. Mudou minha abordagem.", name: "Rafael Mendes", role: "Head de Conteúdo · Agência NORD" },
  { quote: "O preset Dark Onyx é o layout mais elegante que já vi em um planejamento editorial. Clientes ficam impressionados.", name: "Beatriz Alves", role: "Diretora Criativa · Studio Forma" },
];

const Social = () => (
  <section style={{ background: T.offwhite, padding: "120px 24px" }}>
    <R style={{ textAlign: "center", marginBottom: 72 }}>
      <Label>Prova Social</Label>
      <Rule style={{ marginBottom: 40 }} />
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(30px,4vw,50px)", color: T.black, maxWidth: 540, margin: "0 auto" }}>Estrategistas que cobram pelo que entregam.</h2>
    </R>
    <R style={{ marginBottom: 72 }}>
      <div style={{ display: "flex", gap: 48, justifyContent: "center", alignItems: "center", flexWrap: "wrap", opacity: 0.12 }}>
        {["AGÊNCIA A", "STUDIO B", "MARCA C", "GRUPO D", "STUDIO E"].map(l => (
          <span key={l} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 4, color: T.black, textTransform: "uppercase" }}>{l}</span>
        ))}
      </div>
    </R>
    <div style={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", maxWidth: 1020, margin: "0 auto" }}>
      {testimonials.map((t, i) => (
        <R key={i} delay={i * 0.1}>
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderTop: `2px solid ${T.black}`, padding: "40px 34px", flex: "1 1 280px", maxWidth: 330, textAlign: "left", transition: "transform 0.3s, box-shadow 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <Quote size={15} color={T.black} style={{ marginBottom: 18, opacity: 0.15 }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, fontWeight: 400, color: "#333", lineHeight: 1.75, marginBottom: 22 }}>"{t.quote}"</p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 28, height: 28, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Star size={10} color={T.black} fill={T.black} />
              </div>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 600, color: T.black }}>{t.name}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: T.muted, marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          </div>
        </R>
      ))}
    </div>
  </section>
);

/* ── FAQ ── */
const faqs = [
  { q: "Preciso saber usar IA para aproveitar a ferramenta?", a: "Não. O formulário guiado foi projetado para estrategistas que dominam marketing, não tecnologia. Você responde 5 perguntas estratégicas; o Estúdio executa a engenharia de prompt de forma completamente invisível." },
  { q: "Meus dados e os dos meus clientes são seguros?", a: "Sim. Os briefings são processados em tempo real e não armazenamos dados estratégicos. Toda informação é criptografada em trânsito. Sua propriedade intelectual permanece 100% sua." },
  { q: "O PDF A3 pode ser personalizado com minha marca?", a: "Sim. Você pode adicionar logotipo, marca d'água e a assinatura tripla (Designer, Social Media, Agência) antes de exportar. Cada documento sai com a identidade da sua agência." },
  { q: "Qual a diferença para geradores de posts genéricos?", a: "Geradores criam conteúdo avulso. O Arquitetura Editorial gera uma estratégia integrada — pilares, formatos, cronograma, scripts e layout visual — com um documento de agência para apresentar ao cliente." },
  { q: "Funciona para qualquer nicho de mercado?", a: "Sim. O formulário estratégico foi validado em mais de 40 nichos. Quanto mais específico você for nas respostas dos 5 pilares, mais precisa e personalizada será a arquitetura gerada." },
  { q: "Posso trocar o preset depois de gerar a arquitetura?", a: "Sim. O Estúdio de Edição em Tempo Real permite trocar o preset a qualquer momento — fonte, cor e layout se atualizam instantaneamente sem perder o conteúdo gerado." },
];

const FAQItem = ({ faq, i }) => {
  const [open, setOpen] = useState(false);
  return (
    <R delay={i * 0.04}>
      <div style={{ borderBottom: `1px solid ${T.border}` }}>
        <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "26px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 400, color: T.black, textAlign: "left", lineHeight: 1.3 }}>{faq.q}</span>
          <ChevronDown size={14} color={T.black} style={{ flexShrink: 0, opacity: 0.35, transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "none" }} />
        </button>
        <div style={{ overflow: "hidden", maxHeight: open ? 200 : 0, transition: "max-height 0.42s ease" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 14, color: T.muted, lineHeight: 1.85, paddingBottom: 26 }}>{faq.a}</p>
        </div>
      </div>
    </R>
  );
};

const FAQ = () => (
  <section style={{ background: T.white, padding: "120px 24px" }}>
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <R style={{ textAlign: "center", marginBottom: 60 }}>
        <Label>Dúvidas Frequentes</Label>
        <Rule style={{ marginBottom: 40 }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(30px,4vw,50px)", color: T.black }}>Perguntas que importam.</h2>
      </R>
      {faqs.map((f, i) => <FAQItem key={i} faq={f} i={i} />)}
    </div>
  </section>
);

/* ── FINAL CTA ── */
const FinalCTA = () => (
  <section style={{ background: T.black, padding: "160px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <GridTexture opacity={0.07} />
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 60%)", pointerEvents: "none" }} />
    <R>
      <Label invert>Acesso Antecipado</Label>
      <Rule invert style={{ marginBottom: 52 }} />
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(48px,7vw,96px)", color: T.white, maxWidth: 780, margin: "0 auto 24px", lineHeight: 1.0 }}>
        Entre para o<br /><em style={{ fontStyle: "italic", opacity: 0.35 }}>Estúdio Elite.</em>
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 15, color: "rgba(255,255,255,0.38)", maxWidth: 420, margin: "0 auto 56px", lineHeight: 1.9 }}>Estrategistas premium não entregam listas. Entregam arquitetura. Sua próxima entrega pode mudar a percepção do seu trabalho para sempre.</p>
      <CTABtn large invert />
      <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap" }}>
        {["Sem cartão de crédito", "Exportação A3 inclusa", "Suporte prioritário"].map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
            <Check size={11} color="rgba(255,255,255,0.35)" /> {b}
          </div>
        ))}
      </div>
    </R>
  </section>
);

/* ── FOOTER ── */
const Footer = () => (
  <footer style={{ background: "#050505", padding: "52px 56px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 22, height: 22, border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 9, height: 9, background: T.white }} />
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, letterSpacing: 1.5, color: T.white }}>AE·Studio</span>
      </div>
      <div style={{ display: "flex", gap: 32 }}>
        {["Privacidade", "Termos de Uso", "Contato", "Imprensa"].map(l => (
          <a key={l} href="#" style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", color: "rgba(255,255,255,0.22)", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = T.white}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.22)"}>{l}</a>
        ))}
      </div>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.14)" }}>© 2025 Arquitetura Editorial. Todos os direitos reservados.</span>
    </div>
  </footer>
);

/* ════════════════════════════
   PRICING
════════════════════════════ */
const plans = [
  {
    id: "essencial",
    name: "Essencial",
    sub: "O Ponto de Entrada",
    price: "97",
    period: "/mês",
    audience: "Para criadores solo e iniciantes no estrategismo.",
    cta: "Começar Agora",
    featured: false,
    items: [
      "5 Arquiteturas Editoriais por mês",
      "Formulário Estratégico Guiado",
      "Exportação em PDF Padrão",
      "Acesso a 3 Presets Básicos",
      "Suporte via E-mail",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    sub: "O Padrão de Agência",
    price: "297",
    period: "/mês",
    audience: "Para estrategistas, social medias e agências boutique.",
    cta: "Tornar-me Elite",
    featured: true,
    tag: "RECOMENDADO",
    items: [
      "Gerações Ilimitadas (I.A Gemini)",
      "Exportação PDF A3 Estratégico",
      "12+ Presets de Luxo (Classic Gold, Dark Onyx…)",
      "Branding: Marca d'água + Assinatura Tripla",
      "Histórico de até 10 Projetos Ativos",
      "Suporte Prioritário",
    ],
  },
  {
    id: "master",
    name: "Master Black",
    sub: "Alta Consultoria",
    price: "1.200",
    period: "/ano",
    audience: "Para consultores premium, grandes agências e educadores.",
    cta: "Entrar para o Master Black",
    featured: false,
    items: [
      "Tudo do Plano Elite",
      "Modo White-Label (sem marca Studio OS)",
      "Suporte VIP via WhatsApp",
      "Presets Exclusivos e Customizados",
      "Mentoria Trimestral em Grupo",
    ],
  },
];

const PricingCard = ({ plan, index }) => {
  const [hov, setHov] = useState(false);
  const f = plan.featured;

  return (
    <R delay={index * 0.12} style={{ flex: "1 1 280px", maxWidth: 360, display: "flex" }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: "100%",
          background: f ? T.black : T.white,
          border: f ? "1.5px solid rgba(255,255,255,0.12)" : `1px solid ${T.border}`,
          borderTop: f ? "2px solid rgba(255,255,255,0.7)" : `2px solid ${T.black}`,
          padding: "52px 40px 44px",
          display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden",
          transform: f ? "scale(1.03)" : hov ? "translateY(-6px)" : "none",
          boxShadow: f
            ? "0 32px 80px rgba(0,0,0,0.3)"
            : hov ? "0 20px 60px rgba(0,0,0,0.08)" : "none",
          transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
          zIndex: f ? 2 : 1,
        }}
      >
        {/* subtle grid overlay for featured */}
        {f && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
            backgroundSize: "32px 32px" }} />
        )}

        {/* tag */}
        {plan.tag && (
          <div style={{
            position: "absolute", top: 20, right: 20,
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 8, letterSpacing: 3, textTransform: "uppercase",
            color: f ? T.black : T.white,
            background: f ? T.white : T.black,
            padding: "5px 12px",
          }}>{plan.tag}</div>
        )}

        {/* header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
            color: f ? "rgba(255,255,255,0.4)" : T.muted, marginBottom: 8,
          }}>{plan.sub}</div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            fontSize: 28, color: f ? T.white : T.black, marginBottom: 6,
          }}>{plan.name}</h3>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            fontSize: 12, color: f ? "rgba(255,255,255,0.4)" : T.muted,
            lineHeight: 1.6,
          }}>{plan.audience}</p>
        </div>

        {/* price */}
        <div style={{ marginBottom: 36, display: "flex", alignItems: "flex-end", gap: 4 }}>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            fontSize: 13, fontWeight: 400,
            color: f ? "rgba(255,255,255,0.5)" : T.muted,
            marginBottom: 10,
          }}>R$</span>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            fontSize: 56, lineHeight: 1, letterSpacing: -2,
            color: f ? T.white : T.black,
          }}>{plan.price}</span>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontSize: 10,
            color: f ? "rgba(255,255,255,0.35)" : T.muted,
            marginBottom: 10, letterSpacing: 1,
          }}>{plan.period}</span>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: f ? "rgba(255,255,255,0.08)" : T.border, marginBottom: 32 }} />

        {/* features */}
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, flex: 1, marginBottom: 40 }}>
          {plan.items.map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{
                flexShrink: 0, marginTop: 2,
                color: f ? "rgba(255,255,255,0.6)" : T.black,
                fontSize: 11,
              }}>✓</span>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontWeight: 300,
                fontSize: 13, lineHeight: 1.55,
                color: f ? "rgba(255,255,255,0.55)" : T.muted,
              }}>{item}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <PricingCTA plan={plan} />
      </div>
    </R>
  );
};

const PricingCTA = ({ plan }) => {
  const [h, sH] = useState(false);
  const f = plan.featured;
  return (
    <button
      onMouseEnter={() => sH(true)}
      onMouseLeave={() => sH(false)}
      style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 10, letterSpacing: h ? "3px" : "2.5px", textTransform: "uppercase",
        width: "100%", padding: "16px 24px",
        background: f ? (h ? "#e8e8e8" : T.white) : (h ? T.black : "transparent"),
        color: f ? T.black : (h ? T.white : T.black),
        border: f ? "none" : `1px solid ${T.borderStrong}`,
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        transition: "all 0.3s cubic-bezier(.16,1,.3,1)",
        boxShadow: h && f ? "0 8px 32px rgba(255,255,255,0.15)" : "none",
      }}
    >
      {plan.cta}
      <ArrowRight size={12} style={{ transition: "transform 0.3s", transform: h ? "translateX(4px)" : "none" }} />
    </button>
  );
};

const Pricing = () => (
  <section style={{ background: T.offwhite, padding: "130px 24px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)",
      backgroundSize: "40px 40px" }} />

    <R style={{ textAlign: "center", marginBottom: 80 }}>
      <Label>Planos & Preços</Label>
      <Rule style={{ marginBottom: 40 }} />
      <h2 style={{
        fontFamily: "'Playfair Display', serif", fontWeight: 400,
        fontSize: "clamp(34px,5vw,62px)", color: T.black,
        maxWidth: 680, margin: "0 auto 20px", lineHeight: 1.1,
      }}>
        Escolha o nível<br />
        <em style={{ fontStyle: "italic", opacity: 0.35 }}>da sua arquitetura.</em>
      </h2>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 300,
        fontSize: 15, color: T.muted, maxWidth: 460,
        margin: "0 auto", lineHeight: 1.85,
      }}>
        De criadores solo a agências de alta performance — cada plano foi calibrado para elevar sua entrega ao próximo nível.
      </p>
    </R>

    <div style={{
      display: "flex", gap: 2, justifyContent: "center",
      alignItems: "stretch", flexWrap: "wrap",
      maxWidth: 1080, margin: "0 auto 60px",
    }}>
      {plans.map((plan, i) => <PricingCard key={plan.id} plan={plan} index={i} />)}
    </div>

    {/* bottom note */}
    <R style={{ textAlign: "center" }}>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 300,
        fontSize: 12, color: T.faint, letterSpacing: 0.5,
      }}>
        Todos os planos incluem 7 dias de garantia incondicional. Sem fidelidade. Cancele quando quiser.
      </p>
    </R>
  </section>
);

/* ── ROOT ── */
export default function ArquiteturaEditorialV16() {
  return (
    <div style={{ background: T.white, overflowX: "hidden" }}>
      <FontInjector />
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } html { scroll-behavior: smooth; } body { -webkit-font-smoothing: antialiased; }`}</style>
      <Navbar />
      <Hero />
      <Formula />
      <DualBrain />
      <PresetsSection />
      <MultiFormat />
      <A3Showcase />
      <Social />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
