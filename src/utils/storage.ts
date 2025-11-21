// LocalStorage helpers with JSON parsing and defaulting
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (e) {
    console.warn('Failed to parse localStorage for', key, e)
    return fallback
  }
}

export function saveJSON<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('Failed to save localStorage for', key, e)
  }
}

export const KEYS = {
  employees: 'sam_employees',
  shifts: 'sam_shifts',
  activeShift: 'sam_active_shift',
  closing: 'sam_closing',
  lastRoute: 'sam_last_route'
}
