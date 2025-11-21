import Layout from '../components/Layout'
import { useEffect, useMemo, useState } from 'react'
import { KEYS, loadJSON, saveJSON } from '../utils/storage'

export default function ClosingStep3() {
  const [state, setState] = useState(() => loadJSON(KEYS.closing, { step: 3, values: {}, images: {} }))
  const v = state.values as any

  function setVal(key: string, val: any) {
    const next = { ...state, values: { ...state.values, [key]: val } }
    setState(next); saveJSON(KEYS.closing, next)
  }
  function setImg(key: string, dataUrl: string) {
    const next = { ...state, images: { ...state.images, [key]: dataUrl } }
    setState(next); saveJSON(KEYS.closing, next)
  }
  useEffect(() => { saveJSON(KEYS.closing, { ...state, step: 3 }) }, [])

  const start = Number(v.machineStart || 0)
  const payouts = Number(v.machinePayouts || 0)
  const registerCash = Number(v.registerCash || (state.values.cashLeft || 0))
  const machineRegister = start - payouts + registerCash

  return (
    <Layout>
      <div className="max-w-3xl mx-auto card-dark p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-cyan-200 mb-4">Step 3 — Machine Register</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Machine cash in morning" value={v.machineStart||''} onChange={n=>setVal('machineStart', n)} />
          <Field label="Total machine payouts today" value={v.machinePayouts||''} onChange={n=>setVal('machinePayouts', n)} />
          <Field label="Register cash going into machines" value={registerCash} onChange={n=>setVal('registerCash', n)} />
        </div>

        <div className="h-4" />
        <div className="rounded-xl bg-slate-900/70 border border-slate-700/60 p-4 text-center text-slate-200">
          <div className="text-sm opacity-80">Machine register</div>
          <div className="text-2xl sm:text-3xl font-semibold text-emerald-300">
            {start} − {payouts} + {registerCash} = {machineRegister}
          </div>
        </div>

        <div className="h-6" />
        <Upload label="Upload machine screen photo" onData={d=>setImg('machinePhoto', d)} existing={state.images.machinePhoto} />

        <div className="h-6" />
        <div className="flex items-center gap-3">
          <a href="/closing/step-2" className="px-4 py-2 rounded-lg bg-slate-700 text-white">Back</a>
          <a href="/closing/summary" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white">Next</a>
        </div>
      </div>
    </Layout>
  )
}

function Field({ label, value, onChange }: { label: string; value: any; onChange: (v:number)=>void }) {
  return (
    <label className="text-sm text-slate-300">
      {label}
      <input type="number" value={value} onChange={e=>onChange(Number(e.target.value))} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2" />
    </label>
  )
}

function Upload({ label, onData, existing }: { label: string; onData: (d:string)=>void; existing?: string }) {
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onData(reader.result as string)
    reader.readAsDataURL(file)
  }
  return (
    <div>
      <p className="text-sm text-slate-300 mb-1">{label}</p>
      <input type="file" accept="image/*" onChange={onFile} className="text-slate-200" />
      {existing && <img src={existing} alt="upload" className="mt-3 max-h-40 rounded-lg border border-slate-700" />}
    </div>
  )
}
