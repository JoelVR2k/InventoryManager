package com.breakabletoy1.InventoryManager;

import com.breakabletoy1.InventoryManager.model.Product;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.annotation.DirtiesContext;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // The object mapper is configured to handle Java 8 date/time types (LocalDate)
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    //
    // GET /api/products/{id} Tests
    //

    @Test
    void whenGetProductById_givenExistingId_thenReturnsProduct() throws Exception {
        // The service initializes with a product with ID 1 ("Laptop")
        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Laptop")));
    }

    @Test
    void whenGetProductById_givenNonExistentId_thenReturnsNotFound() throws Exception {
        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound());
    }

    //
    // GET /api/products (List, Filter, Sort, Paginate) Tests
    //

    @Test
    void whenGetProducts_withoutFilters_thenReturnsFirstPage() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(10))) // Initial data has 10 products
                .andExpect(jsonPath("$.totalPages", is(1)))
                .andExpect(jsonPath("$.totalElements", is(10)))
                .andExpect(jsonPath("$.content[0].name", is("Mouse"))); // Default sort is id,desc
    }

    @Test
    void whenGetProducts_withNameFilter_thenReturnsFilteredProducts() throws Exception {
        mockMvc.perform(get("/api/products").param("name", "Lap"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("Laptop")));
    }

    @Test
    void whenGetProducts_withCategoryFilter_thenReturnsFilteredProducts() throws Exception {
        mockMvc.perform(get("/api/products").param("category", "food"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(3))); // Bread, Milk, Eggs
    }
    
    @Test
    void whenGetProducts_withAvailableInStockFilter_thenReturnsInStockProducts() throws Exception {
        mockMvc.perform(get("/api/products").param("available", "in"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(7))); // Filters out 4 out-of-stock items
    }

    @Test
    void whenGetProducts_withAvailableOutOfStockFilter_thenReturnsOutOfStockProducts() throws Exception {
        mockMvc.perform(get("/api/products").param("available", "out"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(3))); // Smartphone, Milk, Eggs
    }


    @Test
    void whenGetProducts_withSortingByNameAsc_thenReturnsSortedProducts() throws Exception {
        mockMvc.perform(get("/api/products").param("sortBy", "name,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name", is("Bread")));
    }
    
    @Test
    void whenGetProducts_withPagination_thenReturnsCorrectPage() throws Exception {
        // Request page 2 with a size of 3.
        mockMvc.perform(get("/api/products")
                        .param("page", "1") // Page index is 0-based, so this is the second page
                        .param("size", "3")
                        .param("sortBy", "id,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(3)))
                .andExpect(jsonPath("$.content[0].id", is(4))) // Product with ID 4 (Milk)
                .andExpect(jsonPath("$.number", is(1))); // Page number is 1
    }

    //
    // POST /api/products Tests
    //

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void whenCreateProduct_withValidData_thenReturnsCreated() throws Exception {
        Product newProduct = new Product(null, "Keyboard", "electronics", 75.00, null, 150);
        
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue())) // Should have a new ID
                .andExpect(jsonPath("$.name", is("Keyboard")));
    }

    //
    // PUT /api/products/{id} Tests
    //

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD) 
    void whenUpdateProduct_withValidData_thenReturnsOk() throws Exception {
        // Product ID 5 is "T-Shirt"
        Product updatedProduct = new Product(5, "Cool T-Shirt", "clothing", 28.50, null, 25);
        
        mockMvc.perform(put("/api/products/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Cool T-Shirt")))
                .andExpect(jsonPath("$.unitPrice", is(28.50)));
    }
    
    @Test
    void whenUpdateProduct_withMismatchedId_thenReturnsBadRequest() throws Exception {
        // Path ID is 5, but body ID is 6
        Product updatedProduct = new Product(6, "Mismatched T-Shirt", "clothing", 30.00, null, 10);
        
        mockMvc.perform(put("/api/products/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedProduct)))
                .andExpect(status().isBadRequest());
    }

    //
    // DELETE /api/products/{id} Tests
    //

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void whenDeleteProduct_givenExistingId_thenReturnsNoContent() throws Exception {
        // Create a product first to ensure it exists and can be deleted without affecting other tests
        Product productToDelete = new Product(null, "ToDelete", "test", 1.0, null, 1);
        ResultActions createResult = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productToDelete)));
        
        String createdJson = createResult.andReturn().getResponse().getContentAsString();
        Integer newId = objectMapper.readValue(createdJson, Product.class).getId();

        mockMvc.perform(delete("/api/products/" + newId))
                .andExpect(status().isNoContent());

        // Verify it's gone
        mockMvc.perform(get("/api/products/" + newId))
                .andExpect(status().isNotFound());
    }

    @Test
    void whenDeleteProduct_givenNonExistentId_thenReturnsNotFound() throws Exception {
        mockMvc.perform(delete("/api/products/999"))
                .andExpect(status().isNotFound());
    }
    
    //
    // POST /api/products/{id}/outofstock Tests
    //
    
    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD) 
    void whenMarkOutOfStock_givenInStockProduct_thenReturnsOkAndUpdatesQuantity() throws Exception {
        // Product 1 ("Laptop") starts with quantity 50
        mockMvc.perform(post("/api/products/1/outofstock"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.quantityInStock", is(0)));
            
        // Verify the change persists
        mockMvc.perform(get("/api/products/1"))
            .andExpect(jsonPath("$.quantityInStock", is(0)));
    }
    
    //
    // PUT /api/products/{id}/instock Tests
    //
    
    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void whenMarkInStock_givenProduct_thenReturnsOkAndUpdatesQuantity() throws Exception {
        // Product 2 ("Smartphone") starts with quantity 0
        mockMvc.perform(put("/api/products/2/instock").param("quantity", "25"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.quantityInStock", is(25)));
            
        // Verify the change persists
        mockMvc.perform(get("/api/products/2"))
            .andExpect(jsonPath("$.quantityInStock", is(25)));
    }
}