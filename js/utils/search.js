//dump function Pure function (do anything you give not affect to you project)

import debounce from 'lodash.debounce'

export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId)
  if (!searchInput) return
  // set default values from query params
  // query title_like
  if (defaultParams && defaultParams.get('title_like'))
    searchInput.value = defaultParams.get('title_like')

  const debounceSearch = debounce((e) => onChange?.(e.target.value), 500)
  searchInput.addEventListener('input', debounceSearch)
}
