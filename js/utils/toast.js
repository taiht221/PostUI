import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toast = {
  infor(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#007bff',
      },
    }).showToast()
  },
  success(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#28a745',
      },
    }).showToast()
  },
  error(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#dc3545',
      },
    }).showToast()
  },
  countdown(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#dc3545',
      },
    }).showToast()
  },
}
