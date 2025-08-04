// Funções utilitárias para o projeto

import { v4 as uuidv4 } from 'uuid';

// Gerar ID único
export const generateId = (): string => {
  return uuidv4();
};

// Formatação de data
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Formatação de preço
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

// Validação de URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Capitalizar primeira letra
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Filtrar array por texto
export const filterByText = <T extends Record<string, any>>(
  items: T[],
  searchText: string,
  fields: (keyof T)[]
): T[] => {
  if (!searchText.trim()) return items;
  
  const lowerSearchText = searchText.toLowerCase();
  
  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && 
        typeof value === 'string' && 
        value.toLowerCase().includes(lowerSearchText);
    })
  );
};

// Ordenar array por campo
export const sortBy = <T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

