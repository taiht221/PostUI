import { setBackgroundImg, setTextContent } from '.'
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
  const errors = {
    title: createYupSchema,
  }

  //set errors

  for (const key in errors) {
    const element = form.querySelector(`[name="${key}"]`)
    if (element) {
      element.setCustomValidity(errors[key])
      setTextContent(element.parentElement, '.invalid-feedback', errors[key])
    }
  }

  try {
    // reset previous errors
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))

    const schema = createYupSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError') {
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

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValues)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formValues = getFormValues(form)

    if (!validateForm(form, formValues)) return
  })
}
