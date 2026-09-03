import api from './api'

export async function createPiggyBank(payload) {
  const { data } = await api.post('/piggy-banks', payload)
  return data
}

export async function getUserPiggyBanks(userId) {
  const { data } = await api.get(`/piggy-banks/user/${userId}`)
  return data
}

export async function depositToPiggyBank(piggyBankId, payload) {
  const { data } = await api.post(`/piggy-banks/${piggyBankId}/deposit`, payload)
  return data
}

export async function withdrawFromPiggyBank(piggyBankId, payload) {
  const { data } = await api.post(`/piggy-banks/${piggyBankId}/withdraw`, payload)
  return data
}
