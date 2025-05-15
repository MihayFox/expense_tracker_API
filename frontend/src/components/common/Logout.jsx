import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

const Logout = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    logout()
    navigate("/homepage")
  }, [logout, navigate])
}

export default Logout