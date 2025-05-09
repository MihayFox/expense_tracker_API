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
            const response = await axios.get(
                "http://localhost:3000/api/product/get",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
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
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
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
        if (!window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            return
        }
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/product/${product._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success) {
                alert("Product deleted");
                fetchProducts();
            } else {
                alert("Error deleting product");
            }
        } catch (err) {
            alert("Error deleting product");
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

        if (editProduct) {
            try {
                const response = await axios.put(
                    `http://localhost:3000/api/product/${editProduct}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                )
                if (response.data.success) {
                    alert("Product updated")
                    setOpenModal(false)
                    setEditProduct(null)
                    setFormData({
                        name: "",
                        description: "",
                        price: "",
                        stock: "",
                        categoryID: "",
                    })
                    fetchProducts()
                } else {
                    alert("Error editing the product")
                }
            } catch (err) {
                alert("Error editing the product")
            }
        } else {

            try {
                const response = await axios.post(
                    "http://localhost:3000/api/product/add",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                )
                if (response.data.success) {
                    alert("Product added")
                    setOpenModal(false)
                    setFormData({
                        name: "",
                        description: "",
                        price: "",
                        stock: "",
                        categoryID: "",
                    })
                    fetchProducts()
                } else {
                    alert("Error adding the product")
                }
            } catch (err) {
                alert("Error adding the product")
            }
        }
    }

    return (
        <div>
            <h1>Products Management</h1>
            <div>
                <button
                    className="px-4 py-1.5 bg-blue-500 text-white"
                    onClick={() => setOpenModal(true)}
                >Add product</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr className="bg-gray-200 border">
                            <th className="border">Index</th>
                            <th className="border">Product name</th>
                            <th className="border">Product description</th>
                            <th className="border">Category name</th>
                            <th className="border">Price</th>
                            <th className="border">Stock</th>
                            <th className="border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index++}</td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.categoryID.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button
                                        className="bg-blue-500 text-white"
                                        onClick={() => handleEdit(product)}>
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white"
                                        onClick={() => handleDelete(product)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {openModal && (
                <div>
                    <div>
                        <h1>Add Product</h1>
                        <button
                            className=""
                            onClick={closeModal}>
                            X
                        </button>
                        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Product name"
                                className="border p-1 bg-white px-4"
                            />
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Product description"
                                className="border p-1 bg-white px-4"
                            />
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                className="border p-1 bg-white px-4"
                            />
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Enter stock"
                                className="border p-1 bg-white px-4"
                            />

                            <div className="w-full border">
                                <select
                                    name="categoryID"
                                    className="w-full p-2"
                                    onChange={handleChange}
                                    value={formData.categoryID}>
                                    <option value="">Select category</option>
                                    {categories && categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white">
                                    {editProduct ? "Save changes" : "Add product"}
                                </button>
                                <button
                                    type="button"
                                    className="w-full bg-red-500 text-white"
                                    onClick={closeModal}>
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
