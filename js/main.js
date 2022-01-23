import axiosClient from './api/axiosClient'
import postApi from './api/postApi'

async function main() {
  const response = await axiosClient.get('/posts')

  const params = {
    _page: 1,
    _limit: 5,
  }
  const reo = await postApi.getAll(params)
}

main()
