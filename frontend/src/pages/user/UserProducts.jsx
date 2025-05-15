// src/pages/user/UserProducts.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../../context/cartContext';
import { useAuth } from '../../context/authContext'; // Assuming you use useAuth for user info

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the addItem function from the CartContext
    const { addItem } = useContext(CartContext);

    // Although user role isn't needed for fetching products,
    // we might need the token if the backend requires auth for this route.
    // Use the useAuth hook to access user and potentially token info if needed later.
    const { user } = useAuth(); // Access user from AuthContext


    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            // --- FIX: Use the full backend URL and include Authorization header ---
            const token = localStorage.getItem("token"); // Get token from localStorage
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Config with headers if token exists

            // Make the GET request to your backend endpoint with full URL and config
            // Ensure this URL exactly matches your backend product route
            const response = await axios.get("http://localhost:3000/api/product/get", config); // <-- Updated URL and config


            // Assuming your backend returns { success: true, products: [...] }
            if (response.data.success) {
                setProducts(response.data.products);
                // Note: Your admin endpoint also returns categories.
                // If this user endpoint also returns categories and you need them, you can set them here too.
                // setCategories(response.data.categories);
            } else {
                 // Handle backend success: false case
                 console.error("Backend reported success: false", response.data.message); // Log backend message
                 setError(response.data.message || 'Failed to fetch products');
            }

        } catch (err) {
            console.error("Error fetching products:", err); // Log the full error object
            // Provide more specific error messages if possible
            if (err.response) {
                 // The request was made and the server responded with a status code
                 // that falls out of the range of 2xx
                 console.error("Error response data:", err.response.data);
                 console.error("Error response status:", err.response.status);
                 console.error("Error response headers:", err.response.headers);
                 setError(err.response.data?.message || `Server responded with status ${err.response.status}`);
             } else if (err.request) {
                 // The request was made but no response was received
                 console.error("Error request:", err.request);
                 setError('Network error. Could not connect to the server.');
             } else {
                 // Something happened in setting up the request that triggered an Error
                 console.error("Error message:", err.message);
                 setError('An unexpected error occurred while setting up the request.');
             }
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        // You might want to only fetch products if the user is logged in,
        // although your Root.jsx should handle redirection if not.
        // For now, fetching regardless of user state is fine if the route is public.
        // If the backend route *does* require auth, the fetch call will handle the error.
        fetchProducts();
    }, []); // Fetch products only once on mount

    // Handler for adding a product to the cart
    const handleAddToCart = (product) => {
        // The addItem function will be provided by CartContext
        addItem(product, 1); // Add 1 quantity of the product
        alert(`${product.name} added to cart!`); // Optional: Provide user feedback
    }

    if (loading) {
        return (
             <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Available Products</h2>
                <div>Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Available Products</h2>
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Available Products</h2>

            {products.length === 0 ? (
                <div>No products available at the moment.</div>
            ) : (
                 // Display products in a grid (using Tailwind)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        // Basic Product Card (you can style this nicely)
                        <div key={product._id} className="border p-4 rounded-lg shadow-md flex flex-col">
                            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-2 flex-grow">{product.description}</p>
                            <p className="text-lg font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>

                            <button
                                onClick={() => handleAddToCart(product)}
                                className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserProducts