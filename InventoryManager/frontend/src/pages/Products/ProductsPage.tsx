import { useEffect, useState } from 'react';
import { Product, PaginatedResponse } from './types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ProductTable from './ProductTable.tsx';
import Filters from './Filters.tsx';
import Pagination from './Pagination.tsx';
import Metrics from './Metrics.tsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const fetchProducts = async (
  filters: { name: string; category: string; available: string }, 
  page: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Promise<PaginatedResponse> => {
  const params = new URLSearchParams();
  params.append('page', String(page - 1));
  params.append('size', '10');
  params.append('sortBy', `${sortBy},${sortOrder}`);
  if (filters.name) params.append('name', filters.name);
  if (filters.category) params.append('category', filters.category);
  if (filters.available && filters.available !== 'all') params.append('available', filters.available); 
  const res = await axios.get<PaginatedResponse>(`http://localhost:9090/api/products?${params.toString()}`);
  return res.data;
};

const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await axios.get<PaginatedResponse>('http://localhost:9090/api/products?page=0&size=1000');
  return res.data.content;
};

const deleteProduct = async (id: number) => {
  await axios.delete(`http://localhost:9090/api/products/${id}`);
};

const getExpirationClass = (expirationDate?: string, category?: string) => {
  return ''; // Se mantiene sin colores
};

const ProductsPage = () => {
    const [filters, setFilters] = useState({
    name: '',
    category: '',
    available: 'all', 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedBy, setSortedBy] = useState<keyof Product>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(params.get('page') || '1');
    setCurrentPage(pageFromUrl);
  }, [location.search]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters, currentPage, sortedBy, sortOrder],
    queryFn: () => fetchProducts(filters, currentPage, sortedBy, sortOrder),
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchAllProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    },
  });

  const handleSortChange = (key: keyof Product) => {
    setSortedBy(key);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleEdit = (id: number) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const enhancedProducts = data?.content.map(product => ({
    ...product,
    rowClass: getExpirationClass(product.expirationDate, product.category),
    stockClass:
      product.quantityInStock < 5
        ? 'text-red-600'
        : product.quantityInStock <= 10
        ? 'text-orange-500'
        : '',
    strike: product.quantityInStock === 0 ? 'line-through' : '',
  })) || [];

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Link to="/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          + Add Product
        </Link>
      </div>
      <Filters filters={filters} setFilters={setFilters} />
      
      <ProductTable
        products={enhancedProducts}
        onSortChange={handleSortChange}
        sortKey={sortedBy}
        sortOrder={sortOrder}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        onPageChange={setCurrentPage}
      />
      <Metrics products={allProducts} />
    </div>
  );
};

export default ProductsPage;