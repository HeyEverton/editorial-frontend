import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit2, Phone, CreditCard, Shield, User as UserIcon } from 'lucide-react';
import { UserModal } from './UserModal';

interface UserListItem {
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
  projectCount: number;
  createdAt: string;
}

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('auth_token');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, rolesRes, plansRes] = await Promise.all([
        fetch('http://localhost:3001/api/admin/users', { headers }),
        fetch('http://localhost:3001/api/admin/roles', { headers }),
        fetch('http://localhost:3001/api/admin/permissions', { headers }), // fallback or plans
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData);
      }

      // Default hardcoded plans fallback if not returned
      setPlans([
        { id: 'plan_essencial', name: 'Essencial' },
        { id: 'plan_elite', name: 'Elite' },
        { id: 'plan_master', name: 'Master Black' },
      ]);
    } catch (err) {
      console.error('Erro ao carregar lista de usuários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenUserModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.toLowerCase().includes(query)) ||
      (u.cpf && u.cpf.toLowerCase().includes(query)) ||
      u.role.toLowerCase().includes(query) ||
      u.plan.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-full bg-[#fcfcfc] dark:bg-elite-black transition-colors duration-500 font-sans">
      <div className="p-6 sm:p-12 space-y-12 sm:space-y-16 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* ── HEADER DA PÁGINA ── */}
        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">
              GESTÃO DE ASSINANTES E CONTAS
            </span>
            <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
          </div>
          <div className="space-y-2">
            <h1 className="serif text-4xl sm:text-7xl italic font-light tracking-tighter text-black dark:text-white leading-tight">
              Gestão de Usuários
            </h1>
          </div>
          <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase leading-relaxed max-w-2xl">
            Pesquise, consulte as fichas de assinantes, edite dados cadastrais (telefone, CPF), modifique planos e acompanhe o saldo de tokens.
          </p>
          <div className="h-px w-40 bg-black/10 dark:bg-white/10 mt-8" />
        </header>

        {/* ── SEÇÃO DE TABELA DE USUÁRIOS ── */}
        <div className="p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="max-w-md w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome, e-mail, telefone, CPF, cargo ou plano..."
                className="ui-input w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs font-light text-black dark:text-white tracking-wider placeholder:text-gray-400 focus:outline-none"
              />
              <Search size={16} className="absolute right-4 top-3.5 text-gray-400" />
            </div>
            <div className="text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase">
              TOTAL DE {filteredUsers.length} USUÁRIOS ENCONTRADOS
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-[9px] font-black tracking-[0.4em] uppercase text-gray-400 dark:text-white/30">
                  <th className="py-4 px-4">NOME / E-MAIL</th>
                  <th className="py-4 px-4">CONTATO / CPF</th>
                  <th className="py-4 px-4">CARGO</th>
                  <th className="py-4 px-4">PLANO & CICLO</th>
                  <th className="py-4 px-4">TOKENS</th>
                  <th className="py-4 px-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent animate-spin mx-auto mb-2" />
                      Carregando assinantes...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 font-serif italic text-base">
                      Nenhum usuário encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-normal text-black dark:text-white">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 border border-gray-200 dark:border-white/10 font-serif italic text-black dark:text-white font-bold flex items-center justify-center text-sm shrink-0 bg-gray-50 dark:bg-white/5">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="serif text-base italic block leading-snug">{user.name}</span>
                            <span className="text-[11px] font-light text-gray-400 dark:text-white/40">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-light text-gray-500 dark:text-white/40">
                        <div className="space-y-0.5">
                          <span className="block text-xs font-mono">{user.phone || 'Sem telefone'}</span>
                          <span className="block text-[10px] text-gray-400 font-mono">{user.cpf ? `CPF: ${user.cpf}` : 'Sem CPF'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[9px] font-bold text-black dark:text-white tracking-[0.2em] uppercase">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-[9px] font-black tracking-[0.2em] uppercase inline-block">
                            {user.plan}
                          </span>
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            {user.billingCycle}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-serif italic text-base text-black dark:text-white">
                        {user.tokens}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenUserModal(user.id)}
                          className="px-4 py-2 bg-white dark:bg-white/10 text-black dark:text-white border border-gray-200 dark:border-white/10 text-[9px] font-black tracking-[0.2em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                        >
                          <Eye size={13} /> FICHA / EDITAR
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail & Edit Modal */}
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={selectedUserId}
          onSaveSuccess={fetchData}
          availableRoles={roles}
          availablePlans={plans}
        />
      </div>
    </div>
  );
};
