import { Product } from './types';
import { CubeIcon, ShoppingCartIcon, CpuChipIcon, ScaleIcon } from '@heroicons/react/24/outline';


interface MetricsProps {
  products: Product[];
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  food: <CubeIcon className="h-6 w-6 text-green-500" />,
  clothing: <ShoppingCartIcon className="h-6 w-6 text-blue-500" />,
  electronics: <CpuChipIcon className="h-6 w-6 text-indigo-500" />,
};

const Metrics = ({ products }: MetricsProps) => {
  const categoryMetrics: {
    [key: string]: {
      totalInStock: number;
      totalValue: number;
      productCount: number;
    };
  } = {
    food: { totalInStock: 0, totalValue: 0, productCount: 0 },
    clothing: { totalInStock: 0, totalValue: 0, productCount: 0 },
    electronics: { totalInStock: 0, totalValue: 0, productCount: 0 },
  };

  products.forEach(p => {
    const normalizedCategory = p.category.toLowerCase() === 'clothes' ? 'clothing' : p.category.toLowerCase();
    if (categoryMetrics[normalizedCategory]) {
      if (p.quantityInStock > 0) {
        categoryMetrics[normalizedCategory].totalInStock += p.quantityInStock;
        categoryMetrics[normalizedCategory].totalValue += (p.unitPrice * p.quantityInStock);
        categoryMetrics[normalizedCategory].productCount++;
      }
    }
  });

  const overallTotalInStock = products.reduce((sum, p) => sum + p.quantityInStock, 0);
  const overallTotalValue = products.reduce((sum, p) => sum + (p.unitPrice * p.quantityInStock), 0);
  const overallProductCount = products.length;
  const overallAvgPrice = overallProductCount > 0 ? overallTotalValue / overallProductCount : 0;

  const metricsData = [
    {
      category: 'Food',
      totalProductsInStock: categoryMetrics.food.totalInStock,
      totalValueInStock: categoryMetrics.food.totalValue,
      averagePriceInStock: categoryMetrics.food.productCount > 0 ? categoryMetrics.food.totalValue / categoryMetrics.food.productCount : 0,
    },
    {
      category: 'Clothing',
      totalProductsInStock: categoryMetrics.clothing.totalInStock,
      totalValueInStock: categoryMetrics.clothing.totalValue,
      averagePriceInStock: categoryMetrics.clothing.productCount > 0 ? categoryMetrics.clothing.totalValue / categoryMetrics.clothing.productCount : 0,
    },
    {
      category: 'Electronics',
      totalProductsInStock: categoryMetrics.electronics.totalInStock,
      totalValueInStock: categoryMetrics.electronics.totalValue,
      averagePriceInStock: categoryMetrics.electronics.productCount > 0 ? categoryMetrics.electronics.totalValue / categoryMetrics.electronics.productCount : 0,
    },
    {
      category: 'Overall',
      totalProductsInStock: overallTotalInStock,
      totalValueInStock: overallTotalValue,
      averagePriceInStock: overallAvgPrice,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900">Inventory Metrics</h2>
        <p className="mt-1 text-sm text-gray-600">A summary of your current stock value and distribution.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-600">Category</th>
              <th className="p-3 text-right font-semibold text-gray-600">Total Products in Stock</th>
              <th className="p-3 text-right font-semibold text-gray-600">Total Value in Stock</th>
              <th className="p-3 text-right font-semibold text-gray-600">Average Price in Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {metricsData.slice(0, -1).map((row, index) => ( // Render only categories
              <tr key={index}>
                <td className="p-3 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    {categoryIcons[row.category.toLowerCase()]}
                    <span>{row.category}</span>
                  </div>
                </td>
                <td className="p-3 text-right text-gray-600 font-mono">{row.totalProductsInStock}</td>
                <td className="p-3 text-right text-gray-600 font-mono">${row.totalValueInStock.toFixed(2)}</td>
                <td className="p-3 text-right text-gray-600 font-mono">${row.averagePriceInStock.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 border-t-2 border-gray-300">
            {/* Emphasize the 'Overall' row in the table footer */}
            <tr>
              <td className="p-3 font-bold text-gray-900">
                <div className="flex items-center gap-3">
                  <ScaleIcon className="h-6 w-6 text-gray-500" />
                  <span>Overall</span>
                </div>
              </td>
              <td className="p-3 text-right font-bold text-gray-900 font-mono">{overallTotalInStock}</td>
              <td className="p-3 text-right font-bold text-gray-900 font-mono">${overallTotalValue.toFixed(2)}</td>
              <td className="p-3 text-right font-bold text-gray-900 font-mono">${overallAvgPrice.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Metrics;