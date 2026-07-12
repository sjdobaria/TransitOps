import { ArrowUpRight } from 'lucide-react'

const toneClasses = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  sky: 'border-sky-200 bg-sky-50 text-sky-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
}

const MetricCard = ({ label, value, change, icon: Icon, tone = 'emerald' }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl border p-2 ${toneClasses[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
          <ArrowUpRight size={14} /> {change}
        </span>
        <span>vs. previous period</span>
      </div>
    </div>
  )
}

export default MetricCard
