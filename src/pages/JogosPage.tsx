// Página de gerenciamento de jogos

import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Jogo, JogoFormData, FiltroJogos } from '../types';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import JogoForm from '../components/jogos/JogoForm';
import JogoCard from '../components/jogos/JogoCard';

const JogosPage: React.FC = () => {
  const { jogos, desenvolvedoras, plataformas, generos, adicionarJogo, atualizarJogo, removerJogo } = useApp();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingJogo, setEditingJogo] = useState<Jogo | undefined>();
  const [deletingJogo, setDeletingJogo] = useState<Jogo | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<FiltroJogos>({});
  const [showFilters, setShowFilters] = useState(false);

  // Jogos filtrados
  const jogosFiltrados = useMemo(() => {
    let resultado = [...jogos];

    // Filtro por texto
    if (searchTerm.trim()) {
      const termo = searchTerm.toLowerCase();
      resultado = resultado.filter(jogo =>
        jogo.titulo.toLowerCase().includes(termo) ||
        jogo.descricao.toLowerCase().includes(termo)
      );
    }

    // Filtro por desenvolvedora
    if (filtros.desenvolvedoraId) {
      resultado = resultado.filter(jogo => jogo.desenvolvedoraId === filtros.desenvolvedoraId);
    }

    // Filtro por plataforma
    if (filtros.plataformaId) {
      resultado = resultado.filter(jogo => jogo.plataformaIds.includes(filtros.plataformaId!));
    }

    // Filtro por gênero
    if (filtros.generoId) {
      resultado = resultado.filter(jogo => jogo.generoIds.includes(filtros.generoId!));
    }

    // Filtro por preço
    if (filtros.precoMin !== undefined) {
      resultado = resultado.filter(jogo => jogo.preco >= filtros.precoMin!);
    }
    if (filtros.precoMax !== undefined) {
      resultado = resultado.filter(jogo => jogo.preco <= filtros.precoMax!);
    }

    return resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }, [jogos, searchTerm, filtros]);

  const handleCreateJogo = () => {
    setEditingJogo(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditJogo = (jogo: Jogo) => {
    setEditingJogo(jogo);
    setIsFormModalOpen(true);
  };

  const handleDeleteJogo = (jogo: Jogo) => {
    setDeletingJogo(jogo);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: JogoFormData) => {
    setIsLoading(true);
    try {
      if (editingJogo) {
        atualizarJogo(editingJogo.id, data);
      } else {
        adicionarJogo(data);
      }
      setIsFormModalOpen(false);
      setEditingJogo(undefined);
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingJogo) {
      removerJogo(deletingJogo.id);
      setDeletingJogo(undefined);
    }
  };

  const clearFilters = () => {
    setFiltros({});
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm.trim() || Object.values(filtros).some(value => value !== undefined && value !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jogos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seu catálogo de jogos ({jogosFiltrados.length} {jogosFiltrados.length === 1 ? 'jogo' : 'jogos'})
          </p>
        </div>
        <Button onClick={handleCreateJogo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Jogo
        </Button>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar jogos por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Botão de filtros */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                Ativo
              </span>
            )}
          </Button>
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Desenvolvedora */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desenvolvedora
                </label>
                <select
                  value={filtros.desenvolvedoraId || ''}
                  onChange={(e) => setFiltros(prev => ({ ...prev, desenvolvedoraId: e.target.value || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  {desenvolvedoras.map(dev => (
                    <option key={dev.id} value={dev.id}>
                      {dev.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plataforma */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plataforma
                </label>
                <select
                  value={filtros.plataformaId || ''}
                  onChange={(e) => setFiltros(prev => ({ ...prev, plataformaId: e.target.value || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  {plataformas.map(plat => (
                    <option key={plat.id} value={plat.id}>
                      {plat.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gênero
                </label>
                <select
                  value={filtros.generoId || ''}
                  onChange={(e) => setFiltros(prev => ({ ...prev, generoId: e.target.value || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {generos.map(gen => (
                    <option key={gen.id} value={gen.id}>
                      {gen.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filtros.precoMin || ''}
                    onChange={(e) => setFiltros(prev => ({ 
                      ...prev, 
                      precoMin: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filtros.precoMax || ''}
                    onChange={(e) => setFiltros(prev => ({ 
                      ...prev, 
                      precoMax: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de Jogos */}
      {jogosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jogosFiltrados.map(jogo => (
            <JogoCard
              key={jogo.id}
              jogo={jogo}
              onEdit={handleEditJogo}
              onDelete={handleDeleteJogo}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? 'Nenhum jogo encontrado' : 'Nenhum jogo cadastrado'}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters 
              ? 'Tente ajustar os filtros para encontrar jogos.'
              : 'Comece adicionando seu primeiro jogo ao catálogo.'
            }
          </p>
          {!hasActiveFilters && (
            <Button onClick={handleCreateJogo}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Jogo
            </Button>
          )}
        </div>
      )}

      {/* Modal do Formulário */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingJogo(undefined);
        }}
        title={editingJogo ? 'Editar Jogo' : 'Novo Jogo'}
        size="lg"
      >
        <JogoForm
          jogo={editingJogo}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setEditingJogo(undefined);
          }}
          isLoading={isLoading}
        />
      </Modal>

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingJogo(undefined);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Jogo"
        message={`Tem certeza que deseja excluir o jogo "${deletingJogo?.titulo}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default JogosPage;

