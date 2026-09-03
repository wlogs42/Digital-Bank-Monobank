import api from './api'

export async function getDepositRates() {
  const { data } = await api.get('/deposits/rates')
  return data
}

export async function openDeposit(payload) {
  const { data } = await api.post('/deposits', payload)
  return data
}

export async function getUserDeposits(userId) {
  const { data } = await api.get(`/deposits/user/${userId}`)
  return data
}

export async function withdrawDeposit(depositId, cardId) {
  const { data } = await api.post(`/deposits/${depositId}/withdraw`, { cardId })
  return data
}
