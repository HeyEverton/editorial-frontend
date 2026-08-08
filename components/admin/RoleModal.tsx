import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PermissionItem {
  id: string;
  name: string;
  subject: string;
  availableActions: string[];
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: { id?: string; name: string; description: string; permissions: { permissionId: string; actions: string[] }[] }) => Promise<void>;
  roleToEdit?: any;
  availablePermissions: PermissionItem[];
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  roleToEdit,
  availablePermissions,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (roleToEdit) {
      setName(roleToEdit.name || '');
      setDescription(roleToEdit.description || '');

      const initialMap: Record<string, string[]> = {};
      if (Array.isArray(roleToEdit.permissions)) {
        roleToEdit.permissions.forEach((p: any) => {
          initialMap[p.permissionId] = Array.isArray(p.actions) ? p.actions : [];
        });
      }
      setSelectedPermissions(initialMap);
    } else {
      setName('');
      setDescription('');
      setSelectedPermissions({});
    }
  }, [roleToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleAction = (permissionId: string, action: string) => {
    setSelectedPermissions((prev) => {
      const currentActions = prev[permissionId] || [];
      const updated = currentActions.includes(action)
        ? currentActions.filter((a) => a !== action)
        : [...currentActions, action];

      return {
        ...prev,
        [permissionId]: updated,
      };
    });
  };

  const isActionSelected = (permissionId: string, action: string) => {
    return (selectedPermissions[permissionId] || []).includes(action);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedPermissions({});
      return;
    }

    const allMap: Record<string, string[]> = {};
    availablePermissions.forEach((p) => {
      allMap[p.id] = [...(p.availableActions || ['read', 'list', 'create', 'edit', 'delete'])];
    });
    setSelectedPermissions(allMap);
  };

  const isAllSelected = () => {
    if (availablePermissions.length === 0) return false;
    return availablePermissions.every((p) => {
      const current = selectedPermissions[p.id] || [];
      return (p.availableActions || []).every((act) => current.includes(act));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const permissionsArray = Object.entries(selectedPermissions)
        .filter(([_, actions]) => actions.length > 0)
        .map(([permissionId, actions]) => ({ permissionId, actions }));

      await onSave({
        id: roleToEdit?.id,
        name: name.trim(),
        description: description.trim(),
        permissions: permissionsArray,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto font-sans animate-modal-overlay">
      <div className="bg-white dark:bg-elite-gray border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden relative animate-modal-content">
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
            CONFIGURAÇÃO DE ACESSO
          </span>
          <h2 className="serif text-3xl italic font-light text-black dark:text-white">
            {roleToEdit ? 'Editar Perfil' : 'Criar Perfil'}
          </h2>
          <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">
            Escolha as permissões associadas a este perfil
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="py-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <label className="block text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase mb-2">
              NOME DO PERFIL
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Insira o nome do Perfil (ex: Gestor de Conteúdo)"
              required
              className="ui-input w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-elite-black text-xs font-light text-black dark:text-white tracking-wider"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="serif text-xl italic text-black dark:text-white">
                Permissões do Perfil
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                <input
                  type="checkbox"
                  checked={isAllSelected()}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="ui-checkbox"
                />
                <span>SELECIONAR TUDO</span>
              </label>
            </div>

            {/* Matrix Table */}
            <div className="divide-y divide-gray-100 dark:divide-white/5 border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              {availablePermissions.map((perm) => (
                <div key={perm.id} className="p-4 hover:bg-white dark:hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <span className="serif text-sm italic font-normal text-black dark:text-white w-44 shrink-0">
                    {perm.subject}
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    {perm.availableActions.map((action) => {
                      const selected = isActionSelected(perm.id, action);
                      return (
                        <label key={action} className="flex items-center gap-2 cursor-pointer text-xs text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white font-light">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleAction(perm.id, action)}
                            className="ui-checkbox"
                          />
                          <span className="capitalize">{action}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
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
              {isSaving ? 'SALVANDO...' : 'SALVAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
