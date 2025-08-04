// Página de gerenciamento de gêneros

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Genero, GeneroFormData } from '../types';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

const GenerosPage: React.FC = () => {
  const { generos, adicionarGenero, atualizarGenero, removerGenero } = useApp();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingGenero, setEditingGenero] = useState<Genero | undefined>();
  const [deletingGenero, setDeletingGenero] = useState<Genero | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<GeneroFormData>({
    nome: '',
    descricao: ''
  });

  const handleCreate = () => {
    setEditingGenero(undefined);
    setFormData({
      nome: '',
      descricao: ''
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (genero: Genero) => {
    setEditingGenero(genero);
    setFormData({
      nome: genero.nome,
      descricao: genero.descricao || ''
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = (genero: Genero) => {
    setDeletingGenero(genero);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingGenero) {
        atualizarGenero(editingGenero.id, formData);
      } else {
        adicionarGenero(formData);
      }
      setIsFormModalOpen(false);
      setEditingGenero(undefined);
    } catch (error) {
      console.error('Erro ao salvar gênero:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingGenero) {
      removerGenero(deletingGenero.id);
      setDeletingGenero(undefined);
    }
  };

  const getGeneroColor = (nome: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-gray-100 text-gray-800'
    ];
    const index = nome.length % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gêneros</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os gêneros de jogos ({generos.length} {generos.length === 1 ? 'gênero' : 'gêneros'})
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Gênero
        </Button>
      </div>

      {/* Lista de Gêneros */}
      {generos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generos.map(genero => (
            <div key={genero.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGeneroColor(genero.nome)} mr-3`}>
                    <Tag className="h-4 w-4 mr-1" />
                    {genero.nome}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(genero)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(genero)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {genero.descricao && (
                <div className="text-sm text-gray-600">
                  <p>{genero.descricao}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Tag className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum gênero cadastrado</h3>
          <p className="text-gray-600 mb-4">Comece adicionando seu primeiro gênero.</p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Gênero
          </Button>
        </div>
      )}

      {/* Modal do Formulário */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGenero(undefined);
        }}
        title={editingGenero ? 'Editar Gênero' : 'Novo Gênero'}
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
              placeholder="Ex: RPG, FPS, Aventura..."
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="descricao"
              rows={4}
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva as características deste gênero..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsFormModalOpen(false);
                setEditingGenero(undefined);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {editingGenero ? 'Atualizar' : 'Criar'} Gênero
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingGenero(undefined);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Gênero"
        message={`Tem certeza que deseja excluir o gênero "${deletingGenero?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default GenerosPage;

