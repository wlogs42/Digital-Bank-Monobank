import api from './api'

export async function registerUser(payload) {
  const { data } = await api.post('/users', payload)
  return data
}

export async function loginUser(payload) {
  const { data } = await api.post('/login', payload)
  return data
}
