import axiosClient from './api/axiosClient'
import postApi from './api/postApi'
import { setTextContent } from './utils'

function createPostElement(post) {
  if (!post) return
  try {
    // find and clone template
    const postTemplate = document.getElementById('postTemplate')
    if (!postTemplate) return

    const liElement = postTemplate.content.firstElementChild.cloneNode(true)
    if (!liElement) return

    // change title, des. thumpnail
    const titleElemnt = liElement.querySelector(`[data-id="title"]`)
    if (titleElemnt) titleElemnt.textContent = post.title

    setTextContent(liElement, `[data-id="author"]`, post.author)

    setTextContent(liElement, `[data-id="description"]`, post.description)

    const thumbnailElemnt = liElement.querySelector(`[data-id="thumbnail"]`)

    if (post?.imageUrl === 'https://picsum.photos/id/771/1368/400')
      post.imageUrl = 'https://via.placeholder.com/318x200'

    if (thumbnailElemnt) {
      thumbnailElemnt.src = post?.imageUrl
      thumbnailElemnt.alt = post.title
    }

    return liElement
  } catch (error) {
    console.log('fail to create post')
  }
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.lenght === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

;(async () => {
  try {
    const params = {
      _page: 1,
      _limit: 5,
    }
    const { data, pagination } = await postApi.getAll(params)
    renderPostList(data)
  } catch (error) {
    console.log('get all fail', error)
  }
})()
