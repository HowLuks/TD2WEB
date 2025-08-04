// Card para exibir informações de um jogo

import React from 'react';
import { Edit, Trash2, Calendar, DollarSign, Star } from 'lucide-react';
import { Jogo } from '../../types';
import { useApp } from '../../contexts/AppContext';
import Button from '../common/Button';

interface JogoCardProps {
  jogo: Jogo;
  onEdit: (jogo: Jogo) => void;
  onDelete: (jogo: Jogo) => void;
}

const JogoCard: React.FC<JogoCardProps> = ({ jogo, onEdit, onDelete }) => {
  const { desenvolvedoras, plataformas, generos } = useApp();

  const desenvolvedora = desenvolvedoras.find(d => d.id === jogo.desenvolvedoraId);
  const jogoPlataformas = plataformas.filter(p => jogo.plataformaIds.includes(p.id));
  const jogoGeneros = generos.filter(g => jogo.generoIds.includes(g.id));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagem */}
      {jogo.imagemUrl && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={jogo.imagemUrl}
            alt={jogo.titulo}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {jogo.titulo}
            </h3>
            <p className="text-sm text-gray-600">
              {desenvolvedora?.nome}
            </p>
          </div>
          
          {jogo.avaliacaoMedia && (
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-md">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">
                {jogo.avaliacaoMedia.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Descrição */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {jogo.descricao}
        </p>

        {/* Informações */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Lançamento: {formatDate(jogo.dataLancamento)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="font-medium text-gray-900">
              {formatPrice(jogo.preco)}
            </span>
          </div>
        </div>

        {/* Plataformas */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Plataformas:</p>
          <div className="flex flex-wrap gap-1">
            {jogoPlataformas.map(plataforma => (
              <span
                key={plataforma.id}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md"
              >
                {plataforma.nome}
              </span>
            ))}
          </div>
        </div>

        {/* Gêneros */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Gêneros:</p>
          <div className="flex flex-wrap gap-1">
            {jogoGeneros.map(genero => (
              <span
                key={genero.id}
                className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md"
              >
                {genero.nome}
              </span>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(jogo)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(jogo)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JogoCard;

