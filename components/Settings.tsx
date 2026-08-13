import React, { useState, useEffect } from 'react';
import { Bell, ShieldAlert, FileCheck, Award } from 'lucide-react';

const Settings: React.FC = () => {
    // Estados de Alertas e Notificações com persistência em localStorage
    const [alertTokens, setAlertTokens] = useState<boolean>(() => {
        const saved = localStorage.getItem('setting_alertTokens');
        return saved === null ? true : saved === 'true';
    });

    const [alertExports, setAlertExports] = useState<boolean>(() => {
        const saved = localStorage.getItem('setting_alertExports');
        return saved === null ? true : saved === 'true';
    });

    const [alertSecurity, setAlertSecurity] = useState<boolean>(() => {
        const saved = localStorage.getItem('setting_alertSecurity');
        return saved === null ? true : saved === 'true';
    });

    const [alertWeeklyReport, setAlertWeeklyReport] = useState<boolean>(() => {
        const saved = localStorage.getItem('setting_alertWeeklyReport');
        return saved === null ? false : saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('setting_alertTokens', String(alertTokens));
        localStorage.setItem('setting_alertExports', String(alertExports));
        localStorage.setItem('setting_alertSecurity', String(alertSecurity));
        localStorage.setItem('setting_alertWeeklyReport', String(alertWeeklyReport));
    }, [alertTokens, alertExports, alertSecurity, alertWeeklyReport]);

    return (
        <div className="p-6 sm:p-12 space-y-12 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700 dark:text-white font-sans">
            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">SISTEMA</span>
                    <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
                </div>
                <h1 className="serif text-4xl sm:text-6xl italic font-light tracking-tighter text-black dark:text-white leading-tight">Configurações Estúdio.</h1>
                <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
                   GERENCIE AS PREFERÊNCIAS TÉCNICAS, ALERTAS DO SISTEMA E AMBIENTE DE TRABALHO ELITE.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ── CARD: DESIGN E INTERFACE ── */}
                <div className="p-8 sm:p-10 border border-gray-100 dark:border-white/5 bg-white dark:bg-elite-gray space-y-8 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black dark:text-white border-b border-gray-100 dark:border-white/10 pb-4">
                        DESIGN E INTERFACE
                    </h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-bold tracking-widest pb-4">
                            <div>
                                <span className="block text-black dark:text-white uppercase">MODO AUTOMÁTICO DO SISTEMA</span>
                                <span className="text-[9px] font-normal text-gray-400 dark:text-white/40 tracking-normal normal-case">
                                    O tema se adapta dinamicamente via seletor no cabeçalho.
                                </span>
                            </div>
                            <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-[9px] font-bold tracking-widest uppercase">
                                ATIVO
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── CARD: ALERTAS E NOTIFICAÇÕES (CRIATIVO) ── */}
                <div className="p-8 sm:p-10 border border-black dark:border-white/20 bg-black dark:bg-elite-dark text-white space-y-8 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
                            ALERTAS E NOTIFICAÇÕES EDITORIAIS
                        </h3>
                        <Bell size={16} className="text-white/40" />
                    </div>

                    <div className="space-y-6">
                        {/* Alerta 1: Consumo de Tokens */}
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert size={14} className="text-amber-400" />
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-white">LIMITE DE TOKENS E RECURSOS</p>
                                </div>
                                <p className="text-[10px] text-white/50 leading-relaxed font-light">
                                    Notificar quando o saldo de tokens estiver abaixo de 20% do limite do plano.
                                </p>
                            </div>
                            <button
                                onClick={() => setAlertTokens(!alertTokens)}
                                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-1 ${
                                    alertTokens ? 'bg-white' : 'bg-white/20'
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full transition-transform ${
                                        alertTokens ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/60'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Alerta 2: Exportação de Manuscritos */}
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <FileCheck size={14} className="text-emerald-400" />
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-white">CONFIRMAÇÃO DE MANUSCRITOS & PDF</p>
                                </div>
                                <p className="text-[10px] text-white/50 leading-relaxed font-light">
                                    Exibir confirmações na tela ao concluir exportação de PDFs A2/A3 e salvamentos.
                                </p>
                            </div>
                            <button
                                onClick={() => setAlertExports(!alertExports)}
                                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-1 ${
                                    alertExports ? 'bg-white' : 'bg-white/20'
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full transition-transform ${
                                        alertExports ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/60'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Alerta 3: Segurança da Conta */}
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Bell size={14} className="text-blue-400" />
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-white">ALERTAS DE SEGURANÇA POR E-MAIL</p>
                                </div>
                                <p className="text-[10px] text-white/50 leading-relaxed font-light">
                                    Receber aviso instantâneo em alterações de senha, e-mail ou logins em novos navegadores.
                                </p>
                            </div>
                            <button
                                onClick={() => setAlertSecurity(!alertSecurity)}
                                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-1 ${
                                    alertSecurity ? 'bg-white' : 'bg-white/20'
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full transition-transform ${
                                        alertSecurity ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/60'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Alerta 4: Resumo Semanal do Curador */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Award size={14} className="text-purple-400" />
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-white">RESUMO SEMANAL DO CURADOR</p>
                                </div>
                                <p className="text-[10px] text-white/50 leading-relaxed font-light">
                                    Boletim semanal com métricas do acervo, estatísticas de planejamento e recomendações de design.
                                </p>
                            </div>
                            <button
                                onClick={() => setAlertWeeklyReport(!alertWeeklyReport)}
                                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-1 ${
                                    alertWeeklyReport ? 'bg-white' : 'bg-white/20'
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full transition-transform ${
                                        alertWeeklyReport ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/60'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-10 border border-dashed border-gray-200 dark:border-white/10 text-center">
                <p className="text-[9px] font-bold tracking-[0.5em] text-gray-300 dark:text-white/20 uppercase italic">
                    AMBIESTE CONFIGURADO COM SUCESSO • ESTÚDIO EDITORIAL DE ELITE
                </p>
            </div>
        </div>
    );
};

export default Settings;
