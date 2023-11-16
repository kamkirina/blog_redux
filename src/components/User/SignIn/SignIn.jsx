import classNames from 'classnames'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { registerUser } from '../../../services/blogAPIService'
import { setSubmit } from '../../../utils/status-slice'
import { setErrors } from '../../../utils/user-slice'
import signUp from '../SignUp/SignUp.module.scss'

import cl from './SignIn.module.scss'

function SignIn() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm()

  const servErr = useSelector((state) => state.user.errors)

  const dispatch = useDispatch()

  const onSubmit = (data) => {
    dispatch(setSubmit(false))
    dispatch(registerUser(data, true))
  }

  const navigate = useNavigate()
  const home = useSelector((state) => state.status.home)
  useEffect(() => {
    dispatch(setErrors(null))
    if (home) navigate('/')
  }, [home, dispatch, navigate])

  const { submitActive } = useSelector((state) => state.status)
  const submit = submitActive ? cl.submit : classNames(cl.submit, cl.disabledBtn)

  return (
    <div className={cl.page}>
      <form className={cl.form} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={cl.title}>Sign In</h1>

        <ul className={cl.inputsList}>
          <li className={cl.inputsItem}>
            <label htmlFor="email" className={cl.label}>
              Email address{' '}
            </label>
            <input
              className={cl.input}
              type="email"
              id="email"
              placeholder="Email address"
              autoFocus
              onKeyUp={() => {
                setValue('email', watch('email').toLowerCase())
              }}
              style={errors.email && { outline: '1px solid #F5222D' }}
              {...register('email', {
                required: 'Email address can`t be empty',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Email address is not correct',
                },
              })}
            />
            {errors.email && <p className={cl.error}>{errors.email.message}</p>}
          </li>
          <li className={cl.inputsItem}>
            <label htmlFor="password" className={cl.label}>
              Password{' '}
            </label>
            <input
              className={cl.input}
              type="password"
              id="password"
              placeholder="Password"
              style={errors.password && { outline: '1px solid #F5222D' }}
              {...register('password', {
                required: 'Password can`t be empty.',
              })}
            />
            {errors.password && <p className={cl.error}>{errors.password.message}</p>}
            {servErr && (
              <p className={signUp.error}>{`${Object.entries(servErr)[0][0]} ${Object.entries(servErr)[0][1]}`}</p>
            )}
          </li>
        </ul>

        <button type="submit" className={submit} disabled={!submitActive}>
          Sign In
        </button>

        <span className={cl.signInLabel}>
          Don`t have an account?
          <Link className={cl.signUp} to="/SignUp">
            Sign Up.
          </Link>
        </span>
      </form>
    </div>
  )
}

export default SignIn
