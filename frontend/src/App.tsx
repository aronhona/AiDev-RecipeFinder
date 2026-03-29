import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Pantry &amp; Recipe Manager
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Inventory by storage zone — refrigerated, frozen, and dry storage.
        </p>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Dashboard />
      </main>
    </div>
  )
}

export default App
