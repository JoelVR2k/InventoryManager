import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import { Product } from './types';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'; 
import React from 'react';
import { TagIcon, CurrencyDollarIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';


const fetchProductById = async (id: number): Promise<Product> => {
  const res = await axios.get<Product>(`http://localhost:9090/api/products/${id}`);
  return res.data;
};

const ProductForm = () => {
  const { id } = useParams<{ id: string }>(); 
  const isEditMode = !!id; 
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: productData, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(Number(id)),
    enabled: isEditMode,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Partial<Product>>();

  React.useEffect(() => {
    if (isEditMode && productData) {
      reset({
        ...productData,
        expirationDate: productData.expirationDate ? new Date(productData.expirationDate).toISOString().split('T')[0] : '',
      });
    }
  }, [isEditMode, productData, reset]);

  const createMutation = useMutation({
    mutationFn: (newProduct: Partial<Product>) => axios.post('http://localhost:9090/api/products', newProduct),
    onSuccess: async () => {
      const res = await axios.get('http://localhost:9090/api/products?page=0&size=10');
      const totalPages = res.data.totalPages;
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      navigate(`/?page=${totalPages}`);
    },
    onError: (error) => {
      console.error(' Error creating product:', error);
      alert('Error creating product. Please check the console.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedProduct: Partial<Product>) => axios.put(`http://localhost:9090/api/products/${id}`, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] }); 
      navigate('/');
    },
    onError: (error) => {
      console.error(' Error updating product:', error);
      alert('Error updating product. Please check the console.');
    },
  });

  const onSubmit = async (data: Partial<Product>) => {
    data.unitPrice = Number(data.unitPrice);
    data.quantityInStock = Number(data.quantityInStock);

    if (isEditMode) {
      try {
        await updateMutation.mutateAsync(data);
        console.log(' Product updated successfully!');
      } catch (error: any) {
      }
    } else {
      try {
        await createMutation.mutateAsync(data);
        console.log(' Product created successfully!');
      } catch (error: any) {
      }
    }
  };

  if (isEditMode && isProductLoading) return <div>Loading product data...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Create New Product'}</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a new product to your inventory.</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <TagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" id="name" {...register('name')} className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          {errors.name ? (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">The public name of the product.</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select id="category" {...register('category')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="food">Food</option>
            <option value="clothing">Clothing</option>
          </select>
          {errors.category && <p className="mt-2 text-sm text-red-600">Category is required</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="quantityInStock" className="block text-sm font-medium text-gray-700">Stock</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ArchiveBoxIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="number" id="quantityInStock" {...register('quantityInStock')} className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            {errors.quantityInStock && <p className="mt-2 text-sm text-red-600">{errors.quantityInStock.message}</p>}
          </div>

          <div>
            <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">Unit Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="number" step="0.01" id="unitPrice" {...register('unitPrice')} className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            {errors.unitPrice && <p className="mt-2 text-sm text-red-600">{errors.unitPrice.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">Expiration Date</label>
          <input type="date" id="expirationDate" {...register('expirationDate')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          <p className="mt-2 text-sm text-gray-500">Optional. Only required for perishable goods.</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button type="button" onClick={() => navigate('/')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;