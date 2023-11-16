import React from 'react'
import { Route, Routes } from 'react-router-dom'

import './App.scss'
import ArticleForm from '../Article/ArticleForm'
import CreateArticle from '../Article/CreateArticle'
import ArticlesList from '../ArticlesList'
import Layout from '../Layout/Layout'
import Profile from '../User/Profile'
import SignIn from '../User/SignIn'
import SignUp from '../User/SignUp'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ArticlesList />} />
          <Route path="/articles/" element={<ArticlesList />} />
          <Route path="/articles/page=?:" element={<ArticlesList />} />
          <Route path="/articles/:slug" element={<ArticleForm />} />
          <Route path="/articles/:slug/edit" element={<CreateArticle />} />
          <Route path="/new-article" element={<CreateArticle />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
