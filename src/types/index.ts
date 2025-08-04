// Tipos para as entidades do sistema de gerenciamento de jogos

export interface Desenvolvedora {
  id: string;
  nome: string;
  paisOrigem: string;
  anoFundacao: number;
  website?: string;
  descricao?: string;
}

export interface Plataforma {
  id: string;
  nome: string;
  fabricante: string;
  tipo: 'Console' | 'PC' | 'Mobile' | 'Handheld';
  anoLancamento: number;
}

export interface Genero {
  id: string;
  nome: string;
  descricao: string;
}

export interface Jogo {
  id: string;
  titulo: string;
  descricao: string;
  dataLancamento: string; // ISO date string
  preco: number;
  desenvolvedoraId: string;
  plataformaIds: string[];
  generoIds: string[];
  imagemUrl?: string;
  avaliacaoMedia?: number;
}

// Tipos para formulários
export interface JogoFormData {
  titulo: string;
  descricao: string;
  dataLancamento: string;
  preco: number;
  desenvolvedoraId: string;
  plataformaIds: string[];
  generoIds: string[];
  imagemUrl?: string;
  avaliacaoMedia?: number;
}

export interface DesenvolvedoraFormData {
  nome: string;
  paisOrigem: string;
  anoFundacao: number;
  website?: string;
  descricao?: string;
}

export interface PlataformaFormData {
  nome: string;
  fabricante: string;
  tipo: 'Console' | 'PC' | 'Mobile' | 'Handheld';
  anoLancamento: number;
}

export interface GeneroFormData {
  nome: string;
  descricao: string;
}

// Tipos para contextos
export interface AppContextType {
  jogos: Jogo[];
  desenvolvedoras: Desenvolvedora[];
  plataformas: Plataforma[];
  generos: Genero[];
  
  // Operações CRUD para Jogos
  adicionarJogo: (jogo: JogoFormData) => void;
  atualizarJogo: (id: string, jogo: JogoFormData) => void;
  removerJogo: (id: string) => void;
  
  // Operações CRUD para Desenvolvedoras
  adicionarDesenvolvedora: (desenvolvedora: DesenvolvedoraFormData) => void;
  atualizarDesenvolvedora: (id: string, desenvolvedora: DesenvolvedoraFormData) => void;
  removerDesenvolvedora: (id: string) => void;
  
  // Operações CRUD para Plataformas
  adicionarPlataforma: (plataforma: PlataformaFormData) => void;
  atualizarPlataforma: (id: string, plataforma: PlataformaFormData) => void;
  removerPlataforma: (id: string) => void;
  
  // Operações CRUD para Gêneros
  adicionarGenero: (genero: GeneroFormData) => void;
  atualizarGenero: (id: string, genero: GeneroFormData) => void;
  removerGenero: (id: string) => void;
}

// Tipos para filtros
export interface FiltroJogos {
  titulo?: string;
  desenvolvedoraId?: string;
  plataformaId?: string;
  generoId?: string;
  precoMin?: number;
  precoMax?: number;
}

