import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductsPage from './pages/Products/ProductsPage.tsx';
import ProductForm from './pages/Products/ProductForm.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/create" element={<ProductForm />} />
          <Route path="/edit/:id" element={<ProductForm />} /> {}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
