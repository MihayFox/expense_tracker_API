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
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Category Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow p-4 rounded border border-gray-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
                        {editCategory ? "Edit Category" : "Add New Category"}
                    </h2>
                    {errorMessage && (
                        <div className="bg-red-200 border border-red-500 text-red-800 px-3 py-2 rounded mb-3 text-sm">
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label htmlFor="categoryName" className="block text-gray-700 text-sm font-medium mb-1">Category Name</label>
                            <input
                                type="text"
                                id="categoryName"
                                placeholder="Enter Category Name"
                                className="w-full border border-gray-400 rounded p-2"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="categoryDescription" className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                            <textarea
                                id="categoryDescription"
                                placeholder="Enter Category Description"
                                className="w-full border border-gray-400 rounded p-2 h-20"
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded"
                            >
                                {editCategory ? "Save Changes" : "Add Category"}
                            </button>
                            {editCategory && (
                                <button
                                    type="button"
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-2 rounded"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="bg-white shadow p-4 rounded border border-gray-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">Category List</h2>
                    <table className="min-w-full bg-white border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                                <th className="py-2 px-4 text-left border border-gray-300">#</th>
                                <th className="py-2 px-4 text-left border border-gray-300">Name</th>
                                <th className="py-2 px-4 text-left border border-gray-300">Description</th>
                                <th className="py-2 px-4 text-center border border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {categories.map((category, index) => (
                                <tr key={category._id} className="border-b border-gray-300">
                                    <td className="py-2 px-4 text-left whitespace-nowrap border border-gray-300">{index + 1}</td>
                                    <td className="py-2 px-4 text-left border border-gray-300">{category.name}</td>
                                    <td className="py-2 px-4 text-left border border-gray-300">{category.description}</td>
                                    <td className="py-2 px-4 text-center border border-gray-300">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600"
                                                onClick={() => handleEdit(category)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                                                onClick={() => handleDelete(category)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-3 text-gray-500 text-center border border-gray-300">
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
