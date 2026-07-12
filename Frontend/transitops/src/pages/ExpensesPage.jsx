// import { useMemo, useState } from 'react'
// import { ReceiptText, Plus, Search } from 'lucide-react'
// import { useOperations } from '../contexts/OperationsContext'

// const initialForm = {
//   type: 'Toll',
//   date: '',
//   amount: '',
//   description: '',
// }

// const ExpensesPage = () => {
//   const { expenses, addExpense } = useOperations()
//   const [form, setForm] = useState(initialForm)
//   const [search, setSearch] = useState('')

//   const filteredExpenses = useMemo(() => {
//     return expenses.filter((entry) => {
//       const term = search.toLowerCase()
//       return [entry.type, entry.description, entry.date].some((value) => value.toLowerCase().includes(term))
//     })
//   }, [expenses, search])

//   const handleSubmit = (event) => {
//     event.preventDefault()
//     addExpense({
//       ...form,
//       amount: Number(form.amount),
//     })
//     setForm(initialForm)
//   }

//   return (
//     <div className="space-y-8">
//       <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-600">Financial control</p>
//             <h1 className="mt-2 text-3xl font-semibold text-slate-900">Expenses</h1>
//             <p className="mt-3 max-w-2xl text-sm text-slate-600">Capture operating expenses by category and stay on top of spending.</p>
//           </div>
//           <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
//             <ReceiptText size={28} />
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-slate-900">Expense history</h2>
//             <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
//               <Search size={16} />
//               <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-32 bg-transparent outline-none" placeholder="Search" />
//             </div>
//           </div>
//           <div className="overflow-hidden rounded-2xl border border-slate-200">
//             <table className="min-w-full divide-y divide-slate-200 text-sm">
//               <thead className="bg-slate-50 text-left text-slate-600">
//                 <tr>
//                   <th className="px-4 py-3 font-medium">Type</th>
//                   <th className="px-4 py-3 font-medium">Date</th>
//                   <th className="px-4 py-3 font-medium">Amount</th>
//                   <th className="px-4 py-3 font-medium">Description</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200 bg-white">
//                 {filteredExpenses.map((entry) => (
//                   <tr key={entry.id} className="hover:bg-slate-50">
//                     <td className="px-4 py-3 font-medium text-slate-900">{entry.type}</td>
//                     <td className="px-4 py-3 text-slate-600">{entry.date}</td>
//                     <td className="px-4 py-3 text-slate-600">${entry.amount.toFixed(2)}</td>
//                     <td className="px-4 py-3 text-slate-600">{entry.description}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-4 flex items-center gap-3">
//             <div className="rounded-2xl bg-slate-100 p-2 text-slate-600">
//               <Plus size={18} />
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold text-slate-900">Record expense</h2>
//               <p className="text-sm text-slate-600">Capture any non-fuel operating cost.</p>
//             </div>
//           </div>

//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <label className="block text-sm text-slate-700">
//               <span className="mb-1.5 block font-medium">Category</span>
//               <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none">
//                 <option>Toll</option>
//                 <option>Maintenance</option>
//                 <option>Miscellaneous</option>
//               </select>
//             </label>

//             <label className="block text-sm text-slate-700">
//               <span className="mb-1.5 block font-medium">Date</span>
//               <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required />
//             </label>

//             <label className="block text-sm text-slate-700">
//               <span className="mb-1.5 block font-medium">Amount</span>
//               <input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required />
//             </label>

//             <label className="block text-sm text-slate-700">
//               <span className="mb-1.5 block font-medium">Description</span>
//               <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Provide details" required />
//             </label>

//             <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">Save expense</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ExpensesPage


import { useMemo, useState } from 'react'
import { ReceiptText, Plus, Search } from 'lucide-react'
import { useOperations } from '../contexts/OperationsContext'
import DashboardLayout from '../layouts/DashboardLayout'

const initialForm = {
  type: 'Toll',
  date: '',
  amount: '',
  description: '',
}

const ExpensesPage = () => {
  const { expenses, addExpense } = useOperations()
  const [form, setForm] = useState(initialForm)
  const [search, setSearch] = useState('')

  const filteredExpenses = useMemo(() => {
    const term = search.toLowerCase()

    return expenses.filter((entry) =>
      [entry.type, entry.description, entry.date].some((value) =>
        String(value).toLowerCase().includes(term)
      )
    )
  }, [expenses, search])

  const handleSubmit = (event) => {
    event.preventDefault()

    addExpense({
      ...form,
      amount: Number(form.amount),
    })

    setForm(initialForm)
  }

  return (
    <DashboardLayout
      title="Expense Management"
      subtitle="Track operational expenses"
    >
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-600">
                Financial Control
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Expenses
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-600">
                Capture operating expenses by category and stay on top of spending.
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
              <ReceiptText size={28} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Expense history
              </h2>

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
                <Search size={16} />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-32 bg-transparent outline-none"
                  placeholder="Search"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredExpenses.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {entry.type}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {entry.date}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        ${Number(entry.amount).toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {entry.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-2 text-slate-600">
                <Plus size={18} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Record expense
                </h2>

                <p className="text-sm text-slate-600">
                  Capture any non-fuel operating cost.
                </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Category</span>

                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm({ ...form, type: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                >
                  <option>Toll</option>
                  <option>Maintenance</option>
                  <option>Miscellaneous</option>
                </select>
              </label>

              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Date</span>

                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  required
                />
              </label>

              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Amount</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    setForm({ ...form, amount: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  required
                />
              </label>

              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Description</span>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  placeholder="Provide details"
                  required
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Save expense
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ExpensesPage