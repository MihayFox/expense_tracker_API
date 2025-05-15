// src/pages/user/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext'; // Assuming useAuth hook comes from here

const UserSettings = () => {
  // Get the user using the custom hook
  const { user, login } = useAuth(); // Use the hook
  // FIX: Access user ID using 'id' instead of '_id'
  const userId = user?.id; // <-- Corrected access

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // New password field
    currentPassword: '', // Field to confirm current password
  });

  // State for messages and loading
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [isSaving, setIsSaving] = useState(false);
  const [ error, setError ] = useState(null)

  // Populate form data when the user object is available or changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Always clear password fields initially
        currentPassword: '',
      });
       // Fetch profile data when user is available
       fetchUserProfile(); // Call fetch function here
    } else {
       // Handle case where user is not available (shouldn't happen if Root redirects)
       setMessage('User data not available. Please log in.');
       setMessageType('error');
    }
  }, [user]); // Depend on user object

    // Function to fetch the user's profile data
    // Moved fetch logic into a separate function
    const fetchUserProfile = async () => {
        if (!userId) { // Check userId here
            // This case should be handled by the useEffect condition
            console.log("fetchUserProfile called without userId");
            return;
        }

        try {
            // setLoading(true); // Manage loading state more globally or in useEffect
            setError(null);

            // Use your backend endpoint to get a specific user by ID
            // Use the corrected userId (user.id)
            const response = await axios.get(`/api/users/${userId}`); // <<< Using user.id here

            if (response.data.success) {
                setProfileData({
                    name: response.data.user.name,
                    email: response.data.user.email,
                });
            } else {
                 setError(response.data.message || 'Failed to fetch profile data');
            }

        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError('Failed to load profile data. Please try again.');
             if (err.response && err.response.data && err.response.data.message) {
                 setError(err.response.data.message);
            }
        } finally {
            // setLoading(false); // Manage loading state
        }
    };


  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setMessage(''); // Clear previous messages
    setMessageType('');
    setIsSaving(true); // Set saving state

    if (!formData.currentPassword) {
      setMessage('Please enter your current password to save changes.');
      setMessageType('error');
      setIsSaving(false);
      return;
    }

    const updateData = {
      currentEmail: user?.email, // Use email from context as the identifier
      currentPassword: formData.currentPassword, // Use current password from form
    };

    if (formData.name !== (user?.name || '')) {
      updateData.name = formData.name;
    }
    if (formData.email !== (user?.email || '')) {
      updateData.email = formData.email;
    }
    if (formData.password) {
      updateData.password = formData.password;
    }

    if (Object.keys(updateData).length <= 2) {
      setMessage('No changes detected.');
      setMessageType('info');
      setFormData({ ...formData, password: '', currentPassword: '' });
      setIsSaving(false);
      return;
    }


    try {
      const response = await axios.put(
        'http://localhost:3000/api/auth/update', // Your backend endpoint
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.user;

        login(updatedUser, localStorage.getItem('token')); // Update context and localStorage

        setMessage('Profile updated successfully!');
        setMessageType('success');
        setFormData({ ...formData, password: '', currentPassword: '' });

      } else {
        setMessage(response.data.message || 'Failed to update profile.');
        setMessageType('error');
      }

    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response) {
        setMessage(err.response.data?.message || `Error: ${err.response.status}`);
      } else {
         setMessage('An unexpected error occurred. Please try again.');
      }
      setMessageType('error');

    } finally {
      setIsSaving(false);
    }
  };


   // --- Render Logic ---

   if (!user) {
       return (
         <div className="p-6 text-center text-gray-600">
             Loading user data or not logged in...
         </div>
       );
   }


  return (
     <div className="p-6 max-w-md mx-auto">
       <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">My Profile</h1>
       <div className="bg-white shadow p-4 rounded border border-gray-300">
         <h2 className="text-xl font-semibold mb-4 text-gray-700">Update Your Information</h2>

         {message && (
           <div className={`p-3 rounded text-sm mb-4 ${messageType === 'success' ? 'bg-green-200 text-green-800 border border-green-500' : 'bg-red-200 text-red-800 border border-red-500'}`}>
             {message}
           </div>
         )}

         <form onSubmit={handleSubmit} className="mt-4 space-y-3">
           <div>
             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
             <input
               type="text"
               id="name"
               name="name"
               value={formData.name}
               onChange={handleInputChange}
               className="w-full border border-gray-400 rounded p-2 text-gray-700"
             />
           </div>

           <div>
             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
             <input
               type="email"
               id="email"
               name="email"
               value={formData.email}
               onChange={handleInputChange}
               required
               className="w-full border border-gray-400 rounded p-2 text-gray-700"
             />
           </div>

           <div>
             <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password <span className="text-red-500">*</span></label>
             <input
               type="password"
               id="currentPassword"
               name="currentPassword"
               value={formData.currentPassword}
               onChange={handleInputChange}
               required
               className="w-full border border-gray-400 rounded p-2 text-gray-700"
             />
           </div>

           <div>
             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password (Leave blank to keep current)</label>
             <input
               type="password"
               id="password"
               name="password"
               value={formData.password}
               onChange={handleInputChange}
               className="w-full border border-gray-400 rounded p-2 text-gray-700"
             />
           </div>

           <div className="flex justify-end">
             <button
               type="submit"
               className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200
                          ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
               disabled={isSaving}
             >
               {isSaving ? 'Saving Changes...' : 'Save Changes'}
             </button>
           </div>
         </form>
       </div>
     </div>
   );
}

export default UserSettings