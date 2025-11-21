import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { variants } from '../utils/animations'
import { KEYS, loadJSON, saveJSON } from '../utils/storage'
import type { Employee, ShiftRecord } from '../types'

function formatHMS(ms: number) {
  const sec = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(sec / 3600).toString().padStart(2, '0')
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function ClockPage() {
  const [employees, setEmployees] = useState<Employee[]>(() => loadJSON<Employee[]>(KEYS.employees, [
    { id: '1', name: 'Sam', pin: '1234' },
    { id: '2', name: 'Alex', pin: '1111' },
  ]))

  const [selectedId, setSelectedId] = useState<string>('')
  const [pin, setPin] = useState('')
  const [loginError, setLoginError] = useState(false)

  const [activeShift, setActiveShift] = useState<ShiftRecord | null>(() => loadJSON<ShiftRecord | null>(KEYS.activeShift, null))
  const [shifts, setShifts] = useState<ShiftRecord[]>(() => loadJSON<ShiftRecord[]>(KEYS.shifts, []))

  useEffect(() => { saveJSON(KEYS.employees, employees) }, [employees])
  useEffect(() => { saveJSON(KEYS.activeShift, activeShift) }, [activeShift])
  useEffect(() => { saveJSON(KEYS.shifts, shifts) }, [shifts])

  // Timer rerender
  const [, force] = useState(0)
  useEffect(() => {
    const i = setInterval(() => force(v => v + 1), 1000)
    return () => clearInterval(i)
  }, [])

  const selectedEmployee = useMemo(() => employees.find(e => e.id === selectedId) || null, [employees, selectedId])

  const loggedIn = !!selectedEmployee && (activeShift?.employeeId === selectedEmployee.id || activeShift === null)

  function handleLogin() {
    const emp = employees.find(e => e.id === selectedId)
    if (!emp || emp.pin !== pin) {
      setLoginError(true)
      setTimeout(() => setLoginError(false), 500)
      return
    }
    // success
  }

  function clockIn() {
    if (!selectedEmployee) return
    const now = Date.now()
    const dateKey = new Date(now).toISOString().slice(0,10)
    const newShift: ShiftRecord = {
      id: `${now}`,
      employeeId: selectedEmployee.id,
      start: now,
      dateKey,
    }
    setActiveShift(newShift)
  }

  function clockOut() {
    if (!activeShift) return
    const end = Date.now()
    const durationMs = end - activeShift.start
    const done: ShiftRecord = { ...activeShift, end, durationMs }
    setShifts(prev => [done, ...prev])
    setActiveShift(null)
  }

  const runningMs = activeShift ? Date.now() - activeShift.start : 0

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <motion.div variants={variants.fadeInUp} initial="hidden" animate="show" className="card-dark p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-cyan-200 mb-4">Employee Login</h2>
          <div className="grid sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-300">Select employee</label>
              <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="">Choose...</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300">PIN</label>
              <input type="password" value={pin} onChange={e=>setPin(e.target.value)} className={`mt-1 w-full bg-slate-800 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${loginError ? 'border-rose-500 animate-[shake_0.4s]' : 'border-slate-700 focus:ring-cyan-500'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleLogin} className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-transform active:scale-95">Login</button>
          </div>
        </motion.div>

        <div className="h-4" />

        <motion.div variants={variants.fadeInUp} initial="hidden" animate="show" className="card-dark p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-cyan-200 mb-4">Clock</h2>
          {activeShift ? (
            <div className="space-y-3">
              <p className="text-slate-300">Clocked in at: <span className="text-cyan-300 font-semibold">{new Date(activeShift.start).toLocaleTimeString()}</span></p>
              <div className="text-4xl sm:text-5xl font-mono text-emerald-300 drop-shadow">{formatHMS(runningMs)}</div>
              <button onClick={clockOut} className="mt-4 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md">Clock Out</button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-400">Not clocked in</p>
              <button disabled={!selectedEmployee || pin !== (selectedEmployee?.pin || '')} onClick={clockIn} className="mt-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-all shadow-md">Clock In</button>
            </div>
          )}
        </motion.div>

        <div className="h-4" />

        <motion.div variants={variants.fadeInUp} initial="hidden" animate="show" className="card-dark p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-cyan-200 mb-4">Shift History</h2>
          <div className="space-y-2">
            {shifts.length === 0 && <p className="text-slate-400">No records yet.</p>}
            {shifts.map(s => (
              <div key={s.id} className="flex justify-between items-center bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/60">
                <div className="text-slate-200">
                  <div className="text-sm">{new Date(s.start).toLocaleDateString()} • {new Date(s.start).toLocaleTimeString()} → {s.end ? new Date(s.end).toLocaleTimeString() : '-'}</div>
                </div>
                <div className="text-emerald-300 font-mono">{formatHMS(s.durationMs || 0)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
