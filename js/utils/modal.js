export function initModal({ modalId, postElement, onChange }) {
  console.log(modalId)
  const modal = document.getElementById(modalId)
  const closeButton = modal.querySelector(`button[data-button="no"]`)
  const yesButton = modal.querySelector(`button[data-button="yes"]`)

  if (modal) {
    modal.querySelector(
      '.modal-body'
    ).textContent = `Do you really want to delete post ${postElement.detail.title}?`
    modal.classList.add('show')
    modal.style.display = 'block'
    document.body.classList.add('modal-open')
    document.querySelector('.modal-backdrop').classList.remove('d-none')
    postElement.target.parentNode.parentNode
      .querySelector('.spinner-border')
      .classList.remove('d-none')
    closeButton.addEventListener('click', () => {
      modal.classList.remove('show')
      modal.style.display = 'none'
      document.body.classList.remove('modal-open')
      document.querySelector('.modal-backdrop').classList.add('d-none')
      postElement.target.parentNode.parentNode
        .querySelector('.spinner-border')
        .classList.add('d-none')
    })
    yesButton.addEventListener('click', (e) => {
      modal.classList.remove('show')
      modal.style.display = 'none'
      document.body.classList.remove('modal-open')
      document.querySelector('.modal-backdrop').classList.add('d-none')
      postElement.target.parentNode.parentNode
        .querySelector('.spinner-border')
        .classList.add('d-none')
      onChange()
    })
  }
}
