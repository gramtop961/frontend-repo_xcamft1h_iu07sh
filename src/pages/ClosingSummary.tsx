import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { KEYS, loadJSON } from '../utils/storage'
import jsPDF from 'jspdf'

export default function ClosingSummary() {
  const [state] = useState<any>(() => loadJSON(KEYS.closing, { step: 4, values: {}, images: {}, meta: {} }))

  const v = state.values || {}
  const images = state.images || {}

  useEffect(() => {
    // Ensure step persisted
    const next = { ...state, step: 4 }
    localStorage.setItem(KEYS.closing, JSON.stringify(next))
  }, [])

  function downloadPDF() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    let y = 40
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text("Closing Report", 40, y)
    y += 24
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const dateStr = new Date().toLocaleString()
    doc.text(`Date: ${dateStr}`, 40, y); y += 18
    if (state.meta?.employeeName) { doc.text(`Employee: ${state.meta.employeeName}`, 40, y); y += 18 }

    doc.setFont('helvetica', 'bold'); doc.text('Step 1 — Cash/Payout/NRS', 40, y); y += 16
    doc.setFont('helvetica', 'normal')
    doc.text(`Cash Left: ${v.cashLeft||0}`, 60, y); y += 14
    doc.text(`Payouts: ${v.payouts||0}`, 60, y); y += 14
    doc.text(`NRS Cash: ${v.nrsCash||0}`, 60, y); y += 14

    doc.setFont('helvetica', 'bold'); doc.text('Step 2 — Lottery & Scratch', 40, y); y += 16
    doc.setFont('helvetica', 'normal')
    doc.text(`Lottery NRS: ${v.nrsLottery||0}`, 60, y); y += 14
    doc.text(`Lottery Slip: ${v.slipLottery||0}`, 60, y); y += 14
    doc.text(`Scratch NRS: ${v.nrsScratch||0}`, 60, y); y += 14
    doc.text(`Ticket Price: ${v.price||0}`, 60, y); y += 14
    doc.text(`Range: ${v.start||0} → ${v.end||0}`, 60, y); y += 14

    doc.setFont('helvetica', 'bold'); doc.text('Step 3 — Machine Register', 40, y); y += 16
    doc.setFont('helvetica', 'normal')
    const start = Number(v.machineStart||0), po = Number(v.machinePayouts||0), rc = Number(v.registerCash||0)
    doc.text(`Equation: ${start} - ${po} + ${rc} = ${start - po + rc}`, 60, y); y += 18

    // Images (scaled)
    const maxWidth = 500
    const imgBlocks = [
      { key: 'nrsReport', title: 'NRS Report' },
      { key: 'lotterySlip', title: 'Lottery Slip' },
      { key: 'scratchSheet', title: 'Scratch Sheet' },
      { key: 'machinePhoto', title: 'Machine Screen' },
    ]
    for (const b of imgBlocks) {
      const data = images[b.key]
      if (!data) continue
      y += 10
      doc.setFont('helvetica','bold'); doc.text(b.title, 40, y); y += 10
      try {
        // addImage auto scales if width/height provided; we do a basic height
        doc.addImage(data, 'JPEG', 40, y, maxWidth, 0)
        y += 220
      } catch (e) {
        doc.setFont('helvetica','normal'); doc.text('[Image failed to embed]', 40, y); y += 14
      }
    }

    // Signature
    y += 20
    doc.setDrawColor(200)
    doc.line(40, y, 340, y)
    y += 14
    doc.text('Signature', 40, y)

    const file = `closing-report-${new Date().toISOString().slice(0,10).replace(/-/g,'')}.pdf`
    doc.save(file)
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto card-dark p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-cyan-200 mb-4">Step 4 — Summary + PDF Export</h2>

        <div className="space-y-2 text-slate-200">
          <p>Date/Time: {new Date().toLocaleString()}</p>
          <p>Cash Left: {v.cashLeft||0} • Payouts: {v.payouts||0} • NRS Cash: {v.nrsCash||0}</p>
          <p>Lottery NRS vs Slip: {(v.nrsLottery||0)} vs {(v.slipLottery||0)}</p>
          <p>Scratch variance calc with price {v.price||0} from {v.start||0} → {v.end||0}</p>
          <p>Machine: start {v.machineStart||0} − payouts {v.machinePayouts||0} + register {v.registerCash||0}</p>
        </div>

        <div className="h-4" />
        <div className="grid sm:grid-cols-2 gap-3">
          {images.nrsReport && <img src={images.nrsReport} className="rounded-lg border border-slate-700" />}
          {images.lotterySlip && <img src={images.lotterySlip} className="rounded-lg border border-slate-700" />}
          {images.scratchSheet && <img src={images.scratchSheet} className="rounded-lg border border-slate-700" />}
          {images.machinePhoto && <img src={images.machinePhoto} className="rounded-lg border border-slate-700" />}
        </div>

        <div className="h-6" />
        <button onClick={downloadPDF} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">Download PDF</button>
      </div>
    </Layout>
  )
}
