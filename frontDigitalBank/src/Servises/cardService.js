import api from './api'

export async function createCard(payload) {
  const { data } = await api.post('/cards', payload)
  return data
}

export async function getUserCards(userId){
  const {data} = await api.get(`/cards/user/${userId}`)
  return data
}
