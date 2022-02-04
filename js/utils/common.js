export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)

  if (element) element.textContent = text
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1)}…`
}

export function setFieldValues(form, selector, value) {
  if (!form) return

  const field = form.querySelector(selector)

  if (field) field.value = value
}

export function setBackgroundImg(parent, selector, imgUrl) {
  if (!parent) return
  const heroImage = parent.querySelector(selector)
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${imgUrl}")`

    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://via.placeholder.com/1368x400?text=Image'
    })
  }
}

export function randomNumber(n) {
  if (n <= 0) return -1

  const random = Math.random() * n
  return Math.round(random)
}
