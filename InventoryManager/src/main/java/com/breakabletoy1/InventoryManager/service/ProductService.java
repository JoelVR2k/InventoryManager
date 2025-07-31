package com.breakabletoy1.InventoryManager.service;

import com.breakabletoy1.InventoryManager.model.Product;
import com.breakabletoy1.InventoryManager.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

@Service
public class ProductService {

    private final ProductRepository productRepository; 

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
        initializeSampleData(); 
    }

    private void initializeSampleData() {

        if (productRepository.count() == 0) {
            productRepository.save(new Product(null, "Laptop", "electronics", 1200.00, LocalDate.now().plusYears(2), 50));
            productRepository.save(new Product(null, "Smartphone", "electronics", 800.00, LocalDate.now().plusYears(1), 0));
            productRepository.save(new Product(null, "Bread", "food", 2.50, LocalDate.now().plusDays(5), 10));
            productRepository.save(new Product(null, "Milk", "food", 3.00, LocalDate.now().plusDays(2), 0));
            productRepository.save(new Product(null, "T-Shirt", "clothing", 25.00, null, 20));
            productRepository.save(new Product(null, "Jeans", "clothing", 50.00, null, 5));
            productRepository.save(new Product(null, "Monitor", "electronics", 300.00, LocalDate.now().plusYears(3), 15));
            productRepository.save(new Product(null, "Eggs", "food", 4.00, LocalDate.now().plusDays(3), 0));
            productRepository.save(new Product(null, "Dress", "clothing", 70.00, null, 12));
            productRepository.save(new Product(null, "Mouse", "electronics", 25.00, LocalDate.now().plusYears(1), 30));
        }
    }

    public Page<Product> findProducts(String name, String category, String available, Pageable pageable) {
        List<Product> filteredByNameAndCategory;
        if (name != null && !name.isEmpty() && category != null && !category.isEmpty()) {
            filteredByNameAndCategory = productRepository.findByNameContainingIgnoreCaseAndCategoryIgnoreCase(name, category, Pageable.unpaged()).getContent();
        } else if (name != null && !name.isEmpty()) {
            filteredByNameAndCategory = productRepository.findByNameContainingIgnoreCase(name, Pageable.unpaged()).getContent();
        } else if (category != null && !category.isEmpty()) {
            filteredByNameAndCategory = productRepository.findByCategoryIgnoreCase(category, Pageable.unpaged()).getContent();
        } else {
            filteredByNameAndCategory = productRepository.findAll(); 
        }

        List<Product> finalFiltered = new ArrayList<>();
        for (Product p : filteredByNameAndCategory) {
            boolean matchesAvailable = true;
            if (available != null) {
                if (available.equalsIgnoreCase("in") && p.getQuantityInStock() <= 0) {
                    matchesAvailable = false;
                } else if (available.equalsIgnoreCase("out") && p.getQuantityInStock() > 0) {
                    matchesAvailable = false;
                }
            }
            if (matchesAvailable) {
                finalFiltered.add(p);
            }
        }

        finalFiltered.sort((p1, p2) -> {
            int compare = 0;
    
            if (pageable.getSort().isSorted()) {
                 Sort.Order order = pageable.getSort().iterator().next();
                 String sortByProperty = order.getProperty();
                 Sort.Direction sortDirection = order.getDirection();

                 switch (sortByProperty) {
                    case "id":
                        compare = p1.getId().compareTo(p2.getId());
                        break;
                    case "name":
                        compare = p1.getName().compareToIgnoreCase(p2.getName());
                        break;
                    case "category":
                        compare = p1.getCategory().compareToIgnoreCase(p2.getCategory());
                        break;
                    case "unitPrice":
                        compare = Double.compare(p1.getUnitPrice(), p2.getUnitPrice());
                        break;
                    case "quantityInStock":
                        compare = Integer.compare(p1.getQuantityInStock(), p2.getQuantityInStock());
                        break;
                    case "expirationDate":
                        if (p1.getExpirationDate() == null && p2.getExpirationDate() == null) {
                            compare = 0;
                        } else if (p1.getExpirationDate() == null) {
                            compare = 1; // Nulls last
                        } else if (p2.getExpirationDate() == null) {
                            compare = -1; // Nulls last
                        } else {
                            compare = p1.getExpirationDate().compareTo(p2.getExpirationDate());
                        }
                        break;
                 }
                 return sortDirection == Sort.Direction.ASC ? compare : -compare;
            }
            return 0; 
        });

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), finalFiltered.size());
        
        return new PageImpl<>(
            finalFiltered.subList(start, end), 
            pageable, 
            finalFiltered.size()
        );
    }

    public Optional<Product> getProduct(Integer id) {
        return productRepository.findById(id); 
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product); 
    }

    public boolean deleteProduct(Integer id) {
        if (productRepository.existsById(id)) { 
            productRepository.deleteById(id); 
            return true;
        }
        return false;
    }

    public Product markOutOfStock(Integer id) {
        Product product = productRepository.findById(id).orElseThrow(() ->
            new RuntimeException("Product not found"));
        product.setQuantityInStock(0);
        return productRepository.save(product); 
    }

    public Product markInStock(Integer id, int quantity) {
        Product product = productRepository.findById(id).orElseThrow(() ->
            new RuntimeException("Product not found"));
        product.setQuantityInStock(quantity);
        return productRepository.save(product); 
    }
}