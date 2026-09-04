export function formatDateTime(isoString){
    const date = new Date(isoString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const time = date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })

    if (isToday) return `Сьогодні, ${time}`
    const datePart = date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })
    return `${datePart}, ${time}`
}