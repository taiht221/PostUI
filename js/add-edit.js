import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

async function handlePostFormSubmit(formValues) {
  try {
    // check  add or edit - call APi - show toast successs -redirect to detail page
    // if formValues have id key ==> Edit Page
    const apiValues = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)
    toast.success('Your Post Has Been Save !')

    setTimeout(() => window.location.assign(`/post-details.html?id=${apiValues.id}`), 3000)
  } catch (error) {
    toast.error(`Error: ${error.message}`)
  }
}

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
      onSubmit: (formValues) => handlePostFormSubmit(formValues),
    })
  } catch (error) {
    console.log('get post detail fail', error)
  }
})()
