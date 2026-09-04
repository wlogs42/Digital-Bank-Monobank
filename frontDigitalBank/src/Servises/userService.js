import api from './api'

export async function getUser(userId){
    const {data} = await api.get(`/users/${userId}`)
    return data
}

export async function updateUser(userId, payload){
    const {data} = await api.put(`/users/${userId}`, payload)
    return data
}
