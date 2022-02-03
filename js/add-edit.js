import postApi from './api/postApi'
import { initPostForm } from './utils'
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    let defaultValues = {
      title: '',
      description: '',
      author: '',
      imageUrl: '',
    }

    if (postId) {
      document.getElementById('postDetailTitle').textContent = 'Edit a post'
      document.title = 'Edit Post'
      defaultValues = await postApi.getById(postId)
    } else {
      document.getElementById('postDetailTitle').textContent = 'Add a new post'
      document.title = 'Add Post'
    }
    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => console.log(formValues),
    })
  } catch (error) {
    console.log('get post detail fail', error)
  }
})()
