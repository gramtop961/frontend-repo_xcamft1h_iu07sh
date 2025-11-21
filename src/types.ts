export type Employee = {
  id: string
  name: string
  pin: string
}

export type ShiftRecord = {
  id: string
  employeeId: string
  start: number // epoch ms
  end?: number // epoch ms
  durationMs?: number
  dateKey: string // YYYY-MM-DD
}

export type ClosingData = {
  step: number
  values: Record<string, any>
  images: Record<string, string> // data URLs
  meta?: { employeeName?: string; timestamp?: number; notes?: string }
}
