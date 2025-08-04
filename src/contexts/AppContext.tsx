// Contexto principal da aplicação para gerenciamento de estado

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  Jogo, 
  Desenvolvedora, 
  Plataforma, 
  Genero,
  AppContextType,
  JogoFormData,
  DesenvolvedoraFormData,
  PlataformaFormData,
  GeneroFormData
} from '../types';
import { dataService } from '../services/dataService';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [desenvolvedoras, setDesenvolvedoras] = useState<Desenvolvedora[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);

  // Inicializar dados ao carregar o componente
  useEffect(() => {
    dataService.initializeData();
    loadAllData();
  }, []);

  const loadAllData = () => {
    setJogos(dataService.jogos.getAll());
    setDesenvolvedoras(dataService.desenvolvedoras.getAll());
    setPlataformas(dataService.plataformas.getAll());
    setGeneros(dataService.generos.getAll());
  };

  // Operações CRUD para Jogos
  const adicionarJogo = (jogoData: JogoFormData) => {
    const novoJogo = dataService.jogos.create(jogoData);
    setJogos(prev => [...prev, novoJogo]);
  };

  const atualizarJogo = (id: string, jogoData: JogoFormData) => {
    const jogoAtualizado = dataService.jogos.update(id, jogoData);
    if (jogoAtualizado) {
      setJogos(prev => prev.map(jogo => 
        jogo.id === id ? jogoAtualizado : jogo
      ));
    }
  };

  const removerJogo = (id: string) => {
    const sucesso = dataService.jogos.delete(id);
    if (sucesso) {
      setJogos(prev => prev.filter(jogo => jogo.id !== id));
    }
  };

  // Operações CRUD para Desenvolvedoras
  const adicionarDesenvolvedora = (devData: DesenvolvedoraFormData) => {
    const novaDesenvolvedora = dataService.desenvolvedoras.create(devData);
    setDesenvolvedoras(prev => [...prev, novaDesenvolvedora]);
  };

  const atualizarDesenvolvedora = (id: string, devData: DesenvolvedoraFormData) => {
    const desenvolvedoraAtualizada = dataService.desenvolvedoras.update(id, devData);
    if (desenvolvedoraAtualizada) {
      setDesenvolvedoras(prev => prev.map(dev => 
        dev.id === id ? desenvolvedoraAtualizada : dev
      ));
    }
  };

  const removerDesenvolvedora = (id: string) => {
    // Verificar se há jogos usando esta desenvolvedora
    const jogosComDesenvolvedora = jogos.filter(jogo => jogo.desenvolvedoraId === id);
    if (jogosComDesenvolvedora.length > 0) {
      alert(`Não é possível remover esta desenvolvedora pois existem ${jogosComDesenvolvedora.length} jogo(s) associado(s).`);
      return;
    }

    const sucesso = dataService.desenvolvedoras.delete(id);
    if (sucesso) {
      setDesenvolvedoras(prev => prev.filter(dev => dev.id !== id));
    }
  };

  // Operações CRUD para Plataformas
  const adicionarPlataforma = (platData: PlataformaFormData) => {
    const novaPlataforma = dataService.plataformas.create(platData);
    setPlataformas(prev => [...prev, novaPlataforma]);
  };

  const atualizarPlataforma = (id: string, platData: PlataformaFormData) => {
    const plataformaAtualizada = dataService.plataformas.update(id, platData);
    if (plataformaAtualizada) {
      setPlataformas(prev => prev.map(plat => 
        plat.id === id ? plataformaAtualizada : plat
      ));
    }
  };

  const removerPlataforma = (id: string) => {
    // Verificar se há jogos usando esta plataforma
    const jogosComPlataforma = jogos.filter(jogo => jogo.plataformaIds.includes(id));
    if (jogosComPlataforma.length > 0) {
      alert(`Não é possível remover esta plataforma pois existem ${jogosComPlataforma.length} jogo(s) associado(s).`);
      return;
    }

    const sucesso = dataService.plataformas.delete(id);
    if (sucesso) {
      setPlataformas(prev => prev.filter(plat => plat.id !== id));
    }
  };

  // Operações CRUD para Gêneros
  const adicionarGenero = (genData: GeneroFormData) => {
    const novoGenero = dataService.generos.create(genData);
    setGeneros(prev => [...prev, novoGenero]);
  };

  const atualizarGenero = (id: string, genData: GeneroFormData) => {
    const generoAtualizado = dataService.generos.update(id, genData);
    if (generoAtualizado) {
      setGeneros(prev => prev.map(gen => 
        gen.id === id ? generoAtualizado : gen
      ));
    }
  };

  const removerGenero = (id: string) => {
    // Verificar se há jogos usando este gênero
    const jogosComGenero = jogos.filter(jogo => jogo.generoIds.includes(id));
    if (jogosComGenero.length > 0) {
      alert(`Não é possível remover este gênero pois existem ${jogosComGenero.length} jogo(s) associado(s).`);
      return;
    }

    const sucesso = dataService.generos.delete(id);
    if (sucesso) {
      setGeneros(prev => prev.filter(gen => gen.id !== id));
    }
  };

  const contextValue: AppContextType = {
    jogos,
    desenvolvedoras,
    plataformas,
    generos,
    adicionarJogo,
    atualizarJogo,
    removerJogo,
    adicionarDesenvolvedora,
    atualizarDesenvolvedora,
    removerDesenvolvedora,
    adicionarPlataforma,
    atualizarPlataforma,
    removerPlataforma,
    adicionarGenero,
    atualizarGenero,
    removerGenero
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

