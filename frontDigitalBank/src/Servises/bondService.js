import api from './api'

export async function getBondOffers() {
  const { data } = await api.get('/bond-offers')
  return data
}

export async function buyBond(payload) {
  const { data } = await api.post('/bonds', payload)
  return data
}

export async function getUserBonds(userId) {
  const { data } = await api.get(`/bonds/user/${userId}`)
  return data
}

export async function redeemBond(bondId, cardId) {
  const { data } = await api.post(`/bonds/${bondId}/redeem`, { cardId })
  return data
}
