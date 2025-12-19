export const formatTime = (time: number) => {
  if (!time || isNaN(time)) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0') // ensures two digits, e.g., 05

  return `${minutes}:${seconds}`
}
