import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'

const ComingSoonPage = () => {
  return (
    <DashboardLayout title="Module Preview" subtitle="Upcoming TransitOps workspace">
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <div className="rounded-full bg-emerald-100 p-4 text-emerald-600">
          <ArrowLeft size={24} />
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-slate-900">Coming Soon</h2>
        <p className="mt-3 max-w-xl text-base leading-8 text-slate-500">
          This module is part of the future TransitOps expansion roadmap. The frontend architecture is ready for it now.
        </p>
        <Link to="/dashboard" className="mt-8 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
          Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  )
}

export default ComingSoonPage
