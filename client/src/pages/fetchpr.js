import fs from 'fs';
import fetch from 'node-fetch';

// API endpoints for both categories
const endpoints = [
  "https://fakestoreapi.in/api/products/category?type=laptop&limit=60",
];

async function fetchProducts() {
  try {
    // Fetch data for both categories
    const results = await Promise.all(
      endpoints.map((endpoint) =>
        fetch(endpoint).then((res) => res.json())
      )
    );

    // Combine and limit to 60 products
    const combinedProducts = results
      .flatMap((result) => (result.status === "SUCCESS" ? result.products : []))
      .slice(0, 60);

    // Create a JSON file
    const filePath = './laptopProducts.json';
    fs.writeFileSync(filePath, JSON.stringify(combinedProducts, null, 2));
    console.log(`JSON file created at: ${filePath}`);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Run the function
fetchProducts();
