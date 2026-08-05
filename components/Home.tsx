import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getProjects, Project, DashboardStats } from '../services/projectService';
import { getCurrentUser, User } from '../services/authService';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, projectsData, userData] = await Promise.all([
                    getDashboardStats(),
                    getProjects(),
                    getCurrentUser()
                ]);
                setStats(statsData);
                setRecentProjects(projectsData.slice(0, 2));
                setUser(userData);
            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        
        if (diffInHours < 1) return "Editado agora pouco";
        if (diffInHours === 1) return "Editado há 1 hora";
        if (diffInHours < 24) return `Editado há ${diffInHours} horas`;
        return `Editado em ${date.toLocaleDateString('pt-BR')}`;
    };

    return (
        <div className="min-h-full bg-[#fcfcfc] dark:bg-elite-black transition-colors duration-500">
            <div className="p-6 sm:p-12 space-y-12 sm:space-y-16 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Boas Vindas */}
                <header className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">VISÃO GERAL DO WORKSPACE</span>
                        <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="serif text-4xl sm:text-7xl italic font-light tracking-tighter text-black dark:text-white leading-tight">
                            Seja bem-vindo{user?.nome ? `, ${user.nome.split(' ')[0]}` : ''},
                        </h1>
                        <h1 className="serif text-4xl sm:text-7xl italic font-light tracking-tighter text-black dark:text-white leading-tight opacity-90">Seu acervo está em dia.</h1>
                    </div>
                    <div className="h-px w-40 bg-black/10 dark:bg-white/10 mt-8" />
                </header>

                {/* Grid de Métricas -- MODO ELITE RESPONSIVO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[
                      { 
                        label: "TOTAL DE PROJETOS", 
                        value: loading ? "..." : stats?.totalProjects.toString() || "0", 
                        suffix: "Projetos ativos no diretório", 
                        icon: "" 
                      },
                      { 
                        label: "ÚLTIMO PROJETO ALTERADO", 
                        value: loading ? "..." : stats?.lastUpdatedProject?.name || "Nenhum projeto", 
                        suffix: stats?.lastUpdatedProject ? getTimeAgo(stats.lastUpdatedProject.updatedAt) : "Comece a criar agora", 
                        icon: "", 
                        isSmall: true,
                        projectId: stats?.lastUpdatedProject?.id
                      },
                      { 
                        label: "TOTAL DE TOKENS", 
                        value: loading ? "..." : `${user?.tokens || 0}UN`, 
                        suffix: "Consumo mensal equilibrado", 
                        icon: "" 
                      },
                    ].map((stat, i) => (
                      <div 
                        key={i} 
                        onClick={() => stat.projectId && navigate(`/elite/criar?id=${stat.projectId}`)}
                        className={`p-6 border border-gray-100 dark:border-white/5 bg-white dark:bg-elite-gray transition-all group relative ${stat.projectId ? 'cursor-pointer hover:border-black dark:hover:border-white/20' : ''}`}
                      >
                        <div className="space-y-6">
                            <p className="text-[8px] font-black text-gray-300 dark:text-white/30 tracking-[0.4em] uppercase group-hover:text-black dark:group-hover:text-white transition-colors leading-relaxed">{stat.label}</p>
                            <h2 className={`serif italic font-bold tracking-tight text-black dark:text-white leading-snug ${stat.isSmall ? 'text-lg line-clamp-2 break-words' : 'text-4xl'}`}>{stat.value}</h2>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em]">{stat.suffix}</p>
                        </div>
                      </div>
                    ))}

                    {/* Card de Destaque - Próxima Renovação */}
                    <div className="p-6 sm:p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/10 flex flex-col justify-between shadow-xl">
                        <div className="flex justify-between items-start">
                            <p className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">PRÓXIMA RENOVAÇÃO</p>
                        </div>
                        <div className="space-y-1 py-4">
                            <h2 className="serif text-2xl lg:text-3xl font-bold tracking-tight text-black dark:text-white break-words">15 de Outubro, 2026</h2>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">Plano Anual Editorial Plus</p>
                    </div>
                </div>

                {/* Seção Central - Manuscritos Recentes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-6">
                            <h3 className="serif text-3xl italic text-black dark:text-white">Manuscritos Recentes</h3>
                            <button 
                                onClick={() => navigate('/elite/criar')}
                                className="text-[9px] font-black tracking-[0.3em] text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                VER GALERIA COMPLETA
                            </button>
                        </div>

                        <div className="space-y-12">
                            {loading ? (
                                <div className="space-y-8 animate-pulse">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex gap-8 items-center">
                                            <div className="w-32 h-44 bg-gray-100 dark:bg-white/5" />
                                            <div className="flex-1 space-y-4">
                                                <div className="h-2 w-20 bg-gray-100 dark:bg-white/5" />
                                                <div className="h-8 w-64 bg-gray-100 dark:bg-white/5" />
                                                <div className="h-4 w-48 bg-gray-100 dark:bg-white/5" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : recentProjects.length > 0 ? (
                                recentProjects.map((item) => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => navigate(`/elite/criar?id=${item.id}`)}
                                        className="flex flex-col sm:flex-row gap-6 sm:gap-8 group cursor-pointer items-start sm:items-center p-4 -mx-4 rounded border border-transparent hover:border-gray-100 dark:hover:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all"
                                    >
                                        <div className="w-32 h-44 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-2 transform group-hover:-translate-y-2 transition-transform duration-500 shadow-sm group-hover:shadow-2xl shrink-0">
                                            <div className="w-full h-full border border-gray-100 dark:border-white/5 bg-white dark:bg-transparent flex items-center justify-center">
                                                <span className="serif italic text-black dark:text-white opacity-20">EDITORIAL</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-3 min-w-0">
                                            <span className="text-[8px] font-black tracking-[0.4em] text-gray-400 uppercase">{item.content.doc.sessions[0]?.format || 'PROJETO'}</span>
                                            <h4 className="serif text-2xl sm:text-3xl italic text-black dark:text-white group-hover:underline break-words">{item.name}</h4>
                                            <p className="text-[11px] text-gray-400 dark:text-white/40 leading-relaxed max-w-sm line-clamp-2">{item.shortDescription}</p>
                                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                                <span className="text-[9px] font-black tracking-widest text-black/40 dark:text-white/20 whitespace-nowrap uppercase">{item.content.doc.sessions.length} SESSÕES</span>
                                                <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/10" />
                                                <span className="text-[9px] font-black tracking-widest text-black/40 dark:text-white/20 uppercase">{item.content.settings.fontTitle} + {item.content.settings.fontBody}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center border border-dashed border-gray-200 dark:border-white/10">
                                    <p className="serif text-xl italic text-black/20 dark:text-white/10 tracking-widest uppercase">Nenhum manuscrito encontrado em sua biblioteca</p>
                                </div>
                            )}
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

                        <button 
                            onClick={() => navigate('/elite/criar')}
                            className="w-full py-6 bg-white dark:bg-white/10 text-black dark:text-white border border-gray-100 dark:border-white/10 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-2xl"
                        >
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

