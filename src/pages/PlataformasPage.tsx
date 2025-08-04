// Página de gerenciamento de plataformas

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Monitor } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Plataforma, PlataformaFormData } from '../types';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

const PlataformasPage: React.FC = () => {
  const { plataformas, adicionarPlataforma, atualizarPlataforma, removerPlataforma } = useApp();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPlataforma, setEditingPlataforma] = useState<Plataforma | undefined>();
  const [deletingPlataforma, setDeletingPlataforma] = useState<Plataforma | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<PlataformaFormData>({
    nome: '',
    fabricante: '',
    anoLancamento: new Date().getFullYear(),
    tipo: 'Console',
    descricao: ''
  });

  const handleCreate = () => {
    setEditingPlataforma(undefined);
    setFormData({
      nome: '',
      fabricante: '',
      anoLancamento: new Date().getFullYear(),
      tipo: 'Console',
      descricao: ''
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (plataforma: Plataforma) => {
    setEditingPlataforma(plataforma);
    setFormData({
      nome: plataforma.nome,
      fabricante: plataforma.fabricante,
      anoLancamento: plataforma.anoLancamento,
      tipo: plataforma.tipo,
      descricao: plataforma.descricao || ''
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = (plataforma: Plataforma) => {
    setDeletingPlataforma(plataforma);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingPlataforma) {
        atualizarPlataforma(editingPlataforma.id, formData);
      } else {
        adicionarPlataforma(formData);
      }
      setIsFormModalOpen(false);
      setEditingPlataforma(undefined);
    } catch (error) {
      console.error('Erro ao salvar plataforma:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingPlataforma) {
      removerPlataforma(deletingPlataforma.id);
      setDeletingPlataforma(undefined);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Console':
        return '🎮';
      case 'PC':
        return '💻';
      case 'Mobile':
        return '📱';
      case 'Handheld':
        return '🎮';
      default:
        return '🎮';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plataformas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as plataformas de jogos ({plataformas.length} {plataformas.length === 1 ? 'plataforma' : 'plataformas'})
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Plataforma
        </Button>
      </div>

      {/* Lista de Plataformas */}
      {plataformas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plataformas.map(plataforma => (
            <div key={plataforma.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getTipoIcon(plataforma.tipo)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plataforma.nome}
                    </h3>
                    <p className="text-sm text-gray-500">{plataforma.tipo}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(plataforma)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(plataforma)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Fabricante:</strong> {plataforma.fabricante}</p>
                <p><strong>Lançamento:</strong> {plataforma.anoLancamento}</p>
                {plataforma.descricao && (
                  <p className="mt-3 text-gray-700">{plataforma.descricao}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Monitor className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma plataforma cadastrada</h3>
          <p className="text-gray-600 mb-4">Comece adicionando sua primeira plataforma.</p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Plataforma
          </Button>
        </div>
      )}

      {/* Modal do Formulário */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPlataforma(undefined);
        }}
        title={editingPlataforma ? 'Editar Plataforma' : 'Nova Plataforma'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="nome"
              required
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="fabricante" className="block text-sm font-medium text-gray-700 mb-1">
              Fabricante *
            </label>
            <input
              type="text"
              id="fabricante"
              required
              value={formData.fabricante}
              onChange={(e) => setFormData(prev => ({ ...prev, fabricante: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              id="tipo"
              required
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Console">Console</option>
              <option value="PC">PC</option>
              <option value="Mobile">Mobile</option>
              <option value="Handheld">Handheld</option>
            </select>
          </div>

          <div>
            <label htmlFor="anoLancamento" className="block text-sm font-medium text-gray-700 mb-1">
              Ano de Lançamento *
            </label>
            <input
              type="number"
              id="anoLancamento"
              required
              min="1970"
              max={new Date().getFullYear() + 5}
              value={formData.anoLancamento}
              onChange={(e) => setFormData(prev => ({ ...prev, anoLancamento: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="descricao"
              rows={3}
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsFormModalOpen(false);
                setEditingPlataforma(undefined);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {editingPlataforma ? 'Atualizar' : 'Criar'} Plataforma
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingPlataforma(undefined);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Plataforma"
        message={`Tem certeza que deseja excluir a plataforma "${deletingPlataforma?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default PlataformasPage;

