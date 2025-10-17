import { http, HttpResponse } from 'msw';

// Define the initial state of our mock database
let mockProducts = [
  { id: 1, name: "Laptop", category: "electronics", unitPrice: 1200.00, expirationDate: null, quantityInStock: 50 },
  { id: 2, name: "Smartphone", category: "electronics", unitPrice: 800.00, expirationDate: null, quantityInStock: 0 },
  { id: 5, name: "T-Shirt", category: "clothing", unitPrice: 25.00, expirationDate: null, quantityInStock: 20 },
  { id: 3, name: "Bread", category: "food", unitPrice: 2.50, expirationDate: '2025-10-21', quantityInStock: 10 }
];

export const handlers = [
  // Mock GET /api/products
  http.get('http://localhost:9090/api/products', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');

    let filteredProducts = mockProducts;
    if (name) {
      filteredProducts = mockProducts.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    }

    return HttpResponse.json({
      content: filteredProducts,
      totalPages: 1,
      totalElements: filteredProducts.length,
      number: 0,
    });
  }),

  // Mock GET /api/products/:id
  http.get('http://localhost:9090/api/products/:id', ({ params }) => {
    const { id } = params;
    const product = mockProducts.find(p => p.id === Number(id));

    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  // Mock POST /api/products
  http.post('http://localhost:9090/api/products', async ({ request }) => {
    const newProductData = await request.json() as any;
    const newProduct = {
      ...newProductData,
      id: Math.max(...mockProducts.map(p => p.id)) + 1, // Generate new ID
    };
    mockProducts.push(newProduct);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  // Mock PUT /api/products/:id
  http.put('http://localhost:9090/api/products/:id', async ({ request, params }) => {
     const { id } = params;
     const updatedData = await request.json() as any;
     mockProducts = mockProducts.map(p => p.id === Number(id) ? { ...p, ...updatedData } : p);
     return HttpResponse.json(updatedData);
  }),

  // Mock DELETE /api/products/:id
  http.delete('http://localhost:9090/api/products/:id', ({ params }) => {
    const { id } = params;
    mockProducts = mockProducts.filter(p => p.id !== Number(id));
    return new HttpResponse(null, { status: 204 });
  }),
];