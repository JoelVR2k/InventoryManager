import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'; // Importa useState y useEffect

interface FiltersProps {
  filters: {
    name: string;
    category: string;
    available: string;
  };
  setFilters: Dispatch<SetStateAction<any>>;
}

const Filters = ({ filters, setFilters }: FiltersProps) => {
  const [localNameSearchTerm, setLocalNameSearchTerm] = useState(filters.name);

  useEffect(() => {
    setLocalNameSearchTerm(filters.name);
  }, [filters.name]);

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalNameSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    setFilters((prev: any) => ({ ...prev, name: localNameSearchTerm }));
  };

  return (
    <div className="flex flex-wrap gap-4 items-center"> {}
      <input
        type="text"
        placeholder="Filter by name"
        className="border p-2 rounded"
        value={localNameSearchTerm} 
        onChange={handleNameInputChange} 
        onKeyDown={(e) => { 
          if (e.key === 'Enter') {
            handleSearchClick();
          }
        }}
      />
      {}
      <button
        onClick={handleSearchClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <select
        className="border p-2 rounded"
        value={filters.category}
        onChange={(e) => setFilters((prev: any) => ({ ...prev, category: e.target.value }))}
      >
        <option value="">Select category</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="food">Food</option>
      </select>
      <select
        className="border p-2 rounded"
        value={filters.available}
        onChange={(e) => setFilters((prev: any) => ({ ...prev, available: e.target.value }))}
      >
        <option value="all">All</option>
        <option value="in">In Stock</option>
        <option value="out">Out of Stock</option>
      </select>
    </div>
  );
};

export default Filters;