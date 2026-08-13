import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUserProfile, User } from '../services/authService';
import { User as UserIcon, Mail, Phone, CreditCard, Shield, KeyRound, X, Check, Edit3 } from 'lucide-react';

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form State para Edição
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            if (currentUser) {
                setNome(currentUser.nome || '');
                setEmail(currentUser.email || '');
                setPhone(currentUser.phone || '');
                setCpf(currentUser.cpf || '');
            }
        } catch (err) {
            console.error('Erro ao carregar perfil:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleOpenEditModal = () => {
        if (user) {
            setNome(user.nome || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setCpf(user.cpf || '');
            setSenha('');
        }
        setMessage(null);
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const payload: any = {
                nome: nome.trim(),
                email: email.trim(),
                phone: phone.trim(),
                cpf: cpf.trim(),
            };

            if (senha.trim()) {
                payload.senha = senha.trim();
            }

            const response = await updateUserProfile(payload);
            setUser(response.user);
            setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
            setTimeout(() => {
                setIsEditModalOpen(false);
                setMessage(null);
            }, 1200);
        } catch (err: any) {
            setMessage({
                text: err.message || 'Erro ao atualizar perfil. Tente novamente.',
                type: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 sm:p-12 space-y-16 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-left-8 duration-700 dark:text-white font-sans">
            <header className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">USUÁRIO & CONTA</span>
                    <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
                </div>
                <h1 className="serif text-4xl sm:text-6xl italic font-light tracking-tighter text-black dark:text-white leading-tight">Perfil de Usuário.</h1>
                <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
                   SUAS INFORMAÇÕES DE ACESSO, DADOS CADASTRAIS E ASSINATURA NO SISTEMA ARQUITETURA EDITORIAL.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* ── CARD ESQUERDO: DADOS PESSOAIS ── */}
                <div className="p-8 sm:p-12 border border-gray-100 dark:border-white/5 bg-white dark:bg-elite-dark space-y-12 shadow-sm">
                     <div className="flex items-center gap-8">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center p-2 relative overflow-hidden group">
                           <span className="serif text-3xl font-bold italic text-black dark:text-white">
                               {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                           </span>
                           <div 
                              onClick={handleOpenEditModal}
                              className="absolute inset-0 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                           >
                                <span className="text-[8px] font-black tracking-widest uppercase">EDITAR</span>
                           </div>
                        </div>
                        <div className="space-y-2 min-w-0 flex-1">
                           <h2 className="serif text-2xl sm:text-3xl italic font-bold tracking-tight text-black dark:text-white truncate">
                               {loading ? 'Carregando...' : user?.nome || 'CURADOR DIGITAL'}
                           </h2>
                           <p className="text-[10px] text-gray-400 dark:text-white/40 font-bold tracking-widest uppercase truncate">
                               {user?.email || 'N/A'}
                           </p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2 border-b border-gray-50 dark:border-white/5 pb-4">
                           <p className="text-[9px] font-bold tracking-[0.4em] text-gray-300 dark:text-white/20 uppercase">IDENTIFICADOR DE CONTA</p>
                           <p className="text-[11px] font-mono opacity-80 uppercase tracking-widest text-black dark:text-white">
                               {user?.id ? `USR-${String(user.id).toUpperCase()}` : 'N/A'}
                           </p>
                        </div>

                        <div className="space-y-2 border-b border-gray-50 dark:border-white/5 pb-4">
                           <p className="text-[9px] font-bold tracking-[0.4em] text-gray-300 dark:text-white/20 uppercase">TELEFONE DE CONTATO</p>
                           <p className="text-[11px] font-mono opacity-80 uppercase tracking-widest text-black dark:text-white">
                               {user?.phone || 'Não informado'}
                           </p>
                        </div>

                        <div className="space-y-2 border-b border-gray-50 dark:border-white/5 pb-4">
                           <p className="text-[9px] font-bold tracking-[0.4em] text-gray-300 dark:text-white/20 uppercase">DOCUMENTO CPF</p>
                           <p className="text-[11px] font-mono opacity-80 uppercase tracking-widest text-black dark:text-white">
                               {user?.cpf || 'Não informado'}
                           </p>
                        </div>

                        <div className="space-y-2 border-b border-gray-50 dark:border-white/5 pb-4">
                           <p className="text-[9px] font-bold tracking-[0.4em] text-gray-300 dark:text-white/20 uppercase">NÍVEL DE ACESSO & CARGO</p>
                           <p className="text-[11px] font-bold text-black dark:text-white uppercase tracking-widest">
                               {user?.role || 'PLANO ELITE AGÊNCIA'}
                           </p>
                        </div>
                     </div>
                </div>

                {/* ── CARD DIREITO: MÉTRICAS REAIS DO BANCO DE DADOS ── */}
                <div className="p-8 sm:p-12 border border-black dark:border-white/20 bg-black dark:bg-elite-gray text-white space-y-12 shadow-2xl flex flex-col justify-between">
                   <div className="space-y-10">
                       <header className="space-y-2">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 dark:text-white/20">MÉTRICAS REAIS DO BANCO DE DADOS</h3>
                          <div className="h-px bg-white/10 dark:bg-white/5" />
                       </header>
                       
                       <div className="space-y-8">
                           {[
                             { label: "PROJETOS CRIADOS NO ACERVO", value: loading ? "..." : String(user?.totalProjects ?? 0) },
                             { label: "SALDO DE TOKENS DISPONÍVEIS", value: loading ? "..." : String(user?.tokens ?? 0) },
                             { label: "PLANO ATIVO DE ASSINATURA", value: user?.plan?.name ? user.plan.name.toUpperCase() : "ESSENCIAL" }
                           ].map((item, i) => (
                             <div key={i} className="flex justify-between items-end gap-10">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] pb-1">{item.label}</p>
                                <span className="serif text-3xl sm:text-4xl italic font-bold tracking-tighter text-right">{item.value}</span>
                             </div>
                           ))}
                       </div>
                   </div>

                   <button 
                      onClick={handleOpenEditModal}
                      className="w-full py-5 border border-white/20 hover:border-white transition-all text-[10px] font-bold tracking-[0.4em] uppercase flex items-center justify-center gap-2 hover:bg-white hover:text-black"
                   >
                      <Edit3 size={14} /> EDITAR PERFIL
                   </button>
                </div>
            </div>

            {/* ── MODAL DE EDIÇÃO DE PERFIL ── */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300 font-sans">
                    <div className="bg-white dark:bg-elite-gray border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-w-lg w-full relative space-y-6 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black dark:hover:text-white"
                        >
                            <X size={18} />
                        </button>

                        <div className="space-y-2">
                            <span className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                                ATUALIZAÇÃO CADASTRAL
                            </span>
                            <h2 className="serif text-3xl italic font-light text-black dark:text-white">
                                Editar Próprio Perfil
                            </h2>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">
                                Modifique seus dados pessoais no banco de dados.
                            </p>
                        </div>

                        {message && (
                            <div className={`p-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                                message.type === 'success' 
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            }`}>
                                {message.type === 'success' ? <Check size={16} /> : <X size={16} />}
                                <span>{message.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                            <div>
                                <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase mb-1">
                                    NOME COMPLETO
                                </label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Seu nome completo"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white tracking-wider focus:outline-none focus:border-black dark:focus:border-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase mb-1">
                                    ENDEREÇO DE E-MAIL
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu.email@exemplo.com"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white tracking-wider focus:outline-none focus:border-black dark:focus:border-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase mb-1">
                                        TELEFONE
                                    </label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="(11) 99999-9999"
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white tracking-wider focus:outline-none focus:border-black dark:focus:border-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase mb-1">
                                        DOCUMENTO CPF
                                    </label>
                                    <input
                                        type="text"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        placeholder="000.000.000-00"
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white tracking-wider focus:outline-none focus:border-black dark:focus:border-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase mb-1">
                                    NOVA SENHA (OPCIONAL)
                                </label>
                                <input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Deixe em branco para manter a senha atual"
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white tracking-wider focus:outline-none focus:border-black dark:focus:border-white"
                                />
                            </div>

                            <div className="flex gap-4 pt-6 justify-end border-t border-gray-100 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-6 py-3 border border-gray-200 dark:border-white/10 text-black dark:text-white text-[9px] font-black tracking-[0.3em] uppercase hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black text-[9px] font-black tracking-[0.3em] uppercase hover:opacity-80 transition-all shadow-sm disabled:opacity-50"
                                >
                                    {isSaving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
