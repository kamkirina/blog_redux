import classNames from 'classnames'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { registerUser } from '../../../services/blogAPIService'
import { setSubmit } from '../../../utils/status-slice'
import { setErrors } from '../../../utils/user-slice'

import cl from './SignUp.module.scss'

function SignUp() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useForm()

  const dispatch = useDispatch()

  const servErr = useSelector((state) => state.user.errors)
  const { user } = useSelector((state) => state.user)

  const onSubmit = (data) => {
    dispatch(setSubmit(false))
    dispatch(registerUser(data))
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
        <h1 className={cl.title}>Create new account</h1>

        <ul className={cl.inputsList}>
          <li className={cl.inputsItem}>
            <label htmlFor="name" className={cl.label}>
              Username{' '}
            </label>
            <input
              className={cl.input}
              type="text"
              id="name"
              placeholder="Username"
              autoFocus
              style={errors.username && { outline: '1px solid #F5222D' }}
              {...register('username', {
                required: 'Your username can`t be empty.',
                minLength: {
                  value: 3,
                  message: 'Your username needs to be at least 3 characters.',
                },
                maxLength: {
                  value: 20,
                  message: 'Your username needs to be not more than 20 characters.',
                },
                pattern: {
                  value: /^(?![\d+_@.-]+$)[a-zA-Z0-9+_@.-]*$/,
                  message: 'Your username can`t contain spaces.',
                },
              })}
            />
            {servErr?.username && (
              <p className={cl.error}>
                {user.username} {servErr?.username}
              </p>
            )}
            {errors.username && <p className={cl.error}>{errors.username.message}</p>}
          </li>

          <li className={cl.inputsItem}>
            <label htmlFor="email" className={cl.label}>
              Email address{' '}
            </label>
            <input
              className={cl.input}
              type="text"
              id="email"
              placeholder="Email address"
              onKeyUp={() => {
                setValue('email', watch('email').toLowerCase())
              }}
              style={errors.email && { outline: '1px solid #F5222D' }}
              {...register('email', {
                required: 'Your email address can`t be empty',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Your email address is not correct',
                },
              })}
            />
            {servErr?.email && (
              <p className={cl.error}>
                {user.email} {servErr?.email}
              </p>
            )}
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
                required: 'Your password can`t be empty.',
                minLength: {
                  value: 6,
                  message: 'Your password needs to be at least 6 characters.',
                },
                maxLength: {
                  value: 40,
                  message: 'Your password needs to be not more than 40 characters.',
                },
              })}
            />
            {errors.password && <p className={cl.error}>{errors.password.message}</p>}
          </li>

          <li className={cl.inputsItem}>
            <label htmlFor="repeatPassword" className={cl.label}>
              Repeat Password{' '}
            </label>
            <input
              className={cl.input}
              type="password"
              id="repeatPassword"
              placeholder="Password"
              style={errors.repeatPassword && { outline: '1px solid #F5222D' }}
              {...register('repeatPassword', {
                required: 'Your password can`t be empty.',
                validate: (value) => {
                  const { password } = getValues()
                  return password === value || 'Passwords must match!'
                },
              })}
            />
            {errors.repeatPassword && <p className={cl.error}>{errors.repeatPassword.message}</p>}
          </li>
        </ul>
        <div className={cl.agreement}>
          <label htmlFor="agreement" className={cl.checkLabel}>
            <input
              className={cl.checkbox}
              type="checkbox"
              id="agreement"
              name="agreement"
              style={errors.agreement && { outline: '1px solid #F5222D' }}
              {...register('agreement', {
                required: 'You need to confirm user agreement',
              })}
            />
            I agree to the processing of my personal information
          </label>
        </div>
        {errors.agreement && <p className={cl.error}>{errors.agreement.message}</p>}

        <button type="submit" className={submit} disabled={!submitActive}>
          Create
        </button>

        <span className={cl.signInLabel}>
          Already have an account?{' '}
          <Link className={cl.signIn} to="/SignIn">
            Sign In.
          </Link>
        </span>
      </form>
    </div>
  )
}

export default SignUp
