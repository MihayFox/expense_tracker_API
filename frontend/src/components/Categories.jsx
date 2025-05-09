import axios from 'axios';
import React, { useState } from 'react';

const Categories = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [categories, setCategories] = useState([])
    const [editCategory, setEditCategory] = useState(null)

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
    fetchCategories()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            if (editCategory) {
                const response = await axios.put(
                    `http://localhost:3000/api/category/${editCategory}`,
                    {
                        categoryName,
                        categoryDescription
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        },
                    },
                );

                if (response.data.success) {
                    alert("Category edited successfully!");
                    setEditCategory(null)
                    setCategoryName("");
                    setCategoryDescription("");
                    fetchCategories()
                }
            } else {
                const response = await axios.post(
                    "http://localhost:3000/api/category/add",
                    {
                        categoryName,
                        categoryDescription
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        },
                    },
                );

                if (response.data.success) {
                    alert("Category added successfully!");
                    setCategoryName("");
                    setCategoryDescription("");
                    fetchCategories()
                }
            }
        } catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data.message);
            }
        }
    }

    const handleEdit = async (category) => {
        setEditCategory(category._id)
        setCategoryName(category.name)
        setCategoryDescription(category.description)
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/category/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            if (response.data.success) {
                alert("Category deleted")
                fetchCategories()
            } else {
                alert("Error deleting category")
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
        <div className="p-4">
            <h1 className="text-2xl mb-8">Category Management</h1>

            <div className="flex flex-row gap-4">
                <div className="bg-white">
                    <h2 className="text-2xl font-bold">{editCategory ? "Edit category" : "Add category"}</h2>

                    {errorMessage &&
                        <div className="text-red-500 mb-4">
                            {errorMessage}
                        </div>
                    }

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Category name"
                            className="border p-2 block"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Category description"
                            className="border p-2 block"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                        />
                        <div>
                            <button
                                type="submit"
                                className="bg-green-500 text-white p-2 block">
                                {editCategory ? "Save changes" : "Add category"}
                            </button>
                            {editCategory && (
                                <button
                                    className="mt-2 bg-red-500 text-white p-3"
                                    onClick={handleCancel}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div>
                    <div className="bg-white">
                        <table className="w-full border">
                            <thead>
                                <tr>
                                    <th className="border p-2">Index</th>
                                    <th className="border p-2">Category name</th>
                                    <th className="border p-2">Description</th>
                                    <th className="border p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category._id}>
                                        <td className="border p-2">{index++}</td>
                                        <td className="border p-2">{category.name}</td>
                                        <td className="border p-2">{category.description}</td>
                                        <td className="border p-2">
                                            <button
                                                className="bg-blue-500 text-white p-2"
                                                onClick={() => handleEdit(category)}>
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2"
                                                onClick={() => handleDelete(category._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Categories;