import api from './api'

export async function lookupCard(cardNumber) {
  const { data } = await api.get(`/cards/lookup/${cardNumber}`)
  return data
}

export async function transferFunds(payload) {
  const { data } = await api.post('/transfers', payload)
  return data
}

export async function getCardTransactions(cardId) {
  const { data } = await api.get(`/cards/${cardId}/transactions`)
  return data
}
