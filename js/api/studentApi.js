import axiosClient from './axiosClient'

const postApi = {
  getAll(params) {
    const url = '/students'
    return axiosClient.get(url, { params: params })
  },

  getById(id) {
    const url = `/students/${id}`
    return axiosClient.get(url)
  },

  add(data) {
    const url = '/students'
    return axiosClient.patch(url, data)
  },

  update(data) {
    const url = `/students/${data.id}`
    return axiosClient.patch(url, data)
  },

  delete(id) {
    const url = `/students/${id}`
    return axiosClient.patch(url)
  },
}
export default postApi
