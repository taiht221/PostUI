import { randomNumber, setBackgroundImg, setTextContent } from '.'
import { setFieldValues } from './common'
import * as yup from 'yup'

function setFormValues(form, formValues) {
  setFieldValues(form, "[name='title']", formValues?.title)
  setFieldValues(form, "[name='author']", formValues?.author)
  setFieldValues(form, "[name='description']", formValues?.description)
  setFieldValues(form, "[name='imageUrl']", formValues?.imageUrl) //hidden Field
  setBackgroundImg(document, '#postHeroImage', formValues?.imageUrl)
}

function getFormValues(form) {
  const values = {}

  //   ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name='${name}']`)
  //     if (field) values[name] = field.value
  //   })

  const data = new FormData(form)
  for (const [key, value] of data) {
    values[key] = value
  }
  return values
}

function createYupSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-word',
        'Please enter at least two word',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup
      .string()
      .required('Please click to random a background image')
      .url('Please enter a valid URL'),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validateForm(form, formValues) {
  // get errors --- set errors --- add was-validated class bs
  try {
    // reset previous errors
    ;['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''))

    const schema = createYupSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path

        if (errorLog[name]) continue

        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }

  // add was-validated class to form Element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

function showLoading(form) {
  const button = form.querySelector(`[name="submit"]`)
  if (button) {
    button.disabled = true
    button.innerHTML = '<i class="fas fa-save mr-1"></i>  Saving ...'
  }
}

function hideLoading(form) {
  const button = form.querySelector(`[name="submit"]`)
  if (button) {
    button.disabled = false
    button.innerHTML = '<i class="fas fa-save mr-1"></i>  Save'
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    //random Id for picsum URL
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1378/400`

    setFieldValues(form, "[name='imageUrl']", imageUrl)
    setBackgroundImg(document, '#postHeroImage', imageUrl)
  })
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false

  setFormValues(form, defaultValues)

  initRandomImage(form)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (submitting) return

    showLoading(form)
    submitting = true

    const formValues = getFormValues(form)
    // ADD id for Edit page
    formValues.id = defaultValues.id

    const isValid = await validateForm(form, formValues)

    // Promise is truthy !Promise alway false --> so alway pass return
    if (isValid) await onSubmit?.(formValues)

    hideLoading(form)
    submitting = false
  })
}
