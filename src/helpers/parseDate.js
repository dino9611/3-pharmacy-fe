export const parseDate = (date) => {
    const event = new Date(date)
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return event.toLocaleDateString('id-ID', options)
}