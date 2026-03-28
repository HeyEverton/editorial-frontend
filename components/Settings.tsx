import React from 'react';

const Settings: React.FC = () => {
    return (
        <div className="p-12 space-y-16 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700 dark:text-white">
            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">SISTEMA</span>
                    <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
                </div>
                <h1 className="serif text-5xl italic font-light tracking-tighter">Configurações Estúdio.</h1>
                <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
                   GERENCIE AS PREFERÊNCIAS TÉCNICAS E DE DESIGN DO SEU AMBIENTE DE TRABALHO ELITE.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-10 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 space-y-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-black dark:text-white">DESIGN E INTERFACE</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-bold tracking-widest pb-4 border-b border-gray-100 dark:border-white/5">
                            <span>MODO ESCURO AUTOMÁTICO</span>
                            <div className="w-10 h-5 bg-black dark:bg-white" />
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold tracking-widest pb-4 border-b border-gray-100 dark:border-white/5 opacity-30">
                            <span>REDUZIR ANIMAÇÕES</span>
                            <div className="w-10 h-5 bg-gray-200 dark:bg-white/10" />
                        </div>
                    </div>
                </div>

                <div className="p-10 border border-black dark:border-white/20 bg-black dark:bg-elite-gray text-white space-y-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30">SEGURANÇA E API</h3>
                    <div className="space-y-6">
                        <div className="space-y-3 pb-4 border-b border-white/10">
                            <p className="text-[9px] font-bold tracking-widest opacity-40 uppercase">CHAVE DE ACESSO GEMINI</p>
                            <p className="text-[10px] font-mono opacity-80">••••••••••••••••••••••••••••••••</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-10 border border-dashed border-gray-200 dark:border-white/10 text-center">
                <p className="text-[9px] font-bold tracking-[0.5em] text-gray-300 dark:text-white/20 uppercase italic">MAIS CONFIGURAÇÕES DISPONÍVEIS NA PRÓXIMA VERSÃO</p>
            </div>
        </div>
    );
};

export default Settings;
