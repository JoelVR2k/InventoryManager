export interface Product {
  id: number;
  name: string;
  category: 'electronics' | 'food' | 'clothing'; 
  unitPrice: number;
  expirationDate?: string;
  quantityInStock: number;
  creationDate?: string;
  updateDate?: string;
  rowClass?: string;
  stockClass?: string;
  strike?: string;
  isAvailable?: boolean;
  price?: number;
}

export interface PaginatedResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
}