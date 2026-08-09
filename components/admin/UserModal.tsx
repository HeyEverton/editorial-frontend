import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Phone, CreditCard, Shield, Zap, Calendar, Folder } from 'lucide-react';

interface Role {
  id: string;
  name: string;
}

interface Plan {
  id: string;
  name: string;
}

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  role: string;
  roleId?: string;
  plan: string;
  planId?: string;
  tokens: number;
  generationsThisMonth: number;
  billingCycle: string;
  createdAt: string;
  updatedAt: string;
  projects?: any[];
  tokenTransactions?: any[];
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onSaveSuccess: () => void;
  availableRoles: Role[];
  availablePlans: Plan[];
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSaveSuccess,
  availableRoles,
  availablePlans,
}) => {
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [roleId, setRoleId] = useState('');
  const [planId, setPlanId] = useState('');
  const [tokens, setTokens] = useState<number>(40);
  const [billingCycle, setBillingCycle] = useState('mensal');

  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          setName(data.name || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setCpf(data.cpf || '');
          setRoleId(data.roleId || '');
          setPlanId(data.planId || '');
          setTokens(data.tokens || 0);
          setBillingCycle(data.billingCycle || 'mensal');
        })
        .catch((err) => console.error('Erro ao buscar perfil do usuário:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          cpf: cpf.trim(),
          roleId,
          planId,
          tokens: Number(tokens),
          billingCycle,
        }),
      });

      if (res.ok) {
        onSaveSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao atualizar dados do usuário.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto font-sans animate-modal-overlay">
      <div className="bg-white dark:bg-elite-gray border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden relative animate-modal-content">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="ui-dialog-close-btn absolute top-6 right-6 p-2 text-gray-400 hover:text-black dark:hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-gray-100 dark:border-white/5">
          <span className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
            FICHA COMPLETA DO ASSINANTE
          </span>
          <h2 className="serif text-3xl italic font-light text-black dark:text-white">
            {userData?.name || 'Detalhes do Usuário'}
          </h2>
          <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">
            Visualize o histórico de acervo, limites do plano e edite as credenciais cadastrais.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Carregando perfil...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-6 overflow-y-auto flex-1 space-y-8">
            {/* Metricas Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <span className="text-[8px] font-black text-gray-400 tracking-[0.3em] uppercase block mb-1">
                  SALDO DE TOKENS
                </span>
                <span className="serif text-2xl italic font-bold text-black dark:text-white">
                  {userData?.tokens || 0}
                </span>
              </div>
              <div className="p-4 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <span className="text-[8px] font-black text-gray-400 tracking-[0.3em] uppercase block mb-1">
                  GERAÇÕES NO MÊS
                </span>
                <span className="serif text-2xl italic font-bold text-black dark:text-white">
                  {userData?.generationsThisMonth || 0}
                </span>
              </div>
              <div className="p-4 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <span className="text-[8px] font-black text-gray-400 tracking-[0.3em] uppercase block mb-1">
                  PROJETOS SALVOS
                </span>
                <span className="serif text-2xl italic font-bold text-black dark:text-white">
                  {userData?.projects?.length || 0}
                </span>
              </div>
              <div className="p-4 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <span className="text-[8px] font-black text-gray-400 tracking-[0.3em] uppercase block mb-1">
                  MEMBRO DESDE
                </span>
                <span className="text-xs font-bold text-black dark:text-white">
                  {formatDate(userData?.createdAt)}
                </span>
              </div>
            </div>

            {/* Formulário de Edição */}
            <div className="space-y-4">
              <h3 className="serif text-xl italic text-black dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
                Dados Cadastrais e de Contato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase mb-1">
                    NOME COMPLETO
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="ui-input w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase mb-1">
                    E-MAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="ui-input w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase mb-1">
                    TELEFONE / WHATSAPP (OPCIONAL)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="ui-input w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase mb-1">
                    CPF (OPCIONAL)
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="ui-input w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Configurações de Assinatura & Tokens */}
            <div className="space-y-4">
              <h3 className="serif text-xl italic text-black dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
                Plano, Cargo & Limites
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase mb-1">
                    CARGO / PERFIL
                  </label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="ui-select w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white font-mono uppercase"
                  >
                    {availableRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase mb-1">
                    PLANO
                  </label>
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="ui-select w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white font-mono uppercase"
                  >
                    {availablePlans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase mb-1">
                    CICLO DE FATURAMENTO
                  </label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="ui-select w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white font-mono uppercase"
                  >
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase mb-1">
                    AJUSTE DE TOKENS
                  </label>
                  <input
                    type="number"
                    value={tokens}
                    onChange={(e) => setTokens(Number(e.target.value))}
                    className="ui-input w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs text-black dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-200 dark:border-white/10 text-black dark:text-white text-[9px] font-black tracking-[0.3em] uppercase hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-white dark:bg-white/10 text-black dark:text-white border border-gray-200 dark:border-white/10 text-[9px] font-black tracking-[0.3em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
