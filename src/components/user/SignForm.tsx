'use client'

import ListErrors from '@/components/common/ListErrors'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { fetchWrapper } from '@/utils/fetch'

interface SignFormProps {
  isRegister?: boolean
}

interface UserForm {
  username: string
  email: string
  password: string
}

const SignForm = ({ isRegister }: SignFormProps) => {
  const [user, setUser] = useState<UserForm>({
    username: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const onFieldChange = (val: Partial<UserForm>) => {
    setUser({ ...user, ...val })
  }

  const handleSignIn = async () => {
    await signIn('credentials', {
      email: user.email,
      password: user.password,
      callbackUrl: '/',
    })
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isRegister) {
      const formData = { user }
      try {
        setLoading(true)
        await fetchWrapper('/users', 'POST', formData).then(handleSignIn)
      } catch (e: any) {
        setErrors(e.errors)
      } finally {
        setLoading(false)
      }
    } else {
      await handleSignIn()
    }
  }
  return (
    <>
      <ListErrors errors={errors} />
      <form onSubmit={handleFormSubmit}>
        {isRegister && (
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              name="username"
              placeholder="Username"
              data-testid="input-username"
              value={user.username}
              onChange={(e) => onFieldChange({ username: e.target.value })}
              disabled={loading}
            />
          </fieldset>
        )}
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            name="email"
            placeholder="Email"
            data-testid="input-email"
            value={user.email}
            onChange={(e) => onFieldChange({ email: e.target.value })}
            disabled={loading}
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            name="password"
            placeholder="Password"
            data-testid="input-password"
            value={user.password}
            onChange={(e) => onFieldChange({ password: e.target.value })}
            disabled={loading}
          />
        </fieldset>
        <button
          className="btn btn-lg btn-primary pull-xs-right"
          data-testid="btn-submit"
          disabled={loading}
        >
          {isRegister ? 'Sign up' : 'Sign in'}
        </button>
      </form>
    </>
  )
}

export default SignForm
