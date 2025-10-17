import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductForm from './ProductForm';
import { renderWithProviders } from './test-utils';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock react-router-dom's useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

describe('ProductForm', () => {
    it('should display validation errors when creating a new product with invalid data', async () => {
        const user = userEvent.setup();
        renderWithProviders(<ProductForm />);

        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        // Expect Zod validation messages to appear
        expect(await screen.findByText(/Name must be at least 3 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/Please select a valid category/i)).toBeInTheDocument();
        expect(screen.getByText(/Price must be a positive number/i)).toBeInTheDocument();
    });

    it('should submit the form and navigate on successful creation', async () => {
        const user = userEvent.setup();
        renderWithProviders(<ProductForm />);

        // Fill out the form correctly
        await user.type(screen.getByLabelText(/name/i), 'New Gaming Mouse');
        await user.selectOptions(screen.getByLabelText(/category/i), 'electronics');
        await user.type(screen.getByLabelText(/stock/i), '75');
        await user.type(screen.getByLabelText(/unit price/i), '99.99');
        
        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        // Wait for the mutation to finish and navigate to be called
        // The mock API handler for POST will succeed
        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/?page=1');
        });
    });

    it('should load existing product data in edit mode', async () => {
        // Use a custom router setup to simulate being on the '/edit/1' route
        const ui = (
            <MemoryRouter initialEntries={['/edit/1']}>
                <Routes>
                    <Route path="/edit/:id" element={<ProductForm />} />
                </Routes>
            </MemoryRouter>
        );

        renderWithProviders(ui);

        // Wait for the form to be populated with data from our mock GET /api/products/1
        const nameInput = await screen.findByLabelText(/name/i) as HTMLInputElement;
        expect(nameInput.value).toBe('Laptop');

        const priceInput = screen.getByLabelText(/unit price/i) as HTMLInputElement;
        expect(priceInput.value).toBe('1200');
    });
});