import api from './api'

export async function openInstallmentPlan(payload) {
  const { data } = await api.post('/installment-plans', payload)
  return data
}

export async function getUserInstallmentPlans(userId) {
  const { data } = await api.get(`/installment-plans/user/${userId}`)
  return data
}

export async function payInstallment(planId, cardId) {
  const { data } = await api.post(`/installment-plans/${planId}/pay`, { cardId })
  return data
}
