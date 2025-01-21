export const timeMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinute = hours * 60 + minutes

    return totalMinute
}

export const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0')
    const mins = (minutes % 60).toString().padStart(2, '0')

    const time = `${hours}:${mins}`

    return time
}