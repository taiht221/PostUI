import { randomNumber, setBackgroundImg, setTextContent } from '.'
import { setFieldValues } from './common'
import * as yup from 'yup'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

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
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please click to random a background image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('require', 'Please select an image to upload', (value) => {
          return Boolean(value?.name)
        })
        .test('max-size', 'The image is too lagre (max 3mb)', (file) => {
          const fileSize = file?.size || 0
          // file should lower than 3MB   1mb =1024KB 1KB =1024Byte max size = 3 *1024 *1024
          const MAX_SIZE = 3 * 1024 * 1024
          return fileSize <= MAX_SIZE
        }),
    }),
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
    ;['title', 'author', 'imageUrl', 'imageSource', 'imageUrl', 'image'].forEach((name) =>
      setFieldError(form, name, '')
    )

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

async function validateFormField(form, formValues, name) {
  try {
    //clear previous values
    setFieldError(form, name, '')

    const schema = createYupSchema()
    await schema.validateAt(name, formValues)
  } catch (error) {
    setFieldError(form, name, error.message)
  }

  //show validation errror
  const field = form.querySelector(`[name='${name}']`)
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated')
  }
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
    const imageUrl = `https://picsum.photos/id/${randomNumber(300)}/1378/400`

    setFieldValues(form, "[name='imageUrl']", imageUrl)
    setBackgroundImg(document, '#postHeroImage', imageUrl)
  })
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll("[data-id='imageSource']")
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll(`[name="imageSource"]`)
  if (radioList || Array.isArray(radioList)) {
    radioList.forEach((radio) => {
      radio.addEventListener('change', (event) =>
        renderImageSourceControl(form, event.target.value)
      )
    })
  }
}

function initUpLoadImage(form) {
  const uploadImage = form.querySelector("[name='image']")
  if (!uploadImage) return

  uploadImage.addEventListener('change', (e) => {
    const file = e.target.files[0]

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setBackgroundImg(document, '#postHeroImage', imageUrl)

      validateFormField(form, { imageSource: ImageSource.UPLOAD, image: file }, 'image')
    }
  })
}

function initValidationOnChange(form) {
  ;['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (field) {
      field.addEventListener('input', (event) => {
        const newValue = event.target.value
        validateFormField(form, { [name]: newValue }, name)
      })
    }
  })
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false

  setFormValues(form, defaultValues)

  initRandomImage(form)
  initRadioImageSource(form)
  initUpLoadImage(form)
  initValidationOnChange(form)

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
