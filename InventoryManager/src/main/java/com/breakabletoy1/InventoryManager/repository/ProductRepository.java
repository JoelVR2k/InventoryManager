package com.breakabletoy1.InventoryManager.repository;

import com.breakabletoy1.InventoryManager.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndCategoryIgnoreCase(String name, String category, Pageable pageable);
}