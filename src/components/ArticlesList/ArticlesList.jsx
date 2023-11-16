import { Alert, Pagination, Spin } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchArticles } from '../../services/blogAPIService'
import { setPage } from '../../utils/articles-slice'
import { goHome, setLocation, setStatus } from '../../utils/status-slice'
import SingleArticle from '../Article/SingleArticle/SingleArticle'

import cl from './ArticlesList.module.scss'

function ArticlesList() {
  const dispatch = useDispatch()
  const { articles, articlesCount, page, limit } = useSelector((state) => state.articles)
  const status = useSelector((state) => state.status.status)
  const { token } = useSelector((state) => state.user.user)

  const PG = Number(localStorage.getItem('page')) || page

  useEffect(() => {
    dispatch(goHome(false))
    dispatch(setLocation('articles-list'))
    dispatch(setStatus('loading'))
    dispatch(fetchArticles(page, limit, token))
  }, [page, limit, dispatch, token])

  const articlez = articles.map((article) => (
    <li key={article.slug}>
      <SingleArticle article={article} />
    </li>
  ))

  const showContent = (stat) => {
    switch (stat) {
      case 'loading':
        return <Spin size="large" />
      case '404':
        return (
          <Alert
            message="По Вашему запросу ничего не найдено"
            description="Попробуйте изменить запрос"
            type="warning"
            showIcon
          />
        )
      case 'error':
        return <Alert message="Ошибка сервера" description="Перезагрузите страницу" type="error" showIcon />
      case 'offline':
        return (
          <Alert
            className={cl.error}
            message="Отсутствует интернет соединение"
            description="Пожалуйста проверьте подключение к интернету"
            type="error"
            showIcon
          />
        )
      default:
        return articlez
    }
  }

  const content = showContent(status)
  const onPaginationChange = (page) => {
    dispatch(setPage(page))
    const data = {
      offset: (page - 1) * 5,
      token: token || localStorage.token,
      page: Number(localStorage.getItem('page')),
    }
    localStorage.setItem('page', page)
    dispatch(fetchArticles(data))
  }

  return (
    <div className={cl.main}>
      <ul className={cl.list}>{content}</ul>
      {status !== 'error' && (
        <Pagination
          className={cl.pag}
          hideOnSinglePage
          current={PG}
          pageSize={limit}
          pageSizeOptions={[5, 10, 20, 40, 100, 500]}
          total={articlesCount}
          onChange={(PG) => onPaginationChange(PG)}
        />
      )}
    </div>
  )
}

export default ArticlesList
