import dayjs from 'dayjs'
import postApi from './api/postApi'
import { getUlPagination, setTextContent, truncateText } from './utils'
import relativeTime from 'dayjs/plugin/relativeTime'
import debounce from 'lodash.debounce'

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
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  // clear current list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination()
  if (!pagination || !ulPagination) return

  // calc totalPages
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check if enable/disable pre next link
  if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled')
  else ulPagination.firstElementChild.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild.classList.add('disabled')
  else ulPagination.lastElementChild.classList.remove('disabled')
}

async function handleFilterChange(filterName, filterValue) {
  try {
    //update query params
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)

    // reset page if page = 3 and item in page 1
    if (filterName === 'title_like') url.searchParams.set('_page', 1)
    history.pushState({}, '', url)

    //fetch Api

    //re-render Post List
    const { data, pagination } = await postApi.getAll(url.searchParams)

    renderPagination(pagination)
    renderPostList(data)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

function handlePreClick(e) {
  e.preventDefault()
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return

  handleFilterChange('_page', page - '1')
}

function handleNextClick(e) {
  e.preventDefault()
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = ulPagination.dataset.totalPages
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

function initPagination() {
  //bind click event for pre next button
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  //Pre link button
  const preLink = ulPagination.firstElementChild?.firstElementChild
  if (preLink) {
    preLink.addEventListener('click', handlePreClick)
  }

  //Next link button
  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

function initURl() {
  const url = new URL(window.location)

  // set default params for url
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}

function initSearch() {
  const searchInput = document.getElementById('searchInput')
  if (!searchInput) return

  // set default values from query params
  // query title_like
  const params = new URLSearchParams(window.location.search)
  if (params.get('title_like')) searchInput.value = params.get('title_like')

  const debounceSearch = debounce((e) => handleFilterChange('title_like', e.target.value), 500)
  searchInput.addEventListener('input', debounceSearch)
}

;(async () => {
  try {
    initPagination()
    initURl()
    initSearch()

    const params = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(params)

    renderPagination(pagination)
    renderPostList(data)
  } catch (error) {
    console.log('get all fail', error)
  }
})()
