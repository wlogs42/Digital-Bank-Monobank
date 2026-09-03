import api from './api'

export async function takeCredit(payload) {
  const { data } = await api.post('/credits', payload)
  return data
}

export async function getUserCredits(userId) {
  const { data } = await api.get(`/credits/user/${userId}`)
  return data
}

export async function repayCredit(creditId, cardId) {
  const { data } = await api.post(`/credits/${creditId}/repay`, { cardId })
  return data
}
