import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';

interface PermissionItem {
  id: string;
  name: string;
  subject: string;
  availableActions: string[];
}

export const PermissionsManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permToEdit, setPermToEdit] = useState<PermissionItem | null>(null);

  // Form State
  const [pageName, setPageName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const token = localStorage.getItem('auth_token');

  const actionOptions = [
    { key: 'read', label: 'Ler' },
    { key: 'create', label: 'Criar' },
    { key: 'delete', label: 'Excluir' },
    { key: 'list', label: 'Listar' },
    { key: 'edit', label: 'Editar' },
    { key: 'block', label: 'Bloquear' },
    { key: 'manage', label: 'Gerenciar' },
  ];

  const fetchPermissions = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/admin/permissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPermissions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleOpenModal = (perm?: PermissionItem) => {
    if (perm) {
      setPermToEdit(perm);
      setPageName(perm.name || '');
      setSubject(perm.subject || '');
      setSelectedActions(Array.isArray(perm.availableActions) ? perm.availableActions : []);
    } else {
      setPermToEdit(null);
      setPageName('');
      setSubject('');
      setSelectedActions(['read', 'create', 'delete', 'list', 'edit']);
    }
    setIsModalOpen(true);
  };

  const handleToggleAction = (actionKey: string) => {
    setSelectedActions((prev) =>
      prev.includes(actionKey) ? prev.filter((a) => a !== actionKey) : [...prev, actionKey]
    );
  };

  const handleSelectAllActions = (checked: boolean) => {
    if (checked) {
      setSelectedActions(actionOptions.map((a) => a.key));
    } else {
      setSelectedActions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageName.trim() || !subject.trim()) return;

    const isEdit = !!permToEdit;
    const url = isEdit
      ? `http://localhost:3001/api/admin/permissions/${permToEdit.id}`
      : 'http://localhost:3001/api/admin/permissions';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: pageName.trim(),
          subject: subject.trim().toLowerCase(),
          availableActions: selectedActions,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPermissions();
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao salvar permissão.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (perm: PermissionItem) => {
    if (!confirm(`Deseja excluir a permissão "${perm.name}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/admin/permissions/${perm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchPermissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPermissions = permissions.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-[#fcfcfc] dark:bg-elite-black transition-colors duration-500 font-sans">
      <div className="p-6 sm:p-12 space-y-12 sm:space-y-16 max-w-7xl mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* ── HEADER DA PÁGINA ── */}
        <header className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-black/20 dark:text-white/20 tracking-[0.4em] uppercase">
              VISÃO GERAL DAS PERMISSÕES
            </span>
            <div className="h-px w-20 bg-black/5 dark:bg-white/5" />
          </div>
          <div className="flex justify-between items-end gap-6 flex-wrap">
            <h1 className="serif text-4xl sm:text-7xl italic font-light tracking-tighter text-black dark:text-white leading-tight">
              Lista Permissões
            </h1>
            <button
              onClick={() => handleOpenModal()}
              className="px-8 py-4 bg-white dark:bg-white/10 text-black dark:text-white border border-gray-200 dark:border-white/10 text-[9px] font-black tracking-[0.3em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm flex items-center gap-2"
            >
              <Plus size={14} /> CADASTRAR PERMISSÃO
            </button>
          </div>
          <p className="text-[11px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase leading-relaxed max-w-2xl">
            Gerencie os assuntos (subjects) e as ações disponíveis para vincular aos perfis de usuários do sistema.
          </p>
          <div className="h-px w-40 bg-black/10 dark:bg-white/10 mt-8" />
        </header>

        {/* ── TABELA DE PERMISSÕES ── */}
        <div className="p-8 bg-white dark:bg-elite-gray border border-gray-100 dark:border-white/5 space-y-6">
          {/* Search */}
          <div className="max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por assunto ou nome..."
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
                  <th className="py-4 px-4">PERMISSÕES (AÇÕES DISPONÍVEIS)</th>
                  <th className="py-4 px-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-xs">
                {filteredPermissions.map((perm) => (
                  <tr key={perm.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-normal text-black dark:text-white">
                      <span className="serif text-base italic">{perm.subject}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-2">
                        {perm.availableActions.map((act) => (
                          <span
                            key={act}
                            className="px-3 py-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[9px] font-bold text-black/70 dark:text-white/80 tracking-[0.2em] uppercase"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(perm)}
                          className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(perm)}
                          className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Criar / Editar Permissão */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 font-sans animate-modal-overlay">
            <div className="bg-white dark:bg-elite-gray border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-w-xl w-full relative space-y-6 animate-modal-content">
              <button
                onClick={() => setIsModalOpen(false)}
                className="ui-dialog-close-btn absolute top-6 right-6 p-2 text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <span className="text-[8px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                  CADASTRO DE RECURSOS
                </span>
                <h2 className="serif text-3xl italic font-light text-black dark:text-white">
                  {permToEdit ? 'Editar Permissão' : 'Criar Permissão'}
                </h2>
                <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">
                  Crie permissões conforme suas necessidades.
                </p>
              </div>

              {/* Warning Alert */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 p-4 flex gap-3 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11px]">
                  <span className="font-bold block mb-0.5 uppercase tracking-wider">Aviso importante</span>
                  Ao editar o nome da permissão, você pode comprometer a funcionalidade das permissões do sistema. Certifique-se antes de prosseguir.
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase mb-2">
                    NOME DA PÁGINA
                  </label>
                  <input
                    type="text"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="Insira o nome da página"
                    required
                    className="ui-input w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs font-light text-black dark:text-white tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase mb-2">
                    NOME DO ASSUNTO (SUBJECT)
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Insira o nome do assunto (ex: auth, users, roles)"
                    required
                    className="ui-input w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs font-light text-black dark:text-white tracking-wider"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                      AÇÕES DISPONÍVEIS
                    </label>
                    <label className="flex items-center gap-2 text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedActions.length === actionOptions.length}
                        onChange={(e) => handleSelectAllActions(e.target.checked)}
                        className="ui-checkbox"
                      />
                      <span>SELECIONAR TODOS</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {actionOptions.map((opt) => (
                      <label key={opt.key} className="flex items-center gap-2 text-xs text-black dark:text-white cursor-pointer font-light">
                        <input
                          type="checkbox"
                          checked={selectedActions.includes(opt.key)}
                          onChange={() => handleToggleAction(opt.key)}
                          className="ui-checkbox"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6 justify-end border-t border-gray-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-gray-200 dark:border-white/10 text-black dark:text-white text-[9px] font-black tracking-[0.3em] uppercase hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-white dark:bg-white/10 text-black dark:text-white border border-gray-200 dark:border-white/10 text-[9px] font-black tracking-[0.3em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm"
                  >
                    SALVAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
