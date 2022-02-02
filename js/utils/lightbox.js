function showModal(modalElement) {
  if (!window.bootstrap) return
  const modal = new window.bootstrap.Modal(modalElement)
  if (modal) modal.show()
}

// handle click for Images
// image click -> find all images on pages
// get index of images
//show modal with selected images
//handle pre/next click

export function lightBox({ modalId, imageSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // check modal registered or not
  if (Boolean(modalElement.dataset.registered)) return

  //selectors
  const imgElement = modalElement.querySelector(imageSelector)
  const prevButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)
  if (!imgElement || !prevButton || !nextButton) return

  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src
  }

  document.addEventListener('click', (e) => {
    const { target } = e
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)
    // show image at index
    showImageAtIndex(currentIndex)
    //show modal
    showModal(modalElement)
  })
  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })

  modalElement.dataset.registered = 'true'
}
