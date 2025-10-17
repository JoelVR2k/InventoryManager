Inventory Management System 📦
A full-stack web application designed for streamlined product inventory management. This system allows users to easily register, view, search, filter, sort, edit, and delete products. The backend is built with Java and Spring Boot, serving a RESTful API to a modern, responsive frontend built with React.

✨ Key Features
Product Management (CRUD): Full create, read, update, and delete functionality for inventory products.

Dynamic Data Table: View all products in a clean, paginated table.

Live Search & Filtering: Instantly search products by name and filter by category or stock status.

Column Sorting: Sort the inventory by name, price, stock quantity.

Inventory Metrics: A dashboard view summarizing total products, stock value, and average price per category.

🛠️ Technologies Used
Backend
Java: v17

Spring Boot: v3.x

Maven: Dependency management


Frontend
React: v18

Vite: v5.x 

TypeScript

Tailwind CSS: For styling

Axios: As the HTTP client

Zod: For form validation

🚀 Getting Started
Follow these instructions to get a local copy of the project up and running.

Prerequisites
JDK 17 or newer

Apache Maven

Node.js v18 or newer (which includes npm)

Installation & Setup
Clone the repository:

git clone [https://github.com/your-username/InventoryManager.git](https://github.com/your-username/InventoryManager.git)
cd InventoryManager

Run the Backend (Java/Spring Boot):

Navigate to the backend directory.

The server will start on http://localhost:9090.

cd backend
./mvnw spring-boot:run

Run the Frontend (React):

Open a new terminal window and navigate to the frontend directory.

The application will be available at http://localhost:8080.

cd frontend

npm start

📝 Environment Variables
This project uses an in-memory data store, so no database connection variables are needed for the backend.

🧪 Running Tests
To run backend tests:

# Navigate to the /backend directory
./mvnw test

To run frontend tests:

# Navigate to the /frontend directory
npm test
