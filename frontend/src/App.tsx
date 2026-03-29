import { InventoryPage } from './pages/InventoryPage'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <h1 className="text-xl font-semibold text-white">Pantry</h1>
        <p className="mt-1 text-sm text-slate-400">
          Ingredients from <code className="text-slate-300">/api/inventory</code>
        </p>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <InventoryPage />
      </main>
    </div>
  )
}

export default App
