import postApi from './api/postApi'
import { initPagination, initSearch, renderPagination, renderPostList, toast } from './utils'

async function handleFilterChange(filterName, filterValue) {
  try {
    //update query params
    const url = new URL(window.location)
    if (filterName) url.searchParams.set(filterName, filterValue)

    // reset page if page = 3 and item in page 1
    if (filterName === 'title_like') url.searchParams.set('_page', 1)
    history.pushState({}, '', url)

    //fetch Api

    //re-render Post List
    const { data, pagination } = await postApi.getAll(url.searchParams)

    renderPagination('Pagination', pagination)
    renderPostList('postList', data)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (e) => {
    //get post-id form custom event ->getID-> delete by ID
    try {
      const modal = document.getElementById('Modal')
      const closeButton = modal.querySelector(`button[data-button="no"]`)
      const yesButton = modal.querySelector(`button[data-button="yes"]`)

      if (modal) {
        modal
          .querySelector('modal-body')
          .textContent()=`Do you really want to delete post ${e.detail.title}?`
        modal.classList.add('show')
        modal.style.display = 'block'
        document.body.classList.add('modal-open')
        document.querySelector('.modal-backdrop').classList.remove('d-none')
        e.target.parentNode.parentNode.querySelector('.spinner-border').classList.remove('d-none')
        closeButton.addEventListener('click', () => {
          modal.classList.remove('show')
          modal.style.display = 'none'
          document.body.classList.remove('modal-open')
          document.querySelector('.modal-backdrop').classList.add('d-none')
          e.target.parentNode.parentNode.querySelector('.spinner-border').classList.add('d-none')
        })
        yesButton.addEventListener('click', () => {
          modal.classList.remove('show')
          modal.style.display = 'none'
          document.body.classList.remove('modal-open')
          document.querySelector('.modal-backdrop').classList.add('d-none')
          e.target.parentNode.parentNode.querySelector('.spinner-border').classList.add('d-none')
        })
      }
      // if (window.confirm(`Do you really want to delete post ${e.detail.title}?`)) {
      //
      //   const post = e.detail

      //   // await postApi.delete(post.id)
      //   await handleFilterChange()
      //   toast.success('Your post is delete')
      // }
    } catch (error) {
      toast.error(error.message)
    }
  })
}

;(async () => {
  try {
    const url = new URL(window.location)

    // set default params for url
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const params = url.searchParams

    registerPostDeleteEvent()

    initPagination({
      elementId: 'Pagination',
      defaultParams: params,
      onChange: (page) => handleFilterChange('_page', page),
    })

    initSearch({
      elementId: 'searchInput',
      defaultParams: params,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    const { data, pagination } = await postApi.getAll(params)
    renderPostList('postList', data)
    renderPagination('Pagination', pagination)
  } catch (error) {
    console.log('get all fail', error)
  }
})()
