import React, { useEffect, useState, useContext } from 'react'
import { CartContext } from '../../context/cartContext'
import axios from 'axios'

const UserProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { addItem } = useContext(CartContext)

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem("token")
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

            const response = await axios.get("http://localhost:3000/api/product/get", config)

            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                setError(response.data.message || 'Failed to fetch products')
            }

        } catch (err) {
            if (err.response) {
                setError(err.response.data?.message || `Server responded with status ${err.response.status}`)
            } else if (err.request) {
                setError('Network error. Could not connect to the server.')
            } else {
                setError('An unexpected error occurred while setting up the request.')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleAddToCart = (product) => {
        addItem(product, 1)
        alert(`${product.name} added to cart!`)
    }

    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Available Products</h2>
                <div>Loading products...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Available Products</h2>
                <div className="text-red-500">Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Available Products</h2>

            {products.length === 0 ? (
                <div>No products available at the moment.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="border p-4 rounded-lg shadow-md flex flex-col">
                            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-2 flex-grow">{product.description}</p>
                            <p className="text-lg font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>

                            <button
                                onClick={() => handleAddToCart(product)}
                                className="cursor-pointer mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserProducts