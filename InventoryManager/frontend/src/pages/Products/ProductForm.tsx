import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import { Product } from './types';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'; 
import React from 'react';

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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">{isEditMode ? 'Edit Product' : 'Create New Product'}</h2>

      <div>
        <label>Name</label>
        <input type="text" {...register('name', { required: true, maxLength: 120 })} className="w-full border p-2" />
        {errors.name && <span className="text-red-600">Name is required (max 120 characters)</span>}
      </div>

      <div>
        <label>Category</label>
        <select {...register('category', { required: true })} className="w-full border p-2">
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="food">Food</option>
          <option value="clothing">Clothing</option> {}
        </select>
        {errors.category && <span className="text-red-600">Category is required</span>}
      </div>

      <div>
        <label>Stock</label>
        <input type="number" {...register('quantityInStock', { required: true, valueAsNumber: true })} className="w-full border p-2" />
      </div>

      <div>
        <label>Unit Price</label>
        <input type="number" step="0.01" {...register('unitPrice', { required: true, valueAsNumber: true })} className="w-full border p-2" />
      </div>

      <div>
        <label>Expiration Date</label>
        <input type="date" {...register('expirationDate')} className="w-full border p-2" />
      </div>

      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={() => navigate('/')} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default ProductForm;