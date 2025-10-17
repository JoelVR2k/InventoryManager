import { Product } from "./types";
import { PencilSquareIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Props {
  products: Product[];
  onSortChange: (key: keyof Product) => void;
  sortKey: keyof Product;
  sortOrder: 'asc' | 'desc';
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// A helper component for sortable table headers
const SortableHeader = ({ title, sortKey, currentSortKey, sortOrder, onSortChange }: any) => {
  const isSorted = sortKey === currentSortKey;
  return (
    <th className="p-3 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => onSortChange(sortKey)}>
      <div className="flex items-center gap-1">
        {title}
        {isSorted && (sortOrder === 'asc' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />)}
      </div>
    </th>
  );
};

const ProductTable = ({ products, onSortChange, sortKey, sortOrder, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full border-collapse bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader title="Name" sortKey="name" currentSortKey={sortKey} sortOrder={sortOrder} onSortChange={onSortChange} />
            <SortableHeader title="Category" sortKey="category" currentSortKey={sortKey} sortOrder={sortOrder} onSortChange={onSortChange} />
            <SortableHeader title="Price" sortKey="unitPrice" currentSortKey={sortKey} sortOrder={sortOrder} onSortChange={onSortChange} />
            <SortableHeader title="Stock" sortKey="quantityInStock" currentSortKey={sortKey} sortOrder={sortOrder} onSortChange={onSortChange} />
            <SortableHeader title="Expiration" sortKey="expirationDate" currentSortKey={sortKey} sortOrder={sortOrder} onSortChange={onSortChange} />
            <th className="p-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${product.rowClass}`}>
              <td className={`p-3 whitespace-nowrap ${product.strike}`}>{product.name}</td>
              <td className={`p-3 whitespace-nowrap text-gray-600 ${product.strike}`}>{product.category}</td>
              <td className={`p-3 whitespace-nowrap text-gray-600 ${product.strike}`}>${product.unitPrice.toFixed(2)}</td>
              <td className={`p-3 whitespace-nowrap ${product.strike}`}>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.stockClass}`}>
                  {product.quantityInStock > 0 ? `${product.quantityInStock} in stock` : 'Out of Stock'}
                </span>
              </td>
              <td className={`p-3 whitespace-nowrap text-gray-600 ${product.strike}`}>
                {product.category === 'food' && product.expirationDate
                  ? new Date(product.expirationDate).toLocaleDateString()
                  : '—'} {/* Cleaner N/A */}
              </td>
              <td className="p-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => product.id && onEdit(product.id)}
                    className="p-1 text-gray-500 hover:text-blue-600 rounded-md transition-colors"
                    title="Edit"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => product.id && onDelete(product.id)}
                    className="p-1 text-gray-500 hover:text-red-600 rounded-md transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;