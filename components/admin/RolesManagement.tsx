import React, { useState, useEffect } from 'react';
import { Search, Copy, Edit2, Trash2 } from 'lucide-react';
import { RoleModal } from './RoleModal';

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
  permissions: any[];
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId?: string;
  plan: string;
  planId?: string;
}

export const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);

  // Edit User Role State
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [selectedUserRoleId, setSelectedUserRoleId] = useState('');

  const token = localStorage.getItem('auth_token');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [rolesRes, permsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3001/api/admin/roles', { headers }),
        fetch('http://localhost:3001/api/admin/permissions', { headers }),
        fetch('http://localhost:3001/api/admin/users', { headers }),
      ]);

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData);
      }

      if (permsRes.ok) {
        const permsData = await permsRes.json();
        setAvailablePermissions(permsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (err) {
      console.error('Erro ao buscar dados administrativos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveRole = async (roleData: {
    id?: string;
    name: string;
    description: string;
    permissions: { permissionId: string; actions: string[] }[];
  }) => {
    const isEdit = !!roleData.id;
    const url = isEdit
      ? `http://localhost:3001/api/admin/roles/${roleData.id}`
      : 'http://localhost:3001/api/admin/roles';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roleData),
    });

    if (res.ok) {
      fetchData();
    } else {
      const err = await res.json();
      alert(err.error || 'Erro ao salvar perfil.');
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.isSystem) {
      alert('Perfis do sistema não podem ser excluídos.');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o perfil "${role.name}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/admin/roles/${role.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao excluir perfil.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveUserRole = async (userId: string, newRoleId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${userId}/role-plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roleId: newRoleId }),
      });

      if (res.ok) {
        setEditingUser(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-[#fcfcfc] dark:bg-elite-black transition-colors duration-500 font-sans">
      <div className="p-6 sm:p-12 space-y-12 sm:space-y-16 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* ── HEADER DA PÁGINA ── */}
        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">
              GESTÃO DE ACESSO E GOVERNANÇA
            </span>
            <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
          </div>
          <div className="space-y-2">
            <h1 className="serif text-4xl sm:text-7xl italic font-light tracking-tighter text-black dark:text-white leading-tight">
              Lista de perfis
            </h1>
          </div>
          <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase leading-relaxed max-w-2xl">
            Um perfil dá acesso a menus e recursos pré-definidos, de modo que, dependendo do perfil atribuído, um administrador pode acessar o que precisa.
          </p>
          <div className="h-px w-40 bg-black/10 dark:bg-white/10 mt-8" />
        </header>

        {/* ── GRID DE CARDS DE PERFIS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="p-6 sm:p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/10 flex flex-col justify-between transition-all group relative ui-card-hover"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <p className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                    PERFIL DE SISTEMA
                  </p>
                  <button className="text-gray-300 hover:text-black dark:hover:text-white transition-colors p-1" title="Copiar ID">
                    <Copy size={14} />
                  </button>
                </div>
                <h3 className="serif text-2xl lg:text-3xl italic font-bold tracking-tight text-black dark:text-white">
                  {role.name}
                </h3>
              </div>

              <div className="pt-8 mt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <button
                  onClick={() => {
                    setRoleToEdit(role);
                    setIsModalOpen(true);
                  }}
                  className="text-[9px] font-black tracking-[0.3em] uppercase text-black dark:text-white hover:opacity-60 transition-opacity"
                >
                  EDITAR PERFIL
                </button>

                {!role.isSystem && (
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="text-[9px] font-black tracking-[0.3em] uppercase text-rose-500 hover:opacity-60 transition-opacity"
                  >
                    EXCLUIR PERFIL
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Card Criar Perfil */}
          <div className="p-6 sm:p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/10 flex flex-col justify-between transition-all ui-card-hover">
            <div className="flex justify-between items-start">
              <p className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                NOVO ACESSO
              </p>
            </div>
            <div className="space-y-2 py-4">
              <h3 className="serif text-xl italic font-light text-black dark:text-white">Criar novo perfil de usuário</h3>
              <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">Crie um perfil se não existir.</p>
            </div>
            <button
              onClick={() => {
                setRoleToEdit(null);
                setIsModalOpen(true);
              }}
              className="w-full py-4 bg-white dark:bg-white/10 text-black dark:text-white border border-gray-200 dark:border-white/10 text-[9px] font-black tracking-[0.3em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm"
            >
              CRIAR PERFIL
            </button>
          </div>
        </div>

        {/* ── TABELA DE USUÁRIOS COM FUNÇÕES ── */}
        <div className="space-y-8 pt-6">
          <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/5 pb-6">
            <div className="space-y-2">
              <h3 className="serif text-3xl italic text-black dark:text-white">
                Total de usuários com suas funções
              </h3>
              <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">
                Encontre todas as contas de administrador da sua empresa e suas funções associadas.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-6">
            {/* Search Input */}
            <div className="max-w-md relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome, e-mail ou cargo..."
                className="ui-input w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs font-light text-black dark:text-white tracking-wider placeholder:text-gray-400 focus:outline-none"
              />
              <Search size={16} className="absolute right-4 top-3.5 text-gray-400" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 text-[9px] font-black tracking-[0.4em] uppercase text-gray-400 dark:text-white/30">
                    <th className="py-4 px-4">NOME</th>
                    <th className="py-4 px-4">E-MAIL</th>
                    <th className="py-4 px-4">CARGO</th>
                    <th className="py-4 px-4 text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-xs">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-normal text-black dark:text-white flex items-center gap-4">
                        <div className="w-8 h-8 border border-gray-200 dark:border-white/10 font-serif italic text-black dark:text-white font-bold flex items-center justify-center text-xs shrink-0 bg-gray-50 dark:bg-white/5">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="serif text-base italic">{user.name}</span>
                      </td>
                      <td className="py-4 px-4 font-light text-gray-500 dark:text-white/40">{user.email}</td>
                      <td className="py-4 px-4">
                        {editingUser?.id === user.id ? (
                          <select
                            value={selectedUserRoleId}
                            onChange={(e) => {
                              setSelectedUserRoleId(e.target.value);
                              handleSaveUserRole(user.id, e.target.value);
                            }}
                            className="ui-select border border-black dark:border-white px-3 py-1 text-xs bg-white dark:bg-elite-black text-black dark:text-white font-mono uppercase"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[9px] font-bold text-black dark:text-white tracking-[0.2em] uppercase">
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setSelectedUserRoleId(user.roleId || '');
                          }}
                          className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                          title="Alterar Cargo"
                        >
                          <Edit2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Role Modal */}
        <RoleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRole}
          roleToEdit={roleToEdit}
          availablePermissions={availablePermissions}
        />
      </div>
    </div>
  );
};
