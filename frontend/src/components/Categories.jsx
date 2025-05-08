import axios from 'axios';
import React, { useState } from 'react';

const Categories = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
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
            }

        } catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data.message);
            }
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-8">Category Management</h1>

            <div className="flex flex-row gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-bold">Add category</h2>

                    {errorMessage &&
                        <div className="text-red-500 mb-4">
                            {errorMessage}
                        </div>
                    }

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Category name"
                            className="border p-2 rounded-md block"
                            value={categoryName} // Add value prop to control input state
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Category description"
                            className="border p-2 rounded-md block"
                            value={categoryDescription} // Add value prop to control input state
                            onChange={(e) => setCategoryDescription(e.target.value)}
                        />
                        <button type="submit" className="rounded-md bg-green-500 text-white p-2 hover:bg-green-200 hover:text-green-800 block">Add category</button>
                    </form>
                </div>

                <div>

                </div>
            </div>
        </div>
    )
}

export default Categories;