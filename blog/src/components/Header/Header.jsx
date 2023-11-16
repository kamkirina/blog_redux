import classNames from 'classnames'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { getUser } from '../../services/blogAPIService'
import { logOut } from '../../utils/user-slice'

import cl from './Header.module.scss'

const link = classNames(cl.link)
const signUp = classNames(link, cl.signUp)
const createArticle = classNames(link, cl['create-article'])
const logOutBtn = classNames(link, cl['log-out'])

function Header() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { token } = user
  const avatar = user.image ? user.image : 'https://static.productionready.io/images/smiley-cyrus.jpg'

  const onLogOut = () => {
    localStorage.removeItem('user')
    dispatch(logOut())
  }

  useEffect(() => {
    if (token) {
      dispatch(getUser(token))
    }
  }, [])

  const headerAuthorization = (
    <ul className={cl.authorization}>
      <li>
        <Link className={link} to="/sign-in">
          Sign In
        </Link>
      </li>
      <li>
        <Link className={signUp} to="/sign-up">
          Sign Up
        </Link>
      </li>
    </ul>
  )

  const headerMenu = (
    <div className={cl.menu}>
      <Link to="/new-article" className={createArticle}>
        Create article
      </Link>
      <Link to="/profile" className={cl.user}>
        <span className={cl.userName}>{user.username}</span>
        <img className={cl.user__avatar} src={avatar} alt="avatar" />
      </Link>
      <Link to="/" className={logOutBtn} onClick={() => onLogOut()}>
        Log Out
      </Link>
    </div>
  )

  return (
    <div className={cl.main}>
      <Link to="/articles" className={cl.label}>
        Realworld Blog
      </Link>
      {token ? headerMenu : headerAuthorization}
    </div>
  )
}

export default Header
