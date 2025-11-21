import Layout from '../components/Layout'
import { useEffect, useMemo, useState } from 'react'
import { KEYS, loadJSON, saveJSON } from '../utils/storage'

export default function ClosingStep1() {
  const [state, setState] = useState(() => loadJSON(KEYS.closing, { step: 1, values: {}, images: {} }))
  const values = state.values as any

  function setVal(key: string, v: any) {
    const next = { ...state, values: { ...state.values, [key]: v } }
    setState(next); saveJSON(KEYS.closing, next)
  }
  function setImg(key: string, dataUrl: string) {
    const next = { ...state, images: { ...state.images, [key]: dataUrl } }
    setState(next); saveJSON(KEYS.closing, next)
  }

  const cashLeft = Number(values.cashLeft || 0)
  const payouts = Number(values.payouts || 0)
  const nrsCash = Number(values.nrsCash || 0)
  const combined = cashLeft + payouts
  const diff = Math.abs(combined - nrsCash)

  const status = useMemo(() => {
    if (combined === nrsCash) return 'perfect'
    if (diff <= 2) return 'small'
    return 'mismatch'
  }, [combined, nrsCash, diff])

  useEffect(() => { saveJSON(KEYS.closing, { ...state, step: 1 }) }, [])

  return (
    <Layout>
      <div className="max-w-3xl mx-auto card-dark p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-cyan-200 mb-4">Step 1 — Cash + Payouts + NRS Match</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Cash left after leaving $500" value={values.cashLeft||''} onChange={v=>setVal('cashLeft', v)} />
          <Field label="Total lottery + scratch payouts (from slip)" value={values.payouts||''} onChange={v=>setVal('payouts', v)} />
          <Field label="Total cash on hand from NRS report" value={values.nrsCash||''} onChange={v=>setVal('nrsCash', v)} />
        </div>

        <div className="h-4" />
        <StatusBadge status={status} diff={diff} />

        <div className="h-6" />
        <Upload label="Upload NRS report photo" onData={data=>setImg('nrsReport', data)} existing={state.images.nrsReport} />

        <div className="h-6" />
        <a href="/closing/step-2" className={`px-4 py-2 rounded-lg text-white ${status==='mismatch' ? 'bg-slate-700 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'}`}>Next</a>
      </div>
    </Layout>
  )
}

function Field({ label, value, onChange }: { label: string; value: any; onChange: (v: number)=>void }) {
  return (
    <label className="text-sm text-slate-300">
      {label}
      <input type="number" value={value} onChange={e=>onChange(Number(e.target.value))} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2" />
    </label>
  )
}

function StatusBadge({ status, diff }: { status: 'perfect'|'small'|'mismatch'; diff: number }) {
  if (status==='perfect') return <div className="badge badge-green glow-green">Perfect Match ✓</div>
  if (status==='small') return <div className="badge badge-yellow">Small Difference (${diff.toFixed(2)})</div>
  return <div className="badge badge-red animate-[shake_0.4s]">Mismatch! Fix before next</div>
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
