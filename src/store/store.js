import { configureStore } from '@reduxjs/toolkit'

import articlesSlice from '../utils/articles-slice'
import statusSlice from '../utils/status-slice'
import tagsSlice from '../utils/tags-slice'
import userSlice from '../utils/user-slice'

const store = configureStore({
  reducer: {
    user: userSlice,
    articles: articlesSlice,
    status: statusSlice,
    tags: tagsSlice,
  },
})

export default store
