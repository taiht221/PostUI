import postApi from './api/postApi'
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    let defaulValues = {
      title: '',
      description: '',
      author: '',
      imageUrl: '',
    }

    if (postId) {
      document.getElementById('postDetailTitle').textContent = 'Edit a post'
      document.title = 'Edit Post'
      defaulValues = await postApi.getById(postId)
    } else {
      document.getElementById('postDetailTitle').textContent = 'Add a new post'
      document.title = 'Add Post'
    }

    console.log(defaulValues)
  } catch (error) {
    console.log('get post detail fail', error)
  }
})()
