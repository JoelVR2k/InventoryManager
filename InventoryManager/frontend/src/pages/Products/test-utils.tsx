import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turn off retries for tests
    },
  },
});

export const renderWithProviders = (ui: ReactElement) => {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );

  return {
    ...result,
    rerender: (rerenderUi: ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          <MemoryRouter>{rerenderUi}</MemoryRouter>
        </QueryClientProvider>
      ),
  };
};