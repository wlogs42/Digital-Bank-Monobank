import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5036',
})

export default api
