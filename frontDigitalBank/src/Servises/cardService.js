import api from './api'

export async function createCard(payload) {
  const { data } = await api.post('/cards', payload)
  return data
}
