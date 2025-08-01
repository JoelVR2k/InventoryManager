package com.breakabletoy1.InventoryManager.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; 
import org.springframework.stereotype.Service;

import com.breakabletoy1.InventoryManager.model.Product;
import java.time.LocalDate; 

@Service
public class ProductService {
    private final List<Product> productList;

    public ProductService() {
        this.productList = new ArrayList<>();
        initializeSampleData();
    }

    private void initializeSampleData() {
        productList.add(new Product(1, "Laptop", "electronics", 1200.00, LocalDate.now().plusYears(2), 50));
        productList.add(new Product(2, "Smartphone", "electronics", 800.00, LocalDate.now().plusYears(1), 0));
        productList.add(new Product(3, "Bread", "food", 2.50, LocalDate.now().plusDays(5), 10));
        productList.add(new Product(4, "Milk", "food", 3.00, LocalDate.now().plusDays(2), 0));
        productList.add(new Product(5, "T-Shirt", "clothing", 25.00, null, 20));
        productList.add(new Product(6, "Jeans", "clothing", 50.00, null, 5));
        productList.add(new Product(7, "Monitor", "electronics", 300.00, LocalDate.now().plusYears(3), 15));
        productList.add(new Product(8, "Eggs", "food", 4.00, LocalDate.now().plusDays(3), 0));
        productList.add(new Product(9, "Dress", "clothing", 70.00, null, 12));
        productList.add(new Product(10, "Mouse", "electronics", 25.00, LocalDate.now().plusYears(1), 30));
    }

    public Page<Product> findProducts(String name, String category, String available, Pageable pageable) {
        List<Product> filtered = productList.stream()
            .filter(p -> name == null || p.getName().toLowerCase().contains(name.toLowerCase()))
            .filter(p -> category == null || p.getCategory().equalsIgnoreCase(category))
            .filter(p -> {
                if (available == null || available.equalsIgnoreCase("all")) {
                    return true;
                } else if (available.equalsIgnoreCase("in")) {
                    return p.getQuantityInStock() > 0;
                } else if (available.equalsIgnoreCase("out")) {
                    return p.getQuantityInStock() == 0;
                }
                return true;
            })
            .collect(Collectors.toList());
        
        if (pageable.getSort().isSorted()) {
            String sortByProperty = pageable.getSort().iterator().next().getProperty();
            Sort.Direction sortDirection = pageable.getSort().iterator().next().getDirection();

            filtered.sort((p1, p2) -> {
                int compare = 0;
                switch (sortByProperty) {
                    case "id":
                        compare = Integer.compare(p1.getId(), p2.getId());
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
                            compare = 1;
                        } else if (p2.getExpirationDate() == null) {
                            compare = -1;
                        } else {
                            compare = p1.getExpirationDate().compareTo(p2.getExpirationDate());
                        }
                        break;
                }
                return sortDirection == Sort.Direction.ASC ? compare : -compare;
            });
        }
        
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        
        return new PageImpl<>(
            filtered.subList(start, end), 
            pageable, 
            filtered.size()
        );
    }

    public Optional<Product> getProduct(Integer id) {
        return productList.stream()
            .filter(p -> p.getId().equals(id))
            .findFirst();
    }

    public Product saveProduct(Product product) {
        if (product.getId() == null || product.getId() == 0) {
            int newId = productList.stream()
                          .mapToInt(Product::getId)
                          .max().orElse(0) + 1;
            product.setId(newId);
            productList.add(product);
        } else {
            productList.removeIf(p -> p.getId().equals(product.getId()));
            productList.add(product);
        }
        return product;
    }

    // Nuevo método para eliminar un producto
    public boolean deleteProduct(Integer id) {
        return productList.removeIf(p -> p.getId().equals(id));
    }

    public Product markOutOfStock(Integer id) {
        Product product = getProduct(id).orElseThrow(() -> 
            new RuntimeException("Product not found"));
        product.setQuantityInStock(0);
        return product;
    }

    public Product markInStock(Integer id, int quantity) {
        Product product = getProduct(id).orElseThrow(() -> 
            new RuntimeException("Product not found"));
        product.setQuantityInStock(quantity);
        return product;
    }
}