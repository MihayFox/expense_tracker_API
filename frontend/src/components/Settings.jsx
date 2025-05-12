import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/authContext'
import axios from 'axios'

const Settings = () => {
  const { user, login } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // new password
    currentPassword: '',
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // new password
        currentPassword: '',
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setMessageType('')

    if (!formData.currentPassword) {
      setMessage('Please enter your current password to save changes.')
      setMessageType('error')
      return
    }

    const updateData = {
      currentEmail: user?.email,
      currentPassword: formData.currentPassword,
    }

    if (formData.name !== (user?.name || '')) {
      updateData.name = formData.name
    }
    if (formData.email !== (user?.email || '')) {
      updateData.email = formData.email
    }
    if (formData.password) {
      updateData.password = formData.password
    }

    if (Object.keys(updateData).length <= 2) {
      setMessage('No changes to save.')
      setMessageType('info')
      setFormData({ ...formData, password: '', currentPassword: '' })
      return
    }


    try {
      const response = await axios.put(
        'http://localhost:3000/api/auth/update',
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      if (response.data.success) {
        const updatedUser = response.data.user

        login(updatedUser, localStorage.getItem('token'))

        setMessage('Settings updated successfully!')
        setMessageType('success')
        setFormData({ ...formData, password: '', currentPassword: '' })
      } else {
        setMessage(response.data.message || 'Failed to update settings.')
        setMessageType('error')
      }

    } catch (err) {
      console.error('Error updating settings:', err)
      if (err.response) {
        setMessage(err.response.data?.message || `Error: ${err.response.status}`)
        setMessageType('error')
      } else if (err.request) {
        setMessage('No response received from server.')
        setMessageType('error')
      } else {
        setMessage('An error occurred while setting up the request.')
        setMessageType('error')
      }
    }
  }

  if (!user) {
    return <div className="text-center mt-8 text-gray-600">Please log in to view settings.</div>
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Account Settings</div>
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black">Update Your Information</h2>

            {message && (
              <div className={`mt-4 p-3 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : messageType === 'info' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>

              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>


              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings