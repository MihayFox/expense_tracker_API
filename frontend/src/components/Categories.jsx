import axios from 'axios'
import React, { useState, useEffect } from 'react'

const Categories = () => {
    const [categoryName, setCategoryName] = useState("")
    const [categoryDescription, setCategoryDescription] = useState("")
    const [errorMessage, setErrorMessage] = useState(null)
    const [categories, setCategories] = useState([])
    const [editCategory, setEditCategory] = useState(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/category/get",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            setCategories(response.data.categories)
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage(null)

        try {
            const url = editCategory
                ? `http://localhost:3000/api/category/${editCategory}`
                : "http://localhost:3000/api/category/add"

            const method = editCategory ? axios.put : axios.post

            const response = await method(
                url,
                {
                    categoryName,
                    categoryDescription,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )

            if (response.data.success) {
                alert(`Category ${editCategory ? "updated" : "added"} successfully!`)
                setCategoryName("")
                setCategoryDescription("")
                setEditCategory(null)
                fetchCategories()
            }
        } catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data.message)
            }
        }
    }

    const handleEdit = (category) => {
        setEditCategory(category._id)
        setCategoryName(category.name)
        setCategoryDescription(category.description)
    }

    const handleDelete = async (category) => {
        if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) return

        try {
            const response = await axios.delete(
                `http://localhost:3000/api/category/${category._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            if (response.data.success) {
                alert("Category deleted successfully!")
                fetchCategories()
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleCancel = () => {
        setEditCategory(null)
        setCategoryName("")
        setCategoryDescription("")
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Category Management</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        {editCategory ? "Edit Category" : "Add Category"}
                    </h2>

                    {errorMessage && (
                        <div className="text-red-600 text-sm mb-4">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Category Name"
                            className="w-full border rounded-md p-2"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Category Description"
                            className="w-full border rounded-md p-2"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                            >
                                {editCategory ? "Save Changes" : "Add Category"}
                            </button>
                            {editCategory && (
                                <button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md transition"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white shadow-md p-6 rounded-lg overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Category List</h2>
                    <table className="min-w-full table-auto border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">#</th>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Description</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category._id} className="text-center">
                                    <td className="p-2 border">{index + 1}</td>
                                    <td className="p-2 border">{category.name}</td>
                                    <td className="p-2 border">{category.description}</td>
                                    <td className="p-2 border space-x-2">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                                            onClick={() => handleEdit(category)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                                            onClick={() => handleDelete(category)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-4 text-gray-500 text-center">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Categories
