import Layout from '../components/Layout'
import { useEffect, useMemo, useState } from 'react'
import { KEYS, loadJSON, saveJSON } from '../utils/storage'

export default function ClosingStep2() {
  const [state, setState] = useState(() => loadJSON(KEYS.closing, { step: 2, values: {}, images: {} }))
  const v = state.values as any

  function setVal(key: string, val: any) {
    const next = { ...state, values: { ...state.values, [key]: val } }
    setState(next); saveJSON(KEYS.closing, next)
  }
  function setImg(key: string, dataUrl: string) {
    const next = { ...state, images: { ...state.images, [key]: dataUrl } }
    setState(next); saveJSON(KEYS.closing, next)
  }
  useEffect(() => { saveJSON(KEYS.closing, { ...state, step: 2 }) }, [])

  const nrsLottery = Number(v.nrsLottery || 0)
  const slipLottery = Number(v.slipLottery || 0)
  const lotteryDiff = slipLottery - nrsLottery

  const nrsScratch = Number(v.nrsScratch || 0)
  const price = Number(v.price || 0)
  const start = Number(v.start || 0)
  const end = Number(v.end || 0)
  const ticketsSold = Math.max(0, end - start)
  const scratchCalc = ticketsSold * price
  const scratchVariance = scratchCalc - nrsScratch

  function statusByDiff(d: number) {
    if (d === 0) return 'perfect'
    if (Math.abs(d) <= 5) return 'slight'
    return 'big'
  }

  const lotteryStatus = statusByDiff(lotteryDiff)
  const scratchStatus = statusByDiff(scratchVariance)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto card-dark p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-cyan-200 mb-4">Step 2 — Lottery & Scratch Match</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          <section>
            <h3 className="text-lg text-cyan-200 mb-2">Lottery</h3>
            <Field label="NRS lottery sales" value={v.nrsLottery||''} onChange={n=>setVal('nrsLottery', n)} />
            <Field label="Lottery slip sales" value={v.slipLottery||''} onChange={n=>setVal('slipLottery', n)} />
            <div className="mt-2">
              <StatusChip status={lotteryStatus} text={`Difference: ${lotteryDiff}`} />
            </div>
            <div className="mt-3">
              <Upload label="Upload lottery slip photo" onData={d=>setImg('lotterySlip', d)} existing={state.images.lotterySlip} />
            </div>
          </section>

          <section>
            <h3 className="text-lg text-cyan-200 mb-2">Scratch</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="NRS scratch sales" value={v.nrsScratch||''} onChange={n=>setVal('nrsScratch', n)} />
              <Field label="Ticket price" value={v.price||''} onChange={n=>setVal('price', n)} />
              <Field label="Starting ticket number" value={v.start||''} onChange={n=>setVal('start', n)} />
              <Field label="Ending ticket number" value={v.end||''} onChange={n=>setVal('end', n)} />
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-slate-300 text-sm">Tickets sold: <span className="text-cyan-300">{ticketsSold}</span></div>
              <div className="text-slate-300 text-sm">Calc: <span className="text-cyan-300">{ticketsSold} × {price} = {scratchCalc}</span></div>
              <StatusChip status={scratchStatus} text={`Variance: ${scratchVariance}`} />
            </div>
            <div className="mt-3">
              <Upload label="Upload scratch IN/OUT sheet photo" onData={d=>setImg('scratchSheet', d)} existing={state.images.scratchSheet} />
            </div>
          </section>
        </div>

        <div className="h-6" />
        <div className="flex items-center gap-3">
          <a href="/closing/step-1" className="px-4 py-2 rounded-lg bg-slate-700 text-white">Back</a>
          <a href="/closing/step-3" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white">Next</a>
        </div>
      </div>
    </Layout>
  )
}

function Field({ label, value, onChange }: { label: string; value: any; onChange: (v:number)=>void }) {
  return (
    <label className="text-sm text-slate-300 block">
      {label}
      <input type="number" value={value} onChange={e=>onChange(Number(e.target.value))} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2" />
    </label>
  )
}

function StatusChip({ status, text }: { status: 'perfect'|'slight'|'big'; text: string }) {
  const map = { perfect: 'badge-green glow-green', slight: 'badge-yellow', big: 'badge-red animate-[shake_0.4s]' }
  return <div className={`badge ${map[status]}`}>{text}</div>
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
