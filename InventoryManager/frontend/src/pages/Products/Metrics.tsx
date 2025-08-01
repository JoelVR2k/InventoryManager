import { Product } from './types';

interface MetricsProps {
  products: Product[];
}

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
    <div className="metrics-container"> {}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Total products in Stock</th>
            <th>Total Value in Stock</th>
            <th>Average price in Stock</th>
          </tr>
        </thead>
        <tbody>
          {metricsData.map((row, index) => (
            <tr key={index}>
              <td>{row.category}</td>
              <td>{row.totalProductsInStock}</td>
              <td>${row.totalValueInStock.toFixed(2)}</td>
              <td>${row.averagePriceInStock.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Metrics;