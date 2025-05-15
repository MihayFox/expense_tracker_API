import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
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
      }
    }
  }

  if (!user) {
    return <div className="text-center mt-8 text-gray-600">Please log in to view settings.</div>
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Account Settings</h1>
      <div className="bg-white shadow p-4 rounded border border-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Update Your Information</h2>
        {message && (
          <div className="p-3 rounded text-sm bg-red-200 text-red-800 border border-red-500">
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
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
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
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings