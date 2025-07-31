import { Product } from "./types";

interface Props {
  products: Product[];
  onSortChange: (key: keyof Product) => void;
  sortKey: keyof Product;
  sortOrder: 'asc' | 'desc';
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ProductTable = ({ products, onSortChange, sortKey, sortOrder, onEdit, onDelete }: Props) => {
  return (
    <table className="w-full border-collapse border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 cursor-pointer" onClick={() => onSortChange('name')}>Name</th>
          <th className="p-2 cursor-pointer" onClick={() => onSortChange('category')}>Category</th>
          <th className="p-2 cursor-pointer" onClick={() => onSortChange('unitPrice')}>Price</th>
          <th className="p-2 cursor-pointer" onClick={() => onSortChange('quantityInStock')}>Stock</th>
          <th className="p-2 cursor-pointer" onClick={() => onSortChange('expirationDate')}>Expiration</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className={product.rowClass}>
            <td className={`p-2 ${product.strike}`}>{product.name}</td>
            <td className={`p-2 ${product.strike}`}>{product.category}</td>
            <td className={`p-2 ${product.strike}`}>${product.unitPrice.toFixed(2)}</td>
            <td className={`p-2 ${product.stockClass} ${product.strike}`}>{product.quantityInStock}</td>
            <td className={`p-2 ${product.strike}`}>
              {}
              {product.category === 'food' && product.expirationDate
                ? new Date(product.expirationDate).toLocaleDateString()
                : 'N/A'}
            </td>
            <td className="p-2">
              <button
                onClick={() => product.id && onEdit(product.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => product.id && onDelete(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;