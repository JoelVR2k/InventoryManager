import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductsPage from './ProductsPage';
import { renderWithProviders } from './test-utils';

// Mock react-router-dom's useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});


describe('ProductsPage', () => {
  it('should render products table after loading', async () => {
    renderWithProviders(<ProductsPage />);
    
    // Check for loading state first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the table to appear with data from MSW
    expect(await screen.findByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Smartphone')).toBeInTheDocument();
    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
  });

  it('should filter products when user searches by name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsPage />);
    
    // Wait for initial data to load
    await screen.findByText('Laptop');

    // Simulate user typing into the filter input
    const nameInput = screen.getByPlaceholderText(/filter by name/i);
    await user.type(nameInput, 'Lap');
    
    // Simulate user clicking the search button
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Assert that only the filtered product is visible
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });
    expect(screen.queryByText('Smartphone')).not.toBeInTheDocument();
  });

  it('should delete a product when delete button is clicked and confirmed', async () => {
    const user = userEvent.setup();
    // Mock the window.confirm dialog
    window.confirm = vi.fn(() => true); 
    
    renderWithProviders(<ProductsPage />);

    // Wait for the "T-Shirt" row and find its delete button
    const tShirtRow = await screen.findByText('T-Shirt');
    const deleteButton = tShirtRow.closest('tr')?.querySelector('button[class*="bg-red-500"]');
    
    expect(deleteButton).toBeInTheDocument();
    
    await user.click(deleteButton!);

    // Check that the confirmation dialog was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this product?');

    // Wait for the UI to update and assert the product is gone
    await waitFor(() => {
        expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    });
  });

  it('should navigate to the edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsPage />);

    const laptopRow = await screen.findByText('Laptop');
    const editButton = laptopRow.closest('tr')?.querySelector('button[class*="bg-yellow-500"]');
    
    await user.click(editButton!);

    expect(mockedNavigate).toHaveBeenCalledWith('/edit/1');
  });
});