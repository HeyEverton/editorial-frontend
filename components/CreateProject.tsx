import React, { useState, useCallback, useEffect } from 'react';
import { EditorialDocument, LayoutSettings, SessionPlan, SavedProject } from '../types';
import { structureContent, AIWorkflowMode } from '../services/geminiService';
import DocumentPreview from './DocumentPreview';

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

const CreateProject: React.FC = () => {
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
    const saved = localStorage.getItem('editorial_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar histórico");
      }
    }
  }, []);

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

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] dark:bg-elite-black transition-colors duration-500 overflow-hidden relative">
      <main className="flex flex-1 overflow-hidden h-full">
        {/* Painel Lateral de Edição */}
        <aside className="no-print w-full md:w-[500px] border-r border-gray-100 dark:border-white/5 bg-white dark:bg-elite-dark flex flex-col overflow-y-auto">
          {step === 'inicio' && (
            <div className="p-10 space-y-12 animate-in fade-in duration-500">
               <div className="space-y-4">
                 <h2 className="serif text-6xl font-light italic text-black dark:text-white leading-tight">Seja bem-vindo.</h2>
                 <p className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                   Transforme estratégia bruta em design irrefutável.
                 </p>
               </div>
               
               {history.length > 0 && (
                <div className="space-y-5">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300">PROJETOS RECENTES</h3>
                  <div className="space-y-3">
                    {history.map(project => (
                      <div 
                        key={project.id} 
                        onClick={() => loadFromHistory(project)}
                        className="p-5 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:border-black dark:hover:border-white/20 cursor-pointer transition-all flex justify-between items-center group"
                      >
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest group-hover:underline text-black dark:text-white">{project.doc.title}</p>
                          <p className="text-[8px] text-gray-400 uppercase font-bold">{new Date(project.timestamp).toLocaleString('pt-BR')}</p>
                        </div>
                        <span className="text-[9px] text-black dark:text-white opacity-0 group-hover:opacity-100 transition-all">ABRIR →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 pb-20">
                {[
                    { id: 'entrada-guiada', label: 'FLUXO GUIADO', title: 'FORMULÁRIO ESTRATÉGICO', desc: 'Responda 5 perguntas e deixe a engenharia de prompt invisível agir.' },
                    { id: 'entrada-livre', label: 'FLUXO CRIATIVO', title: 'GERAR COM TEXTO LIVRE', desc: 'Explique sua ideia em um text solto e a IA arquiteta o plano.' },
                    { id: 'entrada-texto', label: 'FLUXO TÉCNICO', title: 'FORMATAR MEU TEXTO', desc: 'Já tem o conteúdo? Organizamos ele no layout de agência elite.' }
                ].map(flow => (
                    <button key={flow.id} onClick={() => setStep(flow.id as WorkflowStep)} className="group p-10 border border-gray-100 dark:border-white/5 text-left hover:border-black dark:hover:border-white/20 transition-all hover:shadow-2xl bg-gray-50/50 dark:bg-white/5">
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-300 dark:text-white/30 group-hover:text-black dark:group-hover:text-white mb-6 block">{flow.label}</span>
                        <h3 className="serif text-2xl font-bold italic mb-3 text-black dark:text-white">{flow.title}</h3>
                        <p className="text-xs font-light text-gray-500 dark:text-white/40 leading-relaxed">{flow.desc}</p>
                    </button>
                ))}
                
                <button onClick={handleStartManual} className="group p-10 border-2 border-dashed border-gray-200 dark:border-white/10 text-left hover:border-black dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/40 dark:text-white/30 group-hover:text-black dark:group-hover:text-white mb-6 block">FLUXO EXPRESSO</span>
                  <h3 className="serif text-2xl font-bold italic mb-3 text-black dark:text-white">CRIAR DO ZERO</h3>
                  <p className="text-xs font-light text-gray-400 dark:text-white/40 leading-relaxed">Modo direto. Crie e edite seu planejamento em tempo real.</p>
                </button>
              </div>
            </div>
          )}

          {step === 'studio' && doc && (
            <div className="flex flex-col h-full bg-white dark:bg-elite-dark transition-colors duration-500">
              <nav className="flex border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-elite-gray">
                <button onClick={() => setStudioTab('conteudo')} className={`flex-1 py-6 text-[10px] font-bold uppercase tracking-[0.2em] relative transition-colors ${studioTab === 'conteudo' ? 'bg-white dark:bg-white/5 text-black dark:text-white' : 'text-gray-400'}`}>
                  1. CONTEÚDO
                </button>
                <button onClick={() => setStudioTab('estilo')} className={`flex-1 py-6 text-[10px] font-bold uppercase tracking-[0.2em] relative transition-colors ${studioTab === 'estilo' ? 'bg-white dark:bg-white/5 text-black dark:text-white' : 'text-gray-400'}`}>
                  2. PERSONALIZAÇÃO
                </button>
              </nav>

              <div className="p-8 flex-1 overflow-y-auto space-y-12">
                 {studioTab === 'conteudo' && (
                     <div className="space-y-10">
                        {/* Campos de Conteúdo */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 dark:text-white/30">TÍTULO PRINCIPAL</label>
                            <input type="text" value={doc.title} onChange={(e) => updateDoc('title', e.target.value)} className="w-full p-4 text-xs border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 dark:text-white font-bold uppercase tracking-widest outline-none" />
                        </div>
                        {/* Outros campos... (Simplificado para o fix) */}
                        <div className="p-6 bg-gray-50 dark:bg-white/5 space-y-6 border border-gray-100 dark:border-white/10">
                           <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 dark:text-white/30">ARQUITETURA ESTRATÉGICA</label>
                           <div className="space-y-4">
                              {['feeling', 'pain', 'authority'].map((f) => (
                                <div key={f} className="space-y-2">
                                   <label className="text-[8px] font-black text-gray-400 uppercase">{f}</label>
                                   <input type="text" value={(doc.architecture as any)[f]} onChange={(e) => updateDoc('architecture', { ...doc.architecture, [f]: e.target.value })} className="w-full p-3 text-[10px] border border-gray-100 dark:border-white/10 dark:bg-elite-dark dark:text-white" />
                                </div>
                              ))}
                           </div>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300 dark:text-white/30">SESSÕES</label>
                                <button onClick={addSession} className="text-[9px] font-bold uppercase tracking-widest text-black dark:text-white border border-black dark:border-white px-3 py-1 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
                                    + ADICIONAR
                                </button>
                            </div>
                            {doc.sessions.map((s, idx) => (
                                <div key={idx} className="border border-gray-100 dark:border-white/10 rounded-sm overflow-hidden mb-2">
                                     <button onClick={() => setEditingSessionIdx(editingSessionIdx === idx ? null : idx)} className={`w-full p-5 text-left text-[11px] font-bold flex justify-between transition-all ${editingSessionIdx === idx ? 'bg-black text-white' : 'bg-white dark:bg-elite-dark dark:text-white'}`}>
                                        <span>S{idx + 1} • {s.session}</span>
                                        <span>{editingSessionIdx === idx ? '−' : '+'}</span>
                                     </button>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}

                 {studioTab === 'estilo' && (
                     <div className="space-y-12 pb-20">
                          {/* Presets e Pickers */}
                          <div className="p-10 bg-black dark:bg-white/5 text-white space-y-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em]">PRESETS CURADOS</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {Object.keys(LAYOUT_PRESETS).map(key => (
                                    <button key={key} onClick={() => applyPreset(key)} className={`p-4 border text-[9px] font-bold uppercase tracking-widest transition-all ${layoutSettings.preset === key ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`}>
                                        {key.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                          </div>
                          {renderColorPicker('Fundo', 'colorBackground')}
                          {renderFontSelector('Título', 'fontTitle')}
                     </div>
                 )}
              </div>
            </div>
          )}
          
          {(step === 'entrada-guiada' || step === 'entrada-livre' || step === 'entrada-texto') && (
            <div className="p-10 space-y-10 animate-in slide-in-from-left duration-500 pb-20">
                <button onClick={() => setStep('inicio')} className="text-[10px] font-black uppercase text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-2 tracking-widest">← VOLTAR</button>
                <textarea 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    className="w-full h-96 p-8 bg-gray-50 dark:bg-white/5 dark:text-white border border-gray-100 dark:border-white/10 outline-none"
                    placeholder="Briefing..."
                />
                <button onClick={() => handleGenerate(step === 'entrada-texto' ? 'structural' : 'generative')} disabled={loading} className="w-full py-6 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest shadow-2xl disabled:opacity-30 transition-all">
                    {loading ? 'ARQUITETANDO...' : 'GERAR'}
                </button>
            </div>
          )}
        </aside>

        {/* Preview Area */}
        <section className="flex-1 bg-[#f0f0f0] dark:bg-elite-black overflow-y-auto p-12 transition-colors duration-500 relative scroll-smooth">
            {/* Header Flutuante de Projeto */}
            <div className="sticky top-0 right-0 w-full flex justify-between items-center mb-12 z-10">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">PROJETO ATIVO</span>
                    {doc && <h3 className="serif text-xl italic text-black dark:text-white opacity-80">{doc.title}</h3>}
                </div>
                {doc && (
                    <div className="flex items-center gap-6">
                        <button
                            onClick={resetAll}
                            className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white border border-black/10 dark:border-white/10 px-6 py-2.5 hover:bg-white dark:hover:bg-white/10 transition-all bg-white/50 dark:bg-white/5"
                        >
                            NOVO PROJETO
                        </button>
                        <button
                            onClick={exportAsPDF}
                            disabled={exporting}
                            className="px-12 py-3.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-80 transition-all shadow-2xl disabled:opacity-30"
                        >
                            {exporting ? 'GERANDO PDF...' : 'EXPORTAR'}
                        </button>
                    </div>
                )}
            </div>

            {doc ? (
                <div className="max-w-4xl mx-auto shadow-2xl dark:shadow-none bg-white">
                    <DocumentPreview doc={doc} settings={layoutSettings} />
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000">
                    <div className="serif text-[200px] italic text-black/5 dark:text-white/5">E</div>
                    <div className="space-y-4">
                        <h3 className="serif text-4xl italic text-black/10 dark:text-white/10 tracking-widest">Agência de Elite</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20 dark:text-white/10">SELECIONE UM FLUXO PARA COMEÇAR</p>
                    </div>
                    
                    <div className="flex gap-12 pt-10 opacity-20 dark:opacity-10">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl">✨</span>
                            <span className="text-[8px] font-black tracking-widest uppercase text-black dark:text-white">INTELIGÊNCIA</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl">🔳</span>
                            <span className="text-[8px] font-black tracking-widest uppercase text-black dark:text-white">ESTRUTURA</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl">🖋️</span>
                            <span className="text-[8px] font-black tracking-widest uppercase text-black dark:text-white">REDAÇÃO</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
      </main>

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 px-8 py-4 border border-red-200 text-[10px] font-bold uppercase tracking-widest z-[100] shadow-2xl">
           {error}
           <button onClick={() => setError(null)} className="ml-4 font-black">✕</button>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
