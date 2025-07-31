// Product.java
package com.breakabletoy1.InventoryManager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer id; 

    private String name;
    private String category;
    private double unitPrice;
    private LocalDate expirationDate;
    private int quantityInStock;

    public Product() {
    }

    public Product(Integer id, String name, String category, double unitPrice, LocalDate expirationDate, int quantityInStock) {
        this.id = id;
        this.name = name;
        this.unitPrice = unitPrice;
        this.category = category;
        this.expirationDate = expirationDate;
        this.quantityInStock = quantityInStock;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public int getQuantityInStock() {
        return quantityInStock;
    }

    public void setQuantityInStock(int quantityInStock) {
        this.quantityInStock = quantityInStock;
    }
}