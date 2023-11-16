import { Spin } from 'antd'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { deleteArticle, fetchArticle, fetchArticles, setLike } from '../../../services/blogAPIService'
import { setGoTo } from '../../../utils/status-slice'

import cl from './SingleArticle.module.scss'

function SingleArticle({ article }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { slug } = useParams()

  const { location } = useSelector((state) => state.status)
  const { user } = useSelector((state) => state.user)
  const { username, token } = user

  const cardStyle = location === 'articles-list' ? cl.preview : classNames(cl.preview, cl.singleCard)

  const [modal, setModal] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(true)
  const title = article.title.length < 1 ? 'NO TITLED ARTICLE' : article.title
  const articlePath = `/articles/${article.slug}`
  const { page, limit } = useSelector((state) => state.articles)

  useEffect(() => {
    if (location === 'article-page') dispatch(setGoTo(''))
  }, [])

  useEffect(() => {
    setAvatar(article.avatarPath)
  }, [article.avatarPath])

  const printTags = (post) =>
    post.tags.map((tag) => {
      const tagStr = String(tag)
      if (tagStr.length > 20 || tagStr.length < 1) return null
      return (
        <li key={uuidv4()} className={cl.tag}>
          {tagStr}
        </li>
      )
    })

  const onLike = () => {
    if (token) {
      dispatch(setLike(token, article.slug, article.liked))
      location === 'article-page'
        ? dispatch(fetchArticle(article.slug, token))
        : dispatch(fetchArticles(page, limit, token))
    }
  }

  const onDelete = () => {
    dispatch(deleteArticle(token, slug))
    navigate('/')
  }
  const likeStyl = classNames(cl.blackLike, token && cl.activeLike, article.liked && cl.redLike)

  const editLink = `/articles/${slug}/edit`
  const deleteBtn = classNames(cl.btn, cl.delete)
  const editBtn = classNames(cl.btn, cl.edit)
  const yesBtn = classNames(cl.btn, cl.yes)
  const noBtn = classNames(cl.btn, cl.no)

  return (
    <div className={cl.cardWrapper}>
      <div className={cardStyle}>
        <section className={cl.content}>
          <div className={cl.titleWrapper}>
            <Link to={articlePath} className={cl.title}>
              {title}
            </Link>
            <button onClick={() => onLike()} className={likeStyl}>
              {article.likes}
            </button>
          </div>
          <ul className={cl.tags}>{printTags(article)}</ul>
          <p className={cl.description}>{article.description}</p>
        </section>
        <section className={cl.info}>
          <div className={cl.authInfo}>
            <div className={cl.infoWrapper}>
              <span className={cl.author}>{article.username}</span>
              <span className={cl.date}>{article.updatedDate}</span>
            </div>
            {loading && <Spin style={{ position: 'absolute', right: '30px', top: '20px' }} />}
            <img
              alt="avatar"
              src={avatar}
              className={cl.avatar}
              onLoad={() => {
                setLoading(false)
              }}
              onError={() => setAvatar('/no-avatar.png')}
            />
          </div>
          {location === 'article-page' && article.username === username && (
            <ul className={cl.control}>
              <li>
                <button className={deleteBtn} type="button" onClick={() => setModal(true)}>
                  Delete
                </button>
              </li>
              <li>
                <button type="button" className={editBtn} onClick={() => navigate(editLink)}>
                  Edit
                </button>
              </li>
            </ul>
          )}
        </section>
      </div>
      {/* eslint-disable-next-line react/no-children-prop */}
      {location === 'article-page' && <ReactMarkdown children={article.text} className={cl.pageText} />}

      {modal && (
        <div className={cl.modal}>
          <span className={cl.modalLabel}>Are you sure to delete this article?</span>
          <div className={cl.modalBtns}>
            <button type="button" className={noBtn} onClick={() => setModal(false)}>
              No
            </button>
            <button type="button" className={yesBtn} onClick={() => onDelete()}>
              Yes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SingleArticle
