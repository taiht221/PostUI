import dayjs from 'dayjs'
import postApi from './api/postApi'
import { setTextContent, truncateText } from './utils'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return
  // find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // change title, des. thumpnail
  const titleElemnt = liElement.querySelector(`[data-id="title"]`)
  if (titleElemnt) titleElemnt.textContent = post.title

  setTextContent(liElement, `[data-id="author"]`, post.author)

  setTextContent(liElement, `[data-id="description"]`, truncateText(post.description, 90))

  setTextContent(liElement, `[data-id="timeSpan"]`, `- ${dayjs(post.updatedAt).fromNow()}`)

  const thumbnailElemnt = liElement.querySelector(`[data-id="thumbnail"]`)

  // if (post?.imageUrl === 'https://picsum.photos/id/771/1368/400') post.imageUrl = ''

  if (thumbnailElemnt) {
    thumbnailElemnt.src = post.imageUrl
    thumbnailElemnt.addEventListener('error', () => {
      thumbnailElemnt.src = 'https://via.placeholder.com/318x200?text=Image'
    })
    thumbnailElemnt.alt = post.title
  }

  return liElement
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
      _limit: 6,
    }
    const { data, pagination } = await postApi.getAll(params)
    renderPostList(data)
  } catch (error) {
    console.log('get all fail', error)
  }
})()
