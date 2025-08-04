// Página de gerenciamento de desenvolvedoras

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Globe } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Desenvolvedora, DesenvolvedoraFormData } from '../types';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

const DesenvolvedorasPage: React.FC = () => {
  const { desenvolvedoras, adicionarDesenvolvedora, atualizarDesenvolvedora, removerDesenvolvedora } = useApp();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDesenvolvedora, setEditingDesenvolvedora] = useState<Desenvolvedora | undefined>();
  const [deletingDesenvolvedora, setDeletingDesenvolvedora] = useState<Desenvolvedora | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<DesenvolvedoraFormData>({
    nome: '',
    paisOrigem: '',
    anoFundacao: new Date().getFullYear(),
    website: '',
    descricao: ''
  });

  const handleCreate = () => {
    setEditingDesenvolvedora(undefined);
    setFormData({
      nome: '',
      paisOrigem: '',
      anoFundacao: new Date().getFullYear(),
      website: '',
      descricao: ''
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (desenvolvedora: Desenvolvedora) => {
    setEditingDesenvolvedora(desenvolvedora);
    setFormData({
      nome: desenvolvedora.nome,
      paisOrigem: desenvolvedora.paisOrigem,
      anoFundacao: desenvolvedora.anoFundacao,
      website: desenvolvedora.website || '',
      descricao: desenvolvedora.descricao || ''
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = (desenvolvedora: Desenvolvedora) => {
    setDeletingDesenvolvedora(desenvolvedora);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingDesenvolvedora) {
        atualizarDesenvolvedora(editingDesenvolvedora.id, formData);
      } else {
        adicionarDesenvolvedora(formData);
      }
      setIsFormModalOpen(false);
      setEditingDesenvolvedora(undefined);
    } catch (error) {
      console.error('Erro ao salvar desenvolvedora:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingDesenvolvedora) {
      removerDesenvolvedora(deletingDesenvolvedora.id);
      setDeletingDesenvolvedora(undefined);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Desenvolvedoras</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as desenvolvedoras de jogos ({desenvolvedoras.length} {desenvolvedoras.length === 1 ? 'desenvolvedora' : 'desenvolvedoras'})
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Desenvolvedora
        </Button>
      </div>

      {/* Lista de Desenvolvedoras */}
      {desenvolvedoras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {desenvolvedoras.map(desenvolvedora => (
            <div key={desenvolvedora.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {desenvolvedora.nome}
                </h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(desenvolvedora)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(desenvolvedora)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>País:</strong> {desenvolvedora.paisOrigem}</p>
                <p><strong>Fundação:</strong> {desenvolvedora.anoFundacao}</p>
                {desenvolvedora.website && (
                  <p className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    <a href={desenvolvedora.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </p>
                )}
                {desenvolvedora.descricao && (
                  <p className="mt-3 text-gray-700">{desenvolvedora.descricao}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma desenvolvedora cadastrada</h3>
          <p className="text-gray-600 mb-4">Comece adicionando sua primeira desenvolvedora.</p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Desenvolvedora
          </Button>
        </div>
      )}

      {/* Modal do Formulário */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingDesenvolvedora(undefined);
        }}
        title={editingDesenvolvedora ? 'Editar Desenvolvedora' : 'Nova Desenvolvedora'}
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
            <label htmlFor="paisOrigem" className="block text-sm font-medium text-gray-700 mb-1">
              País de Origem *
            </label>
            <input
              type="text"
              id="paisOrigem"
              required
              value={formData.paisOrigem}
              onChange={(e) => setFormData(prev => ({ ...prev, paisOrigem: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="anoFundacao" className="block text-sm font-medium text-gray-700 mb-1">
              Ano de Fundação *
            </label>
            <input
              type="number"
              id="anoFundacao"
              required
              min="1800"
              max={new Date().getFullYear()}
              value={formData.anoFundacao}
              onChange={(e) => setFormData(prev => ({ ...prev, anoFundacao: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
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
                setEditingDesenvolvedora(undefined);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {editingDesenvolvedora ? 'Atualizar' : 'Criar'} Desenvolvedora
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingDesenvolvedora(undefined);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Desenvolvedora"
        message={`Tem certeza que deseja excluir a desenvolvedora "${deletingDesenvolvedora?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default DesenvolvedorasPage;

