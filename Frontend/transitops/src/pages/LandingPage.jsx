import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, BellRing, Fuel, Route, ShieldCheck, Truck, Wrench } from 'lucide-react'

const features = [
  { title: 'Fleet Management', description: 'Track vehicles, utilization, and health in one command center.', icon: Truck },
  { title: 'Smart Dispatch', description: 'Coordinate jobs, assignments, and trip plans with precision.', icon: Route },
  { title: 'Driver Compliance', description: 'Monitor licenses, incidents, and safety readiness in real time.', icon: ShieldCheck },
  { title: 'Maintenance Tracking', description: 'Prevent downtime with proactive service and inspection logging.', icon: Wrench },
  { title: 'Expense Management', description: 'Keep fuel, repairs, and cost visibility organized and auditable.', icon: Fuel },
  { title: 'Operational Analytics', description: 'Use live metrics to optimize performance and fleet efficiency.', icon: BarChart3 },
]

const stats = [
  { value: '98.7%', label: 'Dispatch accuracy' },
  { value: '24/7', label: 'Operational visibility' },
  { value: '3.4x', label: 'Faster response planning' },
]

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/15 p-2 text-emerald-400">
            <Truck size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-wide text-white">TransitOps</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Smart Transport Operations</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#platform" className="transition hover:text-white">Platform</a>
          <a href="#about" className="transition hover:text-white">About</a>
          <Link to="/login" className="rounded-full border border-slate-700 px-4 py-2 text-white transition hover:border-emerald-400 hover:text-emerald-300">Login</Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
              <BellRing size={16} />
              Fleet intelligence for modern transport operators
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Command every trip, vehicle, and dispatch from one intelligent platform.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              TransitOps brings together fleet visibility, operational control, and compliance management for transport teams that need speed, safety, and clarity at scale.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-400">
                Get Started <ArrowRight size={18} />
              </Link>
              <a href="#platform" className="rounded-full border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500">
                Explore Platform
              </a>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl shadow-emerald-950/40">
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-6">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">Live operations snapshot</p>
              <div className="mt-6 space-y-4">
                {[
                  ['Active Fleet', '148 Vehicles'],
                  ['On-time Dispatch', '94%'],
                  ['Compliance Health', 'Excellent'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className="font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Fleet utilization</p>
                  <p className="text-sm font-semibold text-emerald-400">+12.4%</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div className="h-2 w-[84%] rounded-full bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Platform capabilities</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Everything transport teams need to move faster and smarter.</h2>
          </div>
          <div id="features" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm transition hover:border-emerald-500/40 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Why TransitOps</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Designed for modern logistics teams that value precision and control.</h2>
              </div>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-400">
                Start Your Demo <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/80 px-6 py-8 text-sm text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TransitOps. Built for future-ready fleet operations.</p>
          <p>Secure • Scalable • API-ready</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
