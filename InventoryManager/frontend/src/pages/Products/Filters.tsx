import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Using Heroicons for a professional look

interface FiltersProps {
  filters: {
    name: string;
    category: string;
    available: string;
  };
  setFilters: Dispatch<SetStateAction<any>>;
}

const Filters = ({ filters, setFilters }: FiltersProps) => {
  // Local state for the search input to implement debouncing
  const [searchTerm, setSearchTerm] = useState(filters.name);

  // Debounce effect: update the parent filter state only when the user stops typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev: any) => ({ ...prev, name: searchTerm }));
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setFilters]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ name: '', category: '', available: 'all' });
  };

  const hasActiveFilters = filters.category || filters.available !== 'all' || searchTerm;

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      {/* Live Search Input */}
      <div className="relative w-full md:flex-grow">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Filter by name..."
          className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <select
        className="w-full md:w-auto border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        value={filters.category}
        onChange={(e) => setFilters((prev: any) => ({ ...prev, category: e.target.value }))}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="food">Food</option>
      </select>
      
      {/* Stock Status Filter */}
      <select
        className="w-full md:w-auto border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        value={filters.available}
        onChange={(e) => setFilters((prev: any) => ({ ...prev, available: e.target.value }))}
      >
        <option value="all">All Stock</option>
        <option value="in">In Stock</option>
        <option value="out">Out of Stock</option>
      </select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <XMarkIcon className="h-4 w-4" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default Filters;