// Utilitários para gerenciamento do localStorage

const STORAGE_KEYS = {
  JOGOS: 'gerenciamento-jogos:jogos',
  DESENVOLVEDORAS: 'gerenciamento-jogos:desenvolvedoras',
  PLATAFORMAS: 'gerenciamento-jogos:plataformas',
  GENEROS: 'gerenciamento-jogos:generos',
} as const;

export const storage = {
  // Funções genéricas
  get: <T>(key: string): T[] => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return [];
    }
  },

  set: <T>(key: string, data: T[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },

  // Funções específicas para cada entidade
  getJogos: () => storage.get(STORAGE_KEYS.JOGOS),
  setJogos: (jogos: any[]) => storage.set(STORAGE_KEYS.JOGOS, jogos),

  getDesenvolvedoras: () => storage.get(STORAGE_KEYS.DESENVOLVEDORAS),
  setDesenvolvedoras: (desenvolvedoras: any[]) => storage.set(STORAGE_KEYS.DESENVOLVEDORAS, desenvolvedoras),

  getPlataformas: () => storage.get(STORAGE_KEYS.PLATAFORMAS),
  setPlataformas: (plataformas: any[]) => storage.set(STORAGE_KEYS.PLATAFORMAS, plataformas),

  getGeneros: () => storage.get(STORAGE_KEYS.GENEROS),
  setGeneros: (generos: any[]) => storage.set(STORAGE_KEYS.GENEROS, generos),

  // Função para limpar todos os dados
  clear: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

