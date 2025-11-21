import Layout from '../components/Layout'
import { useEffect, useMemo, useState } from 'react'
import { KEYS, loadJSON, saveJSON } from '../utils/storage'
import type { Employee, ShiftRecord } from '../types'

export default function AdminPage() {
  const [employees, setEmployees] = useState<Employee[]>(() => loadJSON<Employee[]>(KEYS.employees, []))
  const [shifts] = useState<ShiftRecord[]>(() => loadJSON<ShiftRecord[]>(KEYS.shifts, []))
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')

  function addEmployee() {
    if (!name || !pin) return
    const id = `${Date.now()}`
    setEmployees(prev => [...prev, { id, name, pin }])
    setName(''); setPin('')
  }
  function remove(id: string) {
    setEmployees(prev => prev.filter(e => e.id !== id))
  }
  function updateName(id: string, v: string) {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, name: v } : e))
  }
  function updatePin(id: string, v: string) {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, pin: v } : e))
  }

  useEffect(() => { saveJSON(KEYS.employees, employees) }, [employees])

  const totalHoursPerEmployee = useMemo(() => {
    const map: Record<string, number> = {}
    for (const s of shifts) {
      if (!s.durationMs) continue
      map[s.employeeId] = (map[s.employeeId] || 0) + s.durationMs
    }
    return map
  }, [shifts])

  function downloadPDF() {
    // lightweight text PDF using browser print to PDF via a data URL approach
    // Here we create a simple text blob and rely on the user to save as PDF
    const lines = [
      'Employee Hours Report',
      '',
      ...employees.map(e => `${e.name}: ${(Math.round(((totalHoursPerEmployee[e.id]||0)/3600000)*100)/100).toFixed(2)} hrs`)
    ].join('\n')
    const blob = new Blob([lines], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `employee-hours-${new Date().toISOString().slice(0,10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto card-dark p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-cyan-200 mb-4">Admin</h2>

        <div className="grid sm:grid-cols-3 gap-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Employee name" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2" />
          <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2" />
          <button onClick={addEmployee} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">Add</button>
        </div>

        <div className="h-6" />
        <div className="space-y-3">
          {employees.map(e => (
            <div key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between bg-slate-800/60 rounded-lg p-3 border border-slate-700/60">
              <div className="flex-1 flex gap-2">
                <input value={e.name} onChange={ev=>updateName(e.id, ev.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 flex-1" />
                <input value={e.pin} onChange={ev=>updatePin(e.id, ev.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-28" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyan-300 text-sm">{((totalHoursPerEmployee[e.id]||0)/3600000).toFixed(2)}h</span>
                <button onClick={()=>remove(e.id)} className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-6" />
        <button onClick={downloadPDF} className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white">Download Hours (TXT)</button>
      </div>
    </Layout>
  )
}
