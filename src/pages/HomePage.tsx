// Página inicial com dashboard

import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Users, Monitor, Tag, Plus, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Button from '../components/common/Button';

const HomePage: React.FC = () => {
  const { jogos, desenvolvedoras, plataformas, generos } = useApp();

  const stats = [
    {
      title: 'Total de Jogos',
      value: jogos.length,
      icon: Gamepad2,
      color: 'bg-blue-500',
      link: '/jogos'
    },
    {
      title: 'Desenvolvedoras',
      value: desenvolvedoras.length,
      icon: Users,
      color: 'bg-green-500',
      link: '/desenvolvedoras'
    },
    {
      title: 'Plataformas',
      value: plataformas.length,
      icon: Monitor,
      color: 'bg-purple-500',
      link: '/plataformas'
    },
    {
      title: 'Gêneros',
      value: generos.length,
      icon: Tag,
      color: 'bg-orange-500',
      link: '/generos'
    }
  ];

  const jogosRecentes = jogos
    .sort((a, b) => new Date(b.dataLancamento).getTime() - new Date(a.dataLancamento).getTime())
    .slice(0, 5);

  const precoMedio = jogos.length > 0 
    ? jogos.reduce((acc, jogo) => acc + jogo.preco, 0) / jogos.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral do seu catálogo de jogos
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/jogos/">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Jogo
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jogos Recentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Jogos Recentes
            </h2>
            <Link to="/jogos">
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </Link>
          </div>
          
          {jogosRecentes.length > 0 ? (
            <div className="space-y-3">
              {jogosRecentes.map((jogo) => {
                const desenvolvedora = desenvolvedoras.find(d => d.id === jogo.desenvolvedoraId);
                return (
                  <div key={jogo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{jogo.titulo}</h3>
                      <p className="text-sm text-gray-600">
                        {desenvolvedora?.nome} • {new Date(jogo.dataLancamento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(jogo.preco)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum jogo cadastrado ainda</p>
              <Link to="/jogos/">
                <Button className="mt-3">
                  Cadastrar Primeiro Jogo
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Estatísticas
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Preço Médio</span>
              </div>
              <span className="font-semibold text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(precoMedio)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-gray-600">Plataformas Ativas</span>
              </div>
              <span className="font-semibold text-gray-900">
                {plataformas.length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Desenvolvedoras</span>
              </div>
              <span className="font-semibold text-gray-900">
                {desenvolvedoras.length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-gray-600">Gêneros</span>
              </div>
              <span className="font-semibold text-gray-900">
                {generos.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

