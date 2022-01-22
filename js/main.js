import axiosClient from './api/axiosClient'
import postApi from './api/postApi'

async function main() {
  const response = await axiosClient.get('/posts')
  console.log(response)

  const params = {
    _page: 1,
    _limit: 5,
  }
  const reo = await postApi.getAll(params)
  console.log(reo)
}

main()
