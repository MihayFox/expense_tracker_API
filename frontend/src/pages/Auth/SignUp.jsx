import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate, Link } from 'react-router-dom'
import Input from "../../components/inputs/Input"
import { validateEmail } from '../../utils/helper'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (!fullName) {
      return setError("Please enter your name")
    }

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address")
    }

    if (!password) {
      return setError("Please enter a password")
    }

    setError("")

    // Sign up API Call
  }

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          Create an Account
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Create an account by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="example@email.com"
              type="text"
            />
            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Password"
                type="Password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
