
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { EditorialDocument, LayoutSettings, SessionPlan, SavedProject } from './types';
import { structureContent, AIWorkflowMode } from './services/geminiService';
import DocumentPreview from './components/DocumentPreview';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { logout, isAuthenticated, verifyToken } from './services/authService';

const html2pdf = (window as any).html2pdf;

type WorkflowStep = 'inicio' | 'entrada-guiada' | 'entrada-livre' | 'entrada-texto' | 'studio';
type StudioTab = 'conteudo' | 'estilo';

const ELITE_COLORS = [
  { name: 'Branco Purista', hex: '#FFFFFF', dark: false },
  { name: 'Preto Absoluto', hex: '#000000', dark: true },
  { name: 'Areia do Deserto', hex: '#F5F5DC', dark: false },
  { name: 'Rosa Minimal', hex: '#FDF2F8', dark: false },
  { name: 'Verde Sereno', hex: '#E8F3E8', dark: false },
  { name: 'Azul Glacial', hex: '#E8F1F5', dark: false },
  { name: 'Cinza Executivo', hex: '#1A1A1A', dark: true },
];

const LAYOUT_PRESETS = {
  'standard': {
    colorBackground: '#ffffff',
    colorText: '#1a1a1a',
    colorTitle: '#000000',
    colorCard: '#f9f9f9',
    colorCardText: '#1a1a1a',
    colorCardAccent: '#003366',
    fontStyle: 'classic',
    fontTitle: 'playfair',
    fontBody: 'inter',
    backgroundPattern: 'none'
  },
  'classic_gold': {
    colorBackground: '#fffaf0',
    colorText: '#1a1a1a',
    colorTitle: '#8a6d3b',
    colorCard: '#ffffff',
    colorCardText: '#1a1a1a',
    colorCardAccent: '#8a6d3b',
    fontStyle: 'classic',
    fontTitle: 'playfair',
    fontBody: 'inter',
    backgroundPattern: 'pontinhos'
  },
  'dark_onyx': {
    colorBackground: '#0a0a0a',
    colorText: '#e0e0e0',
    colorTitle: '#ffffff',
    colorCard: '#1a1a1a',
    colorCardText: '#ffffff',
    colorCardAccent: '#3b82f6',
    fontStyle: 'modern',
    fontTitle: 'syne',
    fontBody: 'montserrat',
    backgroundPattern: 'grid'
  },
  'minimal_sand': {
    colorBackground: '#f5f5dc',
    colorText: '#2d2d2d',
    colorTitle: '#000000',
    colorCard: '#ffffff',
    colorCardText: '#2d2d2d',
    colorCardAccent: '#2d2d2d',
    fontStyle: 'minimal',
    fontTitle: 'inter',
    fontBody: 'inter',
    backgroundPattern: 'none'
  },
  'soft_rose': {
    colorBackground: '#fdf2f8',
    colorText: '#1f1f1f',
    colorTitle: '#9d174d',
    colorCard: '#ffffff',
    colorCardText: '#1f1f1f',
    colorCardAccent: '#9d174d',
    fontStyle: 'modern',
    fontTitle: 'playfair',
    fontBody: 'montserrat',
    backgroundPattern: 'morangos'
  },
  'deep_ocean': {
    colorBackground: '#001b3a',
    colorText: '#e8f1f5',
    colorTitle: '#ffd700',
    colorCard: 'rgba(255,255,255,0.05)',
    colorCardText: '#e8f1f5',
    colorCardAccent: '#ffd700',
    fontStyle: 'modern',
    fontTitle: 'syne',
    fontBody: 'inter',
    backgroundPattern: 'ondas'
  },
  'forest_luxury': {
    colorBackground: '#0b1d12',
    colorText: '#f5f5dc',
    colorTitle: '#ffffff',
    colorCard: 'rgba(255,255,255,0.05)',
    colorCardText: '#f5f5dc',
    colorCardAccent: '#ffffff',
    fontStyle: 'classic',
    fontTitle: 'playfair',
    fontBody: 'inter',
    backgroundPattern: 'pontinhos'
  },
  'minimal_gray': {
    colorBackground: '#f3f4f6',
    colorText: '#111827',
    colorTitle: '#000000',
    colorCard: '#ffffff',
    colorCardText: '#111827',
    colorCardAccent: '#3b82f6',
    fontStyle: 'minimal',
    fontTitle: 'inter',
    fontBody: 'inter',
    backgroundPattern: 'grid'
  },
  'peach_sunset': {
    colorBackground: '#fff1e6',
    colorText: '#432818',
    colorTitle: '#bb4d00',
    colorCard: '#ffffff',
    colorCardText: '#432818',
    colorCardAccent: '#bb4d00',
    fontStyle: 'modern',
    fontTitle: 'syne',
    fontBody: 'montserrat',
    backgroundPattern: 'morangos'
  },
  'modern_obsidian': {
    colorBackground: '#1c1c1c',
    colorText: '#f3f4f6',
    colorTitle: '#ffffff',
    colorCard: 'rgba(255,255,255,0.03)',
    colorCardText: '#ffffff',
    colorCardAccent: '#3b82f6',
    fontStyle: 'modern',
    fontTitle: 'syne',
    fontBody: 'inter',
    backgroundPattern: 'grid'
  },
  'cyber_neo': {
    colorBackground: '#000000',
    colorText: '#00ff41',
    colorTitle: '#00ff41',
    colorCard: 'rgba(0,255,65,0.05)',
    colorCardText: '#00ff41',
    colorCardAccent: '#00ff41',
    fontStyle: 'minimal',
    fontTitle: 'jetbrains',
    fontBody: 'jetbrains',
    backgroundPattern: 'grid'
  },
  'luxury_cream': {
    colorBackground: '#fdfbf7',
    colorText: '#2d2d2d',
    colorTitle: '#b8860b',
    colorCard: '#ffffff',
    colorCardText: '#2d2d2d',
    colorCardAccent: '#b8860b',
    fontStyle: 'classic',
    fontTitle: 'cormorant',
    fontBody: 'montserrat',
    backgroundPattern: 'none'
  }
};

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [showDashboard, setShowDashboard] = useState(false);
  const [step, setStep] = useState<WorkflowStep>('inicio');
  const [studioTab, setStudioTab] = useState<StudioTab>('conteudo');
  const [input, setInput] = useState('');
  const [reference, setReference] = useState('');
  const [doc, setDoc] = useState<EditorialDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSessionIdx, setEditingSessionIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<SavedProject[]>([]);
  const [guidedForm, setGuidedForm] = useState({
    nicho: '',
    publico: '',
    dores: '',
    objetivo: '',
    tomVoz: ''
  });

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    colorBackground: '#ffffff',
    colorText: '#1a1a1a',
    colorTitle: '#000000',
    colorCard: '#f9f9f9',
    colorCardText: '#1a1a1a',
    colorCardAccent: '#000000',
    fontStyle: 'classic',
    fontTitle: 'playfair',
    fontBody: 'inter',
    baseFontSize: 16,
    showCover: true,
    showArchitecture: true,
    showDays: true,
    showFooter: true,
    backgroundPattern: 'none',
    contentDensity: 'elegant',
    companyName: 'STUDIO OS',
    designerSignature: '',
    socialMediaSignature: '',
    agencySignature: '',
    watermarkOpacity: 0.1,
    watermarkGrayscale: true,
    sessionLabelType: 'sessao',
    showObservation: true
  });

  useEffect(() => {
    // Verificar se o token é válido ao montar o componente
    if (authenticated) {
      verifyToken()
        .catch(() => {
          setAuthenticated(false);
        });
    }

    const saved = localStorage.getItem('editorial_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar histórico");
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setShowDashboard(false);
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setShowDashboard(false);
    setDoc(null);
    setStep('inicio');
  };

  const saveToHistory = (newDoc: EditorialDocument, settings: LayoutSettings) => {
    const newProject: SavedProject = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      doc: newDoc,
      settings: settings
    };
    const updatedHistory = [newProject, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('editorial_history', JSON.stringify(updatedHistory));
  };

  const loadFromHistory = (project: SavedProject) => {
    setDoc(project.doc);
    setLayoutSettings(project.settings);
    setStep('studio');
  };

  const handleGenerate = useCallback(async (mode: AIWorkflowMode, customInput?: string) => {
    const textToProcess = customInput || input;
    if (!textToProcess.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const structuredDoc = await structureContent(textToProcess, reference, mode);
      setDoc(structuredDoc);
      saveToHistory(structuredDoc, layoutSettings);
      setStep('studio');
    } catch (err: any) {
      setError(`Erro no processamento: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [input, reference, layoutSettings, history]);

  const updateLayout = (key: keyof LayoutSettings, value: any) => {
    setLayoutSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetKey: string) => {
    const preset = (LAYOUT_PRESETS as any)[presetKey];
    if (preset) {
      setLayoutSettings(prev => ({ ...prev, ...preset, preset: presetKey }));
    }
  };

  const updateDoc = (key: keyof EditorialDocument, value: any) => {
    if (!doc) return;
    setDoc(prev => prev ? ({ ...prev, [key]: value }) : null);
  };

  const updateSession = (idx: number, key: keyof SessionPlan, value: any) => {
    if (!doc) return;
    const newSessions = [...doc.sessions];
    newSessions[idx] = { ...newSessions[idx], [key]: value };
    setDoc({ ...doc, sessions: newSessions });
  };

  const addSession = () => {
    if (!doc || doc.sessions.length >= 20) return;
    const newSession: SessionPlan = {
      session: `SESSÃO 0${doc.sessions.length + 1}`,
      format: 'REELS',
      theme: '',
      strategicIntent: '',
      creativeDirection: '',
      caption: '',
      viewerPsychology: '',
      approachStrategy: '',
      storySuggestions: ['Story 01', 'Story 02', 'Story 03'],
      visualElements: {}
    };
    setDoc({ ...doc, sessions: [...doc.sessions, newSession] });
  };

  const removeSession = (idx: number) => {
    if (!doc || doc.sessions.length <= 1) return;
    const newSessions = doc.sessions.filter((_, i) => i !== idx);
    setDoc({ ...doc, sessions: newSessions });
    if (editingSessionIdx === idx) setEditingSessionIdx(null);
  };

  const exportAsPDF = async () => {
    const element = document.getElementById('editorial-doc');
    if (!element || !doc) return;
    setExporting(true);
    try {
      element.classList.add('pdf-export-mode', 'pdf-mode-a3');
      await new Promise(resolve => setTimeout(resolve, 800));

      const opt = {
        margin: 0,
        filename: `${doc.title.toLowerCase().replace(/\s/g, '-')}-a3-elite.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          windowWidth: 1122, 
          letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      setError('Erro ao exportar PDF.');
    } finally {
      element.classList.remove('pdf-export-mode', 'pdf-mode-a3');
      setExporting(false);
    }
  };

  const resetAll = () => {
    setDoc(null);
    setStep('inicio');
    setInput('');
    setError(null);
  };

  const handleStartManual = () => {
    const emptyDoc: EditorialDocument = {
      title: 'NOVO DOCUMENTO ESTRATÉGICO',
      subtitle: 'SUBTÍTULO DE IMPACTO',
      positionPhrase: 'FRASE DE POSICIONAMENTO AQUI',
      architecture: {
        feeling: '',
        pain: '',
        authority: ''
      },
      sessions: [{
        session: 'SESSÃO 01',
        format: 'REELS',
        theme: '',
        strategicIntent: '',
        creativeDirection: '',
        caption: '',
        viewerPsychology: '',
        approachStrategy: '',
        storySuggestions: ['Story 01', 'Story 02', 'Story 03'],
        visualElements: {}
      }],
      observation: ''
    };
    setDoc(emptyDoc);
    setStep('studio');
  };

  const handleGenerateGuided = () => {
    const prompt = `
      NICHO: ${guidedForm.nicho}
      PÚBLICO-ALVO: ${guidedForm.publico}
      DORES E DESEJOS: ${guidedForm.dores}
      OBJETIVO DA SEMANA: ${guidedForm.objetivo}
      TOM DE VOZ: ${guidedForm.tomVoz}
    `;
    handleGenerate('generative', prompt);
  };

  const renderColorPicker = (label: string, key: keyof LayoutSettings) => (
    <div className="space-y-4">
      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">{label}</label>
      <div className="flex flex-wrap gap-2">
        {ELITE_COLORS.map(color => (
          <button
            key={color.hex}
            onClick={() => {
              updateLayout(key, color.hex);
              // Lógica de contraste automático se for a cor de fundo
              if (key === 'colorBackground') {
                const isDark = color.dark;
                setLayoutSettings(prev => ({
                  ...prev,
                  colorBackground: color.hex,
                  colorText: isDark ? '#FFFFFF' : '#1A1A1A',
                  colorTitle: isDark ? '#FFFFFF' : '#000000',
                  colorCard: isDark ? 'rgba(255,255,255,0.05)' : '#F9F9F9',
                  colorCardText: isDark ? '#FFFFFF' : '#1A1A1A',
                  colorCardAccent: isDark ? '#FFFFFF' : '#000000'
                }));
              }
            }}
            className={`w-8 h-8 rounded-full border transition-all ${layoutSettings[key] === color.hex ? 'ring-2 ring-black ring-offset-2 scale-110' : 'border-gray-100'}`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );

  const renderFontSelector = (label: string, key: keyof LayoutSettings) => (
    <div className="space-y-4">
      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">{label}</label>
      <select 
        value={layoutSettings[key] as string} 
        onChange={(e) => updateLayout(key, e.target.value)}
        className="w-full p-4 text-[10px] font-bold uppercase tracking-widest border border-gray-100 bg-gray-50 outline-none"
      >
        <option value="playfair">Playfair Display (Serif)</option>
        <option value="syne">Syne (Modern)</option>
        <option value="inter">Inter (Sans)</option>
        <option value="montserrat">Montserrat</option>
        <option value="caveat">Caveat (Handwriting)</option>
        <option value="cormorant">Cormorant Garamond</option>
        <option value="jetbrains">JetBrains Mono</option>
      </select>
    </div>
  );

  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a]">
      <header className="no-print h-20 border-b border-gray-100 bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={resetAll} className="serif text-2xl font-bold italic tracking-tight">Arquitetura Editorial</button>
          <span className="text-[9px] font-bold text-gray-300 tracking-[0.4em] mt-1 uppercase">ESTÚDIO ELITE V16</span>
        </div>

        {doc && (
          <div className="flex items-center gap-6">
            <button
              onClick={resetAll}
              className="text-[10px] font-bold uppercase tracking-widest text-black border border-black/10 px-6 py-2.5 hover:bg-gray-50 transition-all"
            >
              NOVO PROJETO
            </button>
            <div className="w-px h-6 bg-gray-100" />
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded border border-gray-100">
              <span className="text-[9px] font-bold uppercase text-gray-400">FORMATO:</span>
              <span className="text-[10px] font-bold uppercase text-black">A3 ESTRATÉGICO</span>
            </div>
            <button
              onClick={exportAsPDF}
              disabled={exporting}
              className="px-12 py-3.5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl disabled:bg-gray-400"
            >
              {exporting ? 'GERANDO PDF...' : 'EXPORTAR EM A3'}
            </button>
          </div>
        )}
      </header>

      <main className="flex h-[calc(100vh-5rem)]">
        <aside className="no-print w-full md:w-[500px] border-r border-gray-100 bg-white flex flex-col overflow-y-auto">
          {step === 'inicio' && (
            <div className="p-10 space-y-12 animate-in fade-in duration-500">
              <div className="space-y-4">
                <h2 className="serif text-4xl font-light italic">Seja bem-vindo.</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] leading-relaxed">Transforme estratégia bruta em design irrefutável.</p>
              </div>
              
              {history.length > 0 && (
                <div className="space-y-5">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300">PROJETOS RECENTES</h3>
                  <div className="space-y-3">
                    {history.map(project => (
                      <div 
                        key={project.id} 
                        onClick={() => loadFromHistory(project)}
                        className="p-5 border border-gray-100 bg-gray-50/50 hover:border-black cursor-pointer transition-all flex justify-between items-center group"
                      >
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest group-hover:underline">{project.doc.title}</p>
                          <p className="text-[8px] text-gray-400 uppercase font-bold">{new Date(project.timestamp).toLocaleString('pt-BR')}</p>
                        </div>
                        <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-all">ABRIR →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5">
                <button onClick={() => setStep('entrada-guiada')} className="group p-10 border border-gray-100 text-left hover:border-black transition-all hover:shadow-2xl bg-gray-50/50">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300 group-hover:text-black mb-6 block">FLUXO GUIADO</span>
                  <h3 className="serif text-2xl font-bold italic mb-3">FORMULÁRIO ESTRATÉGICO</h3>
                  <p className="text-xs font-light text-gray-500 leading-relaxed">Responda 5 perguntas e deixe a engenharia de prompt invisível agir.</p>
                </button>
                <button onClick={() => setStep('entrada-livre')} className="group p-10 border border-gray-100 text-left hover:border-black transition-all hover:shadow-2xl bg-gray-50/50">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300 group-hover:text-black mb-6 block">FLUXO CRIATIVO</span>
                  <h3 className="serif text-2xl font-bold italic mb-3">GERAR COM TEXTO LIVRE</h3>
                  <p className="text-xs font-light text-gray-500 leading-relaxed">Explique sua ideia em um text solto e a IA arquiteta o plano.</p>
                </button>
                <button onClick={() => setStep('entrada-texto')} className="group p-10 border border-gray-100 text-left hover:border-black transition-all hover:shadow-2xl bg-gray-50/50">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300 group-hover:text-black mb-6 block">FLUXO TÉCNICO</span>
                  <h3 className="serif text-2xl font-bold italic mb-3">FORMATAR MEU TEXTO</h3>
                  <p className="text-xs font-light text-gray-500 leading-relaxed">Já tem o conteúdo? Organizamos ele no layout de agência elite.</p>
                </button>
                <button onClick={handleStartManual} className="group p-10 border-2 border-dashed border-gray-200 text-left hover:border-black hover:bg-black/5 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/40 group-hover:text-black mb-6 block">FLUXO EXPRESSO</span>
                  <h3 className="serif text-2xl font-bold italic mb-3">CRIAR DO ZERO</h3>
                  <p className="text-xs font-light text-gray-400 leading-relaxed">Modo direto. Crie e edite seu planejamento em tempo real.</p>
                </button>
              </div>
            </div>
          )}

          {step === 'entrada-guiada' && (
            <div className="p-10 space-y-10 animate-in slide-in-from-left duration-500 pb-20">
              <button onClick={() => setStep('inicio')} className="text-[10px] font-black uppercase text-gray-400 hover:text-black flex items-center gap-2 tracking-widest">← VOLTAR AO INÍCIO</button>
              
              <div className="space-y-6">
                <h2 className="serif text-4xl italic">Formulário Estratégico</h2>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">1. NICHO: O que você faz?</label>
                    <input type="text" value={guidedForm.nicho} onChange={e => setGuidedForm({...guidedForm, nicho: e.target.value})} className="w-full p-4 text-sm bg-gray-50 border border-gray-100 outline-none" placeholder="Ex: Mentoria para mulheres..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">2. PÚBLICO: Para quem você fala?</label>
                    <input type="text" value={guidedForm.publico} onChange={e => setGuidedForm({...guidedForm, publico: e.target.value})} className="w-full p-4 text-sm bg-gray-50 border border-gray-100 outline-none" placeholder="Ex: Empresárias de sucesso..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">3. DORES E DESEJOS: O que tira o sono e o que ele quer?</label>
                    <textarea value={guidedForm.dores} onChange={e => setGuidedForm({...guidedForm, dores: e.target.value})} className="w-full h-24 p-4 text-sm bg-gray-50 border border-gray-100 outline-none resize-none" placeholder="..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">4. OBJETIVO: O que quer vender essa semana?</label>
                    <input type="text" value={guidedForm.objetivo} onChange={e => setGuidedForm({...guidedForm, objetivo: e.target.value})} className="w-full p-4 text-sm bg-gray-50 border border-gray-100 outline-none" placeholder="..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">5. TOM DE VOZ: Personalidade da marca</label>
                    <input type="text" value={guidedForm.tomVoz} onChange={e => setGuidedForm({...guidedForm, tomVoz: e.target.value})} className="w-full p-4 text-sm bg-gray-50 border border-gray-100 outline-none" placeholder="Ex: Luxuoso, Direto, Acolhedor..." />
                  </div>
                </div>

                <div className="p-6 bg-black text-white space-y-4">
                  <h4 className="text-[9px] font-black tracking-[0.4em] uppercase opacity-40">COMO O FORMULÁRIO FUNCIONA</h4>
                  <p className="text-[11px] font-light leading-relaxed opacity-80">
                    O Formulário Guiado funciona como uma ferramenta de "engenharia de prompt" simplificada para você. Em vez de você precisar escrever um texto longo explicando o que quer, o formulário segmenta as informações estratégicas que a Inteligência Artificial precisa para criar um planejamento de alta conversão.
                  </p>
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-bold">Aqui está o passo a passo:</p>
                    <ul className="text-[10px] space-y-2 opacity-60 italic">
                      <li>• Coleta de Dados Estratégicos (os 5 pilares fundamentais).</li>
                      <li>• Construção do Prompt (Engenharia Invisível com as Regras de Ouro).</li>
                      <li>• Processamento pela IA (Gerando estratégia visual e textual).</li>
                      <li>• Entrega Estruturada diretamente no Estúdio Elite.</li>
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={handleGenerateGuided} 
                  disabled={loading || !guidedForm.nicho} 
                  className="w-full py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl disabled:bg-gray-200 transition-all"
                >
                  {loading ? 'ARQUITETANDO...' : 'GERAR PLANEJAMENTO'}
                </button>
              </div>
            </div>
          )}

          {step === 'entrada-livre' && (
            <div className="p-10 space-y-10 animate-in slide-in-from-left duration-500">
              <button onClick={() => setStep('inicio')} className="text-[10px] font-black uppercase text-gray-400 hover:text-black flex items-center gap-2 tracking-widest">← VOLTAR AO INÍCIO</button>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="serif text-4xl italic">Texto Livre</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Explique sua ideia de forma aberta</p>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escreva seu briefing aqui de forma livre..." className="w-full h-[400px] p-8 text-sm bg-gray-50 border border-gray-100 outline-none resize-none font-light leading-relaxed shadow-inner" />
                <button onClick={() => handleGenerate('generative')} disabled={loading || !input.trim()} className="w-full py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl disabled:bg-gray-200 transition-all">
                  {loading ? 'ARQUITETANDO...' : 'GERAR PLANEJAMENTO'}
                </button>
              </div>
            </div>
          )}

          {step === 'entrada-texto' && (
            <div className="p-10 space-y-10 animate-in slide-in-from-left duration-500">
              <button onClick={() => setStep('inicio')} className="text-[10px] font-black uppercase text-gray-400 hover:text-black flex items-center gap-2 tracking-widest">← VOLTAR AO INÍCIO</button>
              <div className="space-y-6">
                <h2 className="serif text-4xl italic">Colar Planejamento</h2>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Cole seu planejamento pronto aqui apenas para formatar..." className="w-full h-[400px] p-8 text-sm bg-gray-50 border border-gray-100 outline-none resize-none font-light leading-relaxed shadow-inner" />
                <button onClick={() => handleGenerate('structural')} disabled={loading || !input.trim()} className="w-full py-6 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl disabled:bg-gray-200 transition-all">
                  {loading ? 'ARQUITETANDO...' : 'GERAR PLANEJAMENTO'}
                </button>
              </div>
            </div>
          )}

          {step === 'studio' && doc && (
            <div className="flex flex-col h-full bg-white">
              <nav className="flex border-b border-gray-100 bg-gray-50">
                <button onClick={() => setStudioTab('conteudo')} className={`flex-1 py-6 text-[10px] font-bold uppercase tracking-[0.2em] relative ${studioTab === 'conteudo' ? 'bg-white text-black' : 'text-gray-400'}`}>
                  1. CONTEÚDO
                </button>
                <button onClick={() => setStudioTab('estilo')} className={`flex-1 py-6 text-[10px] font-bold uppercase tracking-[0.2em] relative ${studioTab === 'estilo' ? 'bg-white text-black' : 'text-gray-400'}`}>
                  2. PERSONALIZAÇÃO
                </button>
              </nav>

              <div className="p-8 flex-1 overflow-y-auto space-y-12">
                {studioTab === 'conteudo' && (
                  <div className="space-y-10">
                     <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">TÍTULO PRINCIPAL</label>
                      <input type="text" value={doc.title} onChange={(e) => updateDoc('title', e.target.value)} className="w-full p-4 text-xs border bg-gray-50 font-bold uppercase tracking-widest outline-none" />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">RÓTULO DAS SESSÕES</label>
                      <select 
                        value={layoutSettings.sessionLabelType} 
                        onChange={(e) => updateLayout('sessionLabelType', e.target.value)}
                        className="w-full p-4 text-[10px] font-bold uppercase tracking-widest border border-gray-100 bg-gray-50 outline-none"
                      >
                        <option value="sessao">SESSÃO</option>
                        <option value="dia">DIA</option>
                        <option value="post">POST</option>
                        <option value="sequencia">SEQUÊNCIA</option>
                        <option value="aula">AULA</option>
                        <option value="modulo">MÓDULO</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">SUBTÍTULO / PROMESSA</label>
                      <input type="text" value={doc.subtitle} onChange={(e) => updateDoc('subtitle', e.target.value)} className="w-full p-4 text-xs border bg-gray-50 outline-none" />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">FRASE DE POSICIONAMENTO</label>
                      <input type="text" value={doc.positionPhrase} onChange={(e) => updateDoc('positionPhrase', e.target.value)} className="w-full p-4 text-xs border bg-gray-50 outline-none" />
                    </div>

                    <div className="p-6 bg-gray-50 space-y-6 border border-gray-100">
                       <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">ARQUITETURA ESTRATÉGICA</label>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-gray-400 uppercase">ATMOSFERA (FEELING)</label>
                             <input type="text" value={doc.architecture.feeling} onChange={(e) => updateDoc('architecture', { ...doc.architecture, feeling: e.target.value })} className="w-full p-3 text-[10px] border" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-gray-400 uppercase">FOCO DE DOR</label>
                             <input type="text" value={doc.architecture.pain} onChange={(e) => updateDoc('architecture', { ...doc.architecture, pain: e.target.value })} className="w-full p-3 text-[10px] border" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-gray-400 uppercase">AUTORIDADE</label>
                             <input type="text" value={doc.architecture.authority} onChange={(e) => updateDoc('architecture', { ...doc.architecture, authority: e.target.value })} className="w-full p-3 text-[10px] border" />
                          </div>
                       </div>
                    </div>


                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">SESSÕES DO PLANEJAMENTO</label>
                        <button 
                          onClick={addSession}
                          disabled={doc.sessions.length >= 20}
                          className="text-[9px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-all disabled:opacity-30"
                        >
                          + ADICIONAR SESSÃO
                        </button>
                      </div>
                      {doc.sessions.map((session, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-sm overflow-hidden mb-2">
                          <div className={`flex items-center ${editingSessionIdx === idx ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}>
                            <button 
                              onClick={() => setEditingSessionIdx(editingSessionIdx === idx ? null : idx)} 
                              className="flex-1 p-5 text-left text-[11px] font-bold flex justify-between transition-all"
                            >
                              <span>S{idx + 1 < 10 ? `0${idx + 1}` : idx + 1} • {session.session}</span>
                              <span className="opacity-40">{editingSessionIdx === idx ? '−' : '+'}</span>
                            </button>
                            {doc.sessions.length > 1 && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeSession(idx); }}
                                className={`px-4 py-5 text-[10px] opacity-30 hover:opacity-100 transition-all ${editingSessionIdx === idx ? 'text-white' : 'text-black'}`}
                                title="Remover Sessão"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          {editingSessionIdx === idx && (
                            <div className="p-6 bg-gray-50 space-y-6 animate-in slide-in-from-top duration-300">
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <label className="text-[8px] font-bold text-gray-400 uppercase">FORMATO</label>
                                      <select 
                                        value={session.format} 
                                        onChange={(e) => updateSession(idx, 'format', e.target.value)} 
                                        className="w-full p-3 text-[10px] border text-black bg-white font-bold uppercase tracking-widest outline-none"
                                      >
                                        <option value="REELS">REELS</option>
                                        <option value="CARROSSEL">CARROSSEL</option>
                                        <option value="POST">POST (ESTÁTICO)</option>
                                        <option value="FOTO">FOTO / IMAGEM</option>
                                        <option value="MEME">MEME</option>
                                      </select>
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-[8px] font-bold text-gray-400 uppercase">TEMA</label>
                                      <input type="text" value={session.theme} onChange={(e) => updateSession(idx, 'theme', e.target.value)} className="w-full p-3 text-[10px] border text-black" />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[8px] font-bold text-gray-400 uppercase">INTENÇÃO ESTRATÉGICA</label>
                                  <input type="text" value={session.strategicIntent} onChange={(e) => updateSession(idx, 'strategicIntent', e.target.value)} className="w-full p-3 text-[10px] border text-black" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[8px] font-bold text-gray-400 uppercase">BRIEFING CRIATIVO</label>
                                  <textarea value={session.creativeDirection} onChange={(e) => updateSession(idx, 'creativeDirection', e.target.value)} className="w-full h-24 p-3 text-[10px] border text-black" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[8px] font-bold text-gray-400 uppercase">SUGESTÕES DE STORIES (UM POR LINHA)</label>
                                  <textarea 
                                    value={session.storySuggestions.join('\n')} 
                                    onChange={(e) => updateSession(idx, 'storySuggestions', e.target.value.split('\n'))} 
                                    className="w-full h-24 p-3 text-[10px] border text-black" 
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[8px] font-bold text-gray-400 uppercase">LEGENDA</label>
                                  <textarea value={session.caption} onChange={(e) => updateSession(idx, 'caption', e.target.value)} className="w-full h-48 p-4 text-xs border bg-white outline-none font-light leading-relaxed text-black" />
                               </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">VEREDITO / OBSERVAÇÃO FINAL</label>
                        <div className="flex items-center gap-2">
                           <label className="text-[8px] font-bold text-gray-400 uppercase">MOSTRAR</label>
                           <input 
                            type="checkbox" 
                            checked={layoutSettings.showObservation} 
                            onChange={e => updateLayout('showObservation', e.target.checked)}
                            className="w-4 h-4 cursor-pointer"
                           />
                        </div>
                      </div>
                      <textarea value={doc.observation} onChange={(e) => updateDoc('observation', e.target.value)} className="w-full h-32 p-4 text-xs border bg-gray-50 outline-none font-light leading-relaxed" />
                    </div>
                  </div>
                )}

                {studioTab === 'estilo' && (
                  <div className="space-y-12 pb-20">
                    <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">ESTILOS PREDEFINIDOS</label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(LAYOUT_PRESETS).map(([id, p]) => (
                          <button
                            key={id}
                            onClick={() => applyPreset(id)}
                            className={`p-4 border text-[9px] font-bold tracking-widest transition-all text-left flex flex-col gap-2 ${layoutSettings.preset === id ? 'border-black bg-black text-white shadow-xl' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'}`}
                          >
                            <span className="uppercase">{id}</span>
                            <div className="flex gap-1">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.colorBackground }}></div>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.colorTitle }}></div>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.colorCardAccent }}></div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 border border-gray-100 bg-gray-50/50 space-y-8">
                       <h4 className="text-[10px] font-bold uppercase tracking-[0.4em]">IDENTIDADE E MARCA</h4>
                       <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">NOME DA EMPRESA (FOOTER)</label>
                            <input type="text" value={layoutSettings.companyName} onChange={e => updateLayout('companyName', e.target.value)} className="w-full p-4 text-[10px] border outline-none font-bold" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <label className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">ASSINATURA DESIGNER</label>
                              <input type="text" value={layoutSettings.designerSignature} onChange={e => updateLayout('designerSignature', e.target.value)} className="w-full p-4 text-[10px] border outline-none" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">ASSINATURA S.M.</label>
                              <input type="text" value={layoutSettings.socialMediaSignature} onChange={e => updateLayout('socialMediaSignature', e.target.value)} className="w-full p-4 text-[10px] border outline-none" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">URL MARCA D'ÁGUA (IMAGEM)</label>
                            <input type="text" value={layoutSettings.watermarkImage} onChange={e => updateLayout('watermarkImage', e.target.value)} className="w-full p-4 text-[10px] border outline-none font-mono" placeholder="https://..." />
                          </div>
                       </div>
                    </div>

                     <div className="space-y-8">
                        <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">PALETA ESTRATÉGICA</label>
                        <div className="grid grid-cols-1 gap-8">
                           {renderColorPicker('Cor de Fundo (Papel)', 'colorBackground')}
                           {renderColorPicker('Cor do Texto Geral', 'colorText')}
                           {renderColorPicker('Cor dos Títulos (Destaque)', 'colorTitle')}
                           <div className="h-px bg-gray-100 my-4" />
                           {renderColorPicker('Fundo dos Cards', 'colorCard')}
                           {renderColorPicker('Texto dentro dos Cards', 'colorCardText')}
                           {renderColorPicker('Destaque dos Cards', 'colorCardAccent')}
                        </div>
                     </div>

                    <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">ESTILO DO CONJUNTO</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'classic', label: 'CLÁSSICO' },
                          { id: 'modern', label: 'MODERNO' },
                          { id: 'minimal', label: 'MINIMAL' }
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => updateLayout('fontStyle', st.id)}
                            className={`py-4 border text-[9px] font-bold transition-all ${layoutSettings.fontStyle === st.id ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                       {renderFontSelector('Fonte dos Títulos', 'fontTitle')}
                       {renderFontSelector('Fonte do Corpo', 'fontBody')}
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">PADRÃO DE FUNDO</label>
                      <select 
                        value={layoutSettings.backgroundPattern} 
                        onChange={(e) => updateLayout('backgroundPattern', e.target.value)}
                        className="w-full p-4 text-[10px] font-bold uppercase tracking-widest border border-gray-100 bg-gray-50 outline-none"
                      >
                        <option value="none">SÓLIDO (SEM PADRÃO)</option>
                        <option value="morangos">DIAGONAIS SUTIS</option>
                        <option value="pontinhos">PONTINHOS MINIMALISTAS</option>
                        <option value="grid">GRID TÉCNICO</option>
                        <option value="ondas">ONDAS DINÂMICAS</option>
                      </select>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">DENSIDADE DO CONTEÚDO</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'compact', label: 'COMPACTO' },
                          { id: 'elegant', label: 'ELEGANTE' },
                          { id: 'spacious', label: 'ESPAÇADO' }
                        ].map(d => (
                          <button
                            key={d.id}
                            onClick={() => updateLayout('contentDensity', d.id)}
                            className={`py-4 border text-[9px] font-bold transition-all ${layoutSettings.contentDensity === d.id ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">ESCALA DA FONTE</label>
                          <span className="text-[10px] font-bold">{layoutSettings.baseFontSize}px</span>
                       </div>
                       <input 
                          type="range" min="12" max="24" step="1" 
                          value={layoutSettings.baseFontSize} 
                          onChange={e => updateLayout('baseFontSize', parseInt(e.target.value))}
                          className="w-full h-1 bg-gray-100 appearance-none outline-none cursor-pointer"
                       />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>

        <section className="flex-1 bg-gray-100/40 p-12 overflow-y-auto flex justify-center items-start">
          {doc ? (
            <div className="w-full max-w-5xl shadow-2xl">
              <DocumentPreview doc={doc} settings={layoutSettings} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <h4 className="serif text-4xl italic">Agência de Elite</h4>
              <p className="text-[10px] font-bold uppercase tracking-[0.8em] mt-8">SELECIONE UM FLUXO PARA COMEÇAR</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
