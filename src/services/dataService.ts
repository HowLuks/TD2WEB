// Serviço para operações CRUD com localStorage

import { 
  Jogo, 
  Desenvolvedora, 
  Plataforma, 
  Genero,
  JogoFormData,
  DesenvolvedoraFormData,
  PlataformaFormData,
  GeneroFormData
} from '../types';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';

// Dados iniciais para popular o sistema
const dadosIniciais = {
  desenvolvedoras: [
    {
      id: generateId(),
      nome: 'Nintendo',
      paisOrigem: 'Japão',
      anoFundacao: 1889,
      website: 'https://www.nintendo.com',
      descricao: 'Empresa japonesa de videogames e entretenimento'
    },
    {
      id: generateId(),
      nome: 'Valve Corporation',
      paisOrigem: 'Estados Unidos',
      anoFundacao: 1996,
      website: 'https://www.valvesoftware.com',
      descricao: 'Desenvolvedora americana conhecida por Half-Life e Steam'
    },
    {
      id: generateId(),
      nome: 'CD Projekt RED',
      paisOrigem: 'Polônia',
      anoFundacao: 2002,
      website: 'https://www.cdprojektred.com',
      descricao: 'Estúdio polonês famoso por The Witcher e Cyberpunk 2077'
    }
  ] as Desenvolvedora[],

  plataformas: [
    {
      id: generateId(),
      nome: 'Nintendo Switch',
      fabricante: 'Nintendo',
      tipo: 'Console' as const,
      anoLancamento: 2017
    },
    {
      id: generateId(),
      nome: 'PlayStation 5',
      fabricante: 'Sony',
      tipo: 'Console' as const,
      anoLancamento: 2020
    },
    {
      id: generateId(),
      nome: 'PC',
      fabricante: 'Vários',
      tipo: 'PC' as const,
      anoLancamento: 1981
    },
    {
      id: generateId(),
      nome: 'Xbox Series X/S',
      fabricante: 'Microsoft',
      tipo: 'Console' as const,
      anoLancamento: 2020
    }
  ] as Plataforma[],

  generos: [
    {
      id: generateId(),
      nome: 'RPG',
      descricao: 'Role-Playing Game - Jogos de interpretação de personagens'
    },
    {
      id: generateId(),
      nome: 'FPS',
      descricao: 'First-Person Shooter - Jogos de tiro em primeira pessoa'
    },
    {
      id: generateId(),
      nome: 'Aventura',
      descricao: 'Jogos focados em exploração e narrativa'
    },
    {
      id: generateId(),
      nome: 'Plataforma',
      descricao: 'Jogos que envolvem pular entre plataformas'
    },
    {
      id: generateId(),
      nome: 'Estratégia',
      descricao: 'Jogos que requerem planejamento e táticas'
    }
  ] as Genero[]
};

export const dataService = {
  // Inicialização dos dados
  initializeData: () => {
    if (storage.getDesenvolvedoras().length === 0) {
      storage.setDesenvolvedoras(dadosIniciais.desenvolvedoras);
    }
    if (storage.getPlataformas().length === 0) {
      storage.setPlataformas(dadosIniciais.plataformas);
    }
    if (storage.getGeneros().length === 0) {
      storage.setGeneros(dadosIniciais.generos);
    }
  },

  // CRUD para Jogos
  jogos: {
    getAll: (): Jogo[] => storage.getJogos(),
    
    getById: (id: string): Jogo | undefined => {
      const jogos = storage.getJogos();
      return jogos.find(jogo => jogo.id === id);
    },
    
    create: (jogoData: JogoFormData): Jogo => {
      const jogos = storage.getJogos();
      const novoJogo: Jogo = {
        ...jogoData,
        id: generateId()
      };
      
      const jogosAtualizados = [...jogos, novoJogo];
      storage.setJogos(jogosAtualizados);
      return novoJogo;
    },
    
    update: (id: string, jogoData: JogoFormData): Jogo | null => {
      const jogos = storage.getJogos();
      const index = jogos.findIndex(jogo => jogo.id === id);
      
      if (index === -1) return null;
      
      const jogoAtualizado: Jogo = {
        ...jogoData,
        id
      };
      
      jogos[index] = jogoAtualizado;
      storage.setJogos(jogos);
      return jogoAtualizado;
    },
    
    delete: (id: string): boolean => {
      const jogos = storage.getJogos();
      const jogosAtualizados = jogos.filter(jogo => jogo.id !== id);
      
      if (jogosAtualizados.length === jogos.length) return false;
      
      storage.setJogos(jogosAtualizados);
      return true;
    }
  },

  // CRUD para Desenvolvedoras
  desenvolvedoras: {
    getAll: (): Desenvolvedora[] => storage.getDesenvolvedoras(),
    
    getById: (id: string): Desenvolvedora | undefined => {
      const desenvolvedoras = storage.getDesenvolvedoras();
      return desenvolvedoras.find(dev => dev.id === id);
    },
    
    create: (devData: DesenvolvedoraFormData): Desenvolvedora => {
      const desenvolvedoras = storage.getDesenvolvedoras();
      const novaDesenvolvedora: Desenvolvedora = {
        ...devData,
        id: generateId()
      };
      
      const desenvolvedorasAtualizadas = [...desenvolvedoras, novaDesenvolvedora];
      storage.setDesenvolvedoras(desenvolvedorasAtualizadas);
      return novaDesenvolvedora;
    },
    
    update: (id: string, devData: DesenvolvedoraFormData): Desenvolvedora | null => {
      const desenvolvedoras = storage.getDesenvolvedoras();
      const index = desenvolvedoras.findIndex(dev => dev.id === id);
      
      if (index === -1) return null;
      
      const desenvolvedoraAtualizada: Desenvolvedora = {
        ...devData,
        id
      };
      
      desenvolvedoras[index] = desenvolvedoraAtualizada;
      storage.setDesenvolvedoras(desenvolvedoras);
      return desenvolvedoraAtualizada;
    },
    
    delete: (id: string): boolean => {
      const desenvolvedoras = storage.getDesenvolvedoras();
      const desenvolvedorasAtualizadas = desenvolvedoras.filter(dev => dev.id !== id);
      
      if (desenvolvedorasAtualizadas.length === desenvolvedoras.length) return false;
      
      storage.setDesenvolvedoras(desenvolvedorasAtualizadas);
      return true;
    }
  },

  // CRUD para Plataformas
  plataformas: {
    getAll: (): Plataforma[] => storage.getPlataformas(),
    
    getById: (id: string): Plataforma | undefined => {
      const plataformas = storage.getPlataformas();
      return plataformas.find(plat => plat.id === id);
    },
    
    create: (platData: PlataformaFormData): Plataforma => {
      const plataformas = storage.getPlataformas();
      const novaPlataforma: Plataforma = {
        ...platData,
        id: generateId()
      };
      
      const plataformasAtualizadas = [...plataformas, novaPlataforma];
      storage.setPlataformas(plataformasAtualizadas);
      return novaPlataforma;
    },
    
    update: (id: string, platData: PlataformaFormData): Plataforma | null => {
      const plataformas = storage.getPlataformas();
      const index = plataformas.findIndex(plat => plat.id === id);
      
      if (index === -1) return null;
      
      const plataformaAtualizada: Plataforma = {
        ...platData,
        id
      };
      
      plataformas[index] = plataformaAtualizada;
      storage.setPlataformas(plataformas);
      return plataformaAtualizada;
    },
    
    delete: (id: string): boolean => {
      const plataformas = storage.getPlataformas();
      const plataformasAtualizadas = plataformas.filter(plat => plat.id !== id);
      
      if (plataformasAtualizadas.length === plataformas.length) return false;
      
      storage.setPlataformas(plataformasAtualizadas);
      return true;
    }
  },

  // CRUD para Gêneros
  generos: {
    getAll: (): Genero[] => storage.getGeneros(),
    
    getById: (id: string): Genero | undefined => {
      const generos = storage.getGeneros();
      return generos.find(gen => gen.id === id);
    },
    
    create: (genData: GeneroFormData): Genero => {
      const generos = storage.getGeneros();
      const novoGenero: Genero = {
        ...genData,
        id: generateId()
      };
      
      const generosAtualizados = [...generos, novoGenero];
      storage.setGeneros(generosAtualizados);
      return novoGenero;
    },
    
    update: (id: string, genData: GeneroFormData): Genero | null => {
      const generos = storage.getGeneros();
      const index = generos.findIndex(gen => gen.id === id);
      
      if (index === -1) return null;
      
      const generoAtualizado: Genero = {
        ...genData,
        id
      };
      
      generos[index] = generoAtualizado;
      storage.setGeneros(generos);
      return generoAtualizado;
    },
    
    delete: (id: string): boolean => {
      const generos = storage.getGeneros();
      const generosAtualizados = generos.filter(gen => gen.id !== id);
      
      if (generosAtualizados.length === generos.length) return false;
      
      storage.setGeneros(generosAtualizados);
      return true;
    }
  }
};

