import { setBackgroundImg } from '.'
import { setFieldValues } from './common'

function setFormValues(form, formValues) {
  console.log(formValues)
  setFieldValues(form, "[name='title']", formValues?.title)
  setFieldValues(form, "[name='author']", formValues?.author)
  setFieldValues(form, "[name='description']", formValues?.description)
  setFieldValues(form, "[name='imageUrl']", formValues?.imageUrl) //hidden Field
  setBackgroundImg(document, '#postHeroImage', formValues?.imageUrl)
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  console.log(form)
  if (!form) return

  setFormValues(form, defaultValues)
}
