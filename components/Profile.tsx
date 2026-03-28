import React, { useState, useEffect } from 'react';
import { getCurrentUser, User } from '../services/authService';

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getCurrentUser().then(setUser);
    }, []);

    return (
        <div className="p-12 space-y-16 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-left-8 duration-700 dark:text-white">
            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">USUÁRIO</span>
                    <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
                </div>
                <h1 className="serif text-5xl italic font-light tracking-tighter text-black dark:text-white leading-tight">Perfil de Usuário.</h1>
                <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
                   SUAS INFORMAÇÕES DE ACESSO E ASSINATURA NO SISTEMA ARQUITETURA EDITORIAL.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-12 border border-gray-100 dark:border-white/5 bg-white dark:bg-elite-dark space-y-12">
                     <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center p-2 relative overflow-hidden group">
                           <svg className="w-16 h-16 text-gray-200 dark:text-white/10" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                           </svg>
                           <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="text-[8px] font-black tracking-widest uppercase">ALTERAR FOTO</span>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <h2 className="serif text-2xl italic font-bold tracking-tight text-black dark:text-white">{user?.nome || 'CURADOR DIGITAL'}</h2>
                           <p className="text-[10px] text-gray-400 dark:text-white/40 font-bold tracking-widest uppercase">{user?.email || 'MODO OFFLINE'}</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2 border-b border-gray-50 dark:border-white/5 pb-4">
                           <p className="text-[9px] font-bold tracking-[0.4em] text-gray-300 dark:text-white/20 uppercase">IDENTIFICADOR</p>
                           <p className="text-[11px] font-mono opacity-80 uppercase tracking-widest">{user?.id ? `USR-${user.id.toString().padStart(6, '0')}` : 'N/A'}</p>
                        </div>
                        <div className="space-y-2 border-b border-gray-50 dark:border-white/5 pb-4">
                           <p className="text-[9px] font-bold tracking-[0.4em] text-gray-300 dark:text-white/20 uppercase">NÍVEL DE ACESSO</p>
                           <p className="text-[11px] font-bold text-black dark:text-white uppercase tracking-widest">PLANO ELITE AGÊNCIA</p>
                        </div>
                     </div>
                </div>

                <div className="p-12 border border-black dark:border-white/20 bg-black dark:bg-elite-gray text-white space-y-12 shadow-2xl">
                   <header className="space-y-2">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 dark:text-white/20">MÉTRICAS INDIVIDUAIS</h3>
                      <div className="h-px bg-white/10 dark:bg-white/5" />
                   </header>
                   
                   <div className="space-y-8">
                       {[
                         { label: "PLANEJAMENTOS CRIADOS", value: "34" },
                         { label: "PÁGINAS EXPORTADAS", value: "128" },
                         { label: "PALAVRAS ARQUITETADAS", value: "24.5k" }
                       ].map((item, i) => (
                         <div key={i} className="flex justify-between items-end gap-10">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] pb-1">{item.label}</p>
                            <span className="serif text-4xl italic font-bold tracking-tighter">{item.value}</span>
                         </div>
                       ))}
                   </div>

                   <button className="w-full py-5 border border-white/20 hover:border-white transition-all text-[10px] font-bold tracking-[0.4em] uppercase">
                      EDITAR PERFIL
                   </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
