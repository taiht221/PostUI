import postApi from './api/postApi'
import { initPagination, initSearch, renderPagination, renderPostList } from './utils'

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

    renderPagination('Pagination', pagination)
    renderPostList('postList', data)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

;(async () => {
  try {
    const url = new URL(window.location)

    // set default params for url
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const params = url.searchParams

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
