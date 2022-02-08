import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import postApi from '../api/postApi'
import { setTextContent, truncateText } from './common'

dayjs.extend(relativeTime)

export function createPostElement(post) {
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

  //  post detail  when click
  const postElement = liElement.firstElementChild
  if (postElement) {
    postElement.addEventListener('click', (e) => {
      const menu = liElement.querySelector(`[data-id="menu"]`)
      if (menu && menu.contains(e.target)) return
      window.location.assign(`/post-details.html?id=${post.id}`)
    })
  }

  // assign for edit button
  const editButton = liElement.querySelector(`[data-id="edit"]`)
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      // e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }

  // assign for remove button
  const removeButton = liElement.querySelector(`[data-id="remove"]`)
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      const customEvent = new CustomEvent('post-delete', {
        bubbles: true,
        detail: post,
      })
      removeButton.dispatchEvent(customEvent)
    })
  }

  return liElement
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById(elementId)
  if (!ulElement) return

  // clear current list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

export function renderPostDetail(post) {
  if (!post) return

  setTextContent(document, `#postDetailTitle`, post.title)

  setTextContent(document, `#postDetailDescription`, post.description)

  setTextContent(document, `#postDetailAuthor`, post.author)

  setTextContent(
    document,
    `#postDetailTimeSpan`,
    `${dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm')}`
  )

  // background hero Image
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`

    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://via.placeholder.com/1368x400?text=Image'
    })
  }

  // RENDER EDIT PAGE LINK
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `add-edit-post.html?id=${post.id}`
  }
}
