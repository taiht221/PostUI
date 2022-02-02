import postApi from './api/postApi'
import { renderPostDetail } from './utils'
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) {
      alert('Post not found')
      return
    }
    const post = await postApi.getById(postId)
    renderPostDetail(post)
  } catch (error) {
    console.log('get post detail fail', error)
  }
})()
