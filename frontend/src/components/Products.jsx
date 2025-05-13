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
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                <button
                    className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setOpenModal(true)}
                >
                    Add Product
                </button>
            </div>

            <div className="bg-white shadow rounded overflow-x-auto border border-gray-300">
                <table className="min-w-full bg-white border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 text-sm">
                            <th className="py-2 px-4 text-left border border-gray-300">#</th>
                            <th className="py-2 px-4 text-left border border-gray-300">Name</th>
                            <th className="py-2 px-4 text-left border border-gray-300">Description</th>
                            <th className="py-2 px-4 text-left border border-gray-300">Category</th>
                            <th className="py-2 px-4 text-left border border-gray-300">Price</th>
                            <th className="py-2 px-4 text-left border border-gray-300">Stock</th>
                            <th className="py-2 px-4 text-center border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {products.map((product, index) => (
                            <tr key={product._id} className="border-b border-gray-300">
                                <td className="py-2 px-4 text-left border border-gray-300">{index + 1}</td>
                                <td className="py-2 px-4 text-left border border-gray-300">{product.name}</td>
                                <td className="py-2 px-4 text-left border border-gray-300">{product.description}</td>
                                <td className="py-2 px-4 text-left border border-gray-300">{product.categoryID?.name || 'N/A'}</td>
                                <td className="py-2 px-4 text-left border border-gray-300">${product.price.toFixed(2)}</td>
                                <td className="py-2 px-4 text-left border border-gray-300">{product.stock}</td>
                                <td className="py-2 px-4 text-center border border-gray-300">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button
                                            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(product)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {openModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative border border-gray-300">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">{editProduct ? "Edit Product" : "Add New Product"}</h2>
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 text-2xl"
                        >
                            X
                        </button>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label htmlFor="productName" className="block text-gray-700 text-sm font-medium mb-1">Product Name</label>
                                <input
                                    type="text"
                                    id="productName"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter Product Name"
                                    className="w-full border border-gray-400 rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="productDescription" className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                                <textarea
                                    id="productDescription"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter Product Description"
                                    className="w-full border border-gray-400 rounded p-2 h-20"
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="productPrice" className="block text-gray-700 text-sm font-medium mb-1">Price</label>
                                <input
                                    type="number"
                                    id="productPrice"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter Price"
                                    className="w-full border border-gray-400 rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="productStock" className="block text-gray-700 text-sm font-medium mb-1">Stock</label>
                                <input
                                    type="number"
                                    id="productStock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="Enter Stock Quantity"
                                    className="w-full border border-gray-400 rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="productCategory" className="block text-gray-700 text-sm font-medium mb-1">Category</label>
                                <select
                                    id="productCategory"
                                    name="categoryID"
                                    value={formData.categoryID}
                                    onChange={handleChange}
                                    className="w-full border border-gray-400 rounded p-2 bg-white"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded"
                                >
                                    {editProduct ? "Save Changes" : "Add Product"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-2 rounded"
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