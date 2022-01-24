import axiosClient from './axiosClient'

const postApi = {
  getAll(params) {
    const url = '/posts'
    return axiosClient.get(url, { params: params })
  },

  getById(id) {
    const url = `/posts/${id}`
    return axiosClient.get(url)
  },

  add(data) {
    const url = '/posts'
    return axiosClient.patch(url, data)
  },

  update(data) {
    const url = `/posts/${data.id}`
    return axiosClient.patch(url, data)
  },

  delete(id) {
    const url = `/posts/${id}`
    return axiosClient.patch(url)
  },
}

export default postApi
