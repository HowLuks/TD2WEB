// Formulário para criar/editar jogos

import React, { useState, useEffect } from 'react';
import { JogoFormData, Jogo } from '../../types';
import { useApp } from '../../contexts/AppContext';
import Button from '../common/Button';

interface JogoFormProps {
  jogo?: Jogo;
  onSubmit: (data: JogoFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const JogoForm: React.FC<JogoFormProps> = ({
  jogo,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { desenvolvedoras, plataformas, generos } = useApp();
  
  const [formData, setFormData] = useState<JogoFormData>({
    titulo: '',
    descricao: '',
    dataLancamento: '',
    preco: 0,
    desenvolvedoraId: '',
    plataformaIds: [],
    generoIds: [],
    imagemUrl: '',
    avaliacaoMedia: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (jogo) {
      setFormData({
        titulo: jogo.titulo,
        descricao: jogo.descricao,
        dataLancamento: jogo.dataLancamento,
        preco: jogo.preco,
        desenvolvedoraId: jogo.desenvolvedoraId,
        plataformaIds: jogo.plataformaIds,
        generoIds: jogo.generoIds,
        imagemUrl: jogo.imagemUrl || '',
        avaliacaoMedia: jogo.avaliacaoMedia
      });
    }
  }, [jogo]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.dataLancamento) {
      newErrors.dataLancamento = 'Data de lançamento é obrigatória';
    }

    if (formData.preco < 0) {
      newErrors.preco = 'Preço deve ser maior ou igual a zero';
    }

    if (!formData.desenvolvedoraId) {
      newErrors.desenvolvedoraId = 'Desenvolvedora é obrigatória';
    }

    if (formData.plataformaIds.length === 0) {
      newErrors.plataformaIds = 'Selecione pelo menos uma plataforma';
    }

    if (formData.generoIds.length === 0) {
      newErrors.generoIds = 'Selecione pelo menos um gênero';
    }

    if (formData.avaliacaoMedia !== undefined && (formData.avaliacaoMedia < 0 || formData.avaliacaoMedia > 10)) {
      newErrors.avaliacaoMedia = 'Avaliação deve estar entre 0 e 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handlePlataformaChange = (plataformaId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        plataformaIds: [...prev.plataformaIds, plataformaId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        plataformaIds: prev.plataformaIds.filter(id => id !== plataformaId)
      }));
    }
  };

  const handleGeneroChange = (generoId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        generoIds: [...prev.generoIds, generoId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        generoIds: prev.generoIds.filter(id => id !== generoId)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          type="text"
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.titulo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o título do jogo"
        />
        {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          id="descricao"
          rows={3}
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.descricao ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite a descrição do jogo"
        />
        {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
      </div>

      {/* Data de Lançamento e Preço */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dataLancamento" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Lançamento *
          </label>
          <input
            type="date"
            id="dataLancamento"
            value={formData.dataLancamento}
            onChange={(e) => setFormData(prev => ({ ...prev, dataLancamento: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dataLancamento ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dataLancamento && <p className="text-red-500 text-sm mt-1">{errors.dataLancamento}</p>}
        </div>

        <div>
          <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
            Preço (R$) *
          </label>
          <input
            type="number"
            id="preco"
            min="0"
            step="0.01"
            value={formData.preco}
            onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.preco ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0,00"
          />
          {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco}</p>}
        </div>
      </div>

      {/* Desenvolvedora */}
      <div>
        <label htmlFor="desenvolvedoraId" className="block text-sm font-medium text-gray-700 mb-1">
          Desenvolvedora *
        </label>
        <select
          id="desenvolvedoraId"
          value={formData.desenvolvedoraId}
          onChange={(e) => setFormData(prev => ({ ...prev, desenvolvedoraId: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.desenvolvedoraId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Selecione uma desenvolvedora</option>
          {desenvolvedoras.map(dev => (
            <option key={dev.id} value={dev.id}>
              {dev.nome}
            </option>
          ))}
        </select>
        {errors.desenvolvedoraId && <p className="text-red-500 text-sm mt-1">{errors.desenvolvedoraId}</p>}
      </div>

      {/* Plataformas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Plataformas *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {plataformas.map(plataforma => (
            <label key={plataforma.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.plataformaIds.includes(plataforma.id)}
                onChange={(e) => handlePlataformaChange(plataforma.id, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{plataforma.nome}</span>
            </label>
          ))}
        </div>
        {errors.plataformaIds && <p className="text-red-500 text-sm mt-1">{errors.plataformaIds}</p>}
      </div>

      {/* Gêneros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gêneros *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {generos.map(genero => (
            <label key={genero.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.generoIds.includes(genero.id)}
                onChange={(e) => handleGeneroChange(genero.id, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{genero.nome}</span>
            </label>
          ))}
        </div>
        {errors.generoIds && <p className="text-red-500 text-sm mt-1">{errors.generoIds}</p>}
      </div>

      {/* URL da Imagem e Avaliação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="imagemUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL da Imagem
          </label>
          <input
            type="url"
            id="imagemUrl"
            value={formData.imagemUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, imagemUrl: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div>
          <label htmlFor="avaliacaoMedia" className="block text-sm font-medium text-gray-700 mb-1">
            Avaliação Média (0-10)
          </label>
          <input
            type="number"
            id="avaliacaoMedia"
            min="0"
            max="10"
            step="0.1"
            value={formData.avaliacaoMedia || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              avaliacaoMedia: e.target.value ? parseFloat(e.target.value) : undefined 
            }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.avaliacaoMedia ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="8.5"
          />
          {errors.avaliacaoMedia && <p className="text-red-500 text-sm mt-1">{errors.avaliacaoMedia}</p>}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          {jogo ? 'Atualizar' : 'Criar'} Jogo
        </Button>
      </div>
    </form>
  );
};

export default JogoForm;

