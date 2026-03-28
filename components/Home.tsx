import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="min-h-full bg-[#fcfcfc] dark:bg-elite-black transition-colors duration-500">
            <div className="p-12 space-y-16 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Boas Vindas */}
                <header className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">VISÃO GERAL DO WORKSPACE</span>
                        <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="serif text-7xl italic font-light tracking-tighter text-black dark:text-white leading-tight">Seja bem-vindo,</h1>
                        <h1 className="serif text-7xl italic font-light tracking-tighter text-black dark:text-white leading-tight opacity-90">Seu acervo está em dia.</h1>
                    </div>
                    <div className="h-px w-40 bg-black/10 dark:bg-white/10 mt-8" />
                </header>

                {/* Grid de Métricas -- MODO ELITE */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: "TOTAL DE PROJETOS", value: "12", suffix: "Projetos ativos no diretório", icon: "" },
                      { label: "ÚLTIMO PROJETO ALTERADO", value: "Relatório Trimestral - Setembro", suffix: "Editado há 2 horas", icon: "", isSmall: true },
                      { label: "TOTAL DE TOKENS", value: "4.500UN", suffix: "Consumo mensal equilibrado", icon: "" },
                    ].map((stat, i) => (
                      <div key={i} className="p-6 border border-gray-100 dark:border-white/5 bg-white dark:bg-elite-gray hover:border-black dark:hover:border-white/20 transition-all group relative">
                        <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                            <span className="text-sm">{stat.icon}</span>
                        </div>
                        <div className="space-y-6">
                            <p className="text-[8px] font-black text-gray-300 dark:text-white/30 tracking-[0.4em] uppercase group-hover:text-black dark:group-hover:text-white transition-colors leading-relaxed">{stat.label}</p>
                            <h2 className={`serif italic font-bold tracking-tight text-black dark:text-white leading-none ${stat.isSmall ? 'text-lg' : 'text-4xl'}`}>{stat.value}</h2>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em]">{stat.suffix}</p>
                        </div>
                      </div>
                    ))}

                    {/* Card de Destaque - Próxima Renovação (SEMPRE BRANCO NO DARK MODE CONFORME PRINT) */}
                    <div className="p-8 bg-white border border-gray-100 dark:border-white/10 flex flex-col justify-between shadow-xl">
                        <div className="flex justify-between items-start">
                            <p className="text-[8px] font-black text-gray-400 tracking-[0.4em] uppercase">PRÓXIMA RENOVAÇÃO</p>
                        </div>
                        <div className="space-y-1 py-4">
                            <h2 className="serif text-4xl font-bold tracking-tight text-black">15 de Outubro, 2026</h2>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">Plano Anual Editorial Plus</p>
                    </div>
                </div>

                {/* Seção Central - Manuscritos Recentes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-10">
                        <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-6">
                            <h3 className="serif text-3xl italic text-black dark:text-white">Manuscritos Recentes</h3>
                            <button className="text-[9px] font-black tracking-[0.3em] text-gray-400 hover:text-black dark:hover:text-white transition-colors">VER GALERIA COMPLETA</button>
                        </div>

                        <div className="space-y-12">
                            {[
                                { title: "Anuário de Design 2024", category: "EDITORIA DE LUXO", desc: "Uma exploração tipográfica sobre a evolução do design industrial no século XXI.", pages: "120 PÁGINAS", format: "PDF, EPUB" },
                                { title: "Impacto Ambiental Sustentável", category: "RELATÓRIO ESTRATÉGICO", desc: "Análise técnica e curadoria visual sobre iniciativas de ESG em mercados emergentes.", pages: "45 PÁGINAS", format: "PDF" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-8 group cursor-pointer items-center">
                                    <div className="w-32 h-44 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-2 transform group-hover:-translate-y-2 transition-transform duration-500 shadow-sm group-hover:shadow-2xl">
                                        <div className="w-full h-full border border-gray-100 dark:border-white/5 bg-white dark:bg-transparent flex items-center justify-center">
                                            <span className="serif italic text-black dark:text-white opacity-20">EDITORIAL</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <span className="text-[8px] font-black tracking-[0.4em] text-gray-400">{item.category}</span>
                                        <h4 className="serif text-3xl italic text-black dark:text-white group-hover:underline">{item.title}</h4>
                                        <p className="text-[11px] text-gray-400 dark:text-white/40 leading-relaxed max-w-sm">{item.desc}</p>
                                        <div className="flex items-center gap-4 pt-2">
                                            <span className="text-[9px] font-black tracking-widest text-black/40 dark:text-white/20">{item.pages}</span>
                                            <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/10" />
                                            <span className="text-[9px] font-black tracking-widest text-black/40 dark:text-white/20">{item.format}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notas do Curador */}
                    <div className="p-10 bg-gray-50 dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-10 flex flex-col justify-between">
                        <div className="space-y-10">
                            <span className="text-[8px] font-black tracking-[0.5em] text-black/30 dark:text-white/20 uppercase">NOTAS DO CURADOR</span>
                            <div className="space-y-6">
                                <p className="serif text-xl italic text-black dark:text-white leading-relaxed opacity-80">
                                    "A simplicidade é o último grau da sofisticação. Sua biblioteca editorial reflete uma disciplina visual impecável neste mês."
                                </p>
                            </div>
                            
                            <div className="space-y-8 pt-6">
                                <div className="flex gap-4 items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-black dark:text-white">Dica de Layout</p>
                                        <p className="text-[9px] text-gray-400 leading-relaxed uppercase tracking-wider">Experimente usar a fonte Newsreader italic em seus títulos para um toque mais artesanal.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-black dark:text-white">Tendência Mensal</p>
                                        <p className="text-[9px] text-gray-400 leading-relaxed uppercase tracking-wider">Uso de espaços negativos aumentou 15% em seus projetos recentes, melhorando a legibilidade.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-6 bg-white text-black border border-gray-100 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all shadow-2xl">
                           INICIAR NOVO PROJETO
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="pt-20 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-end gap-10 text-gray-300 dark:text-white/10 pb-10">
                    <div className="text-[9px] font-bold tracking-[0.2em] uppercase">
                        ESTÚDIO ELITE V2.4.0 • SISTEMA ATIVO
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
