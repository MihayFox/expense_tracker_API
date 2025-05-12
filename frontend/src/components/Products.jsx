import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Products = () => {
    const [openModal, setOpenModal] = useState(false)
    const [products, setProducts] = useState([])
    const [editProduct, setEditProduct] = useState(null)
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryID: "",
    })

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/product/get", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            if (response.data.success) {
                setProducts(response.data.products)
                setCategories(response.data.categories)
            } else {
                alert("Error fetching products")
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleEdit = (product) => {
        setOpenModal(true)
        setEditProduct(product._id)
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryID: product.categoryID._id,
        })
    }

    const handleDelete = async (product) => {
        if (!window.confirm(`Delete "${product.name}"?`)) return
        try {
            const response = await axios.delete(`http://localhost:3000/api/product/${product._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            if (response.data.success) {
                alert("Product deleted")
                fetchProducts()
            } else {
                alert("Error deleting product")
            }
        } catch (err) {
            alert("Error deleting product")
        }
    }

    const closeModal = () => {
        setOpenModal(false)
        setEditProduct(null)
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            categoryID: "",
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = editProduct
            ? `http://localhost:3000/api/product/${editProduct}`
            : "http://localhost:3000/api/product/add"

        const method = editProduct ? axios.put : axios.post

        try {
            const response = await method(url, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })

            if (response.data.success) {
                alert(editProduct ? "Product updated" : "Product added")
                closeModal()
                fetchProducts()
            } else {
                alert("Error saving product")
            }
        } catch (err) {
            alert("Error saving product")
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Product Management</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => setOpenModal(true)}
                >
                    Add Product
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full table-auto">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">{product.description}</td>
                                <td className="p-3">{product.categoryID.name}</td>
                                <td className="p-3">${product.price}</td>
                                <td className="p-3">{product.stock}</td>
                                <td className="p-3 space-x-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDelete(product)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {openModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                        <h2 className="text-xl font-semibold mb-4">{editProduct ? "Edit Product" : "Add Product"}</h2>
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
                        >
                            &times
                        </button>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Product name"
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Product description"
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Stock"
                                className="w-full p-2 border rounded"
                                required
                            />
                            <select
                                name="categoryID"
                                value={formData.categoryID}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
                                >
                                    {editProduct ? "Save Changes" : "Add Product"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Products