import postApi from './api/postApi'
import { lightBox, renderPostDetail } from './utils'
;(async () => {
  lightBox({
    modalId: 'lightbox',
    imageSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  })
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
