export function initLoader() {
  const loader = document.querySelector('.loader-container')
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const footer = document.querySelector('footer')

  setTimeout(() => {
    loader.style.opacity = 0
    loader.style.display = 'none'

    main.style.display = 'block'
    header.style.display = 'block'
    footer.style.display = 'block'
    setTimeout(() => {
      main.style.opacity = 1
      header.style.opacity = 1
      footer.style.opacity = 1
    }, 50)
  }, 3000)
}
