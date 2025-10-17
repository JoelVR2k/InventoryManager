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

  const enhancedProducts = data?.content.map(product => {
    let stockClass = '';
    if (product.quantityInStock === 0) {
      stockClass = 'bg-gray-100 text-gray-800';
    } else if (product.quantityInStock <= 10) {
      stockClass = 'bg-orange-100 text-orange-800';
    } else {
      stockClass = 'bg-green-100 text-green-800';
    }
    
    return {
      ...product,
      // Apply opacity and strikethrough for out-of-stock items
      rowClass: product.quantityInStock === 0 ? 'opacity-60' : '',
      strike: product.quantityInStock === 0 ? 'line-through' : '',
      stockClass,
    };
  }) || [];

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data available.</div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage, track, and analyze your product inventory.</p>
        </div>
        <Link to="/create" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition">
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
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{data.content.length}</span> of <span className="font-medium">{data.totalElements}</span> results
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Metrics products={allProducts} />
    </div>
  );
};

export default ProductsPage;