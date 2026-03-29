import { useCallback, useEffect, useMemo, useState } from 'react'

/** Proxied by Vite to http://localhost:8080 — use relative paths in dev to avoid CORS. */
const API = '/api'

type Category = 'FRIDGE' | 'FREEZER' | 'DRY'

type IngredientRow = {
  id: number
  name: string
  category: Category
  quantity: number
  unit: string
  expiryDate: string | null
}

type SuggestedRecipe = {
  id: number
  name: string
  requiredIngredientNames: string[]
}

const ZONES: {
  key: Category
  title: string
  card: string
  header: string
  accent: string
}[] = [
  {
    key: 'FREEZER',
    title: 'Freezer',
    card: 'border-blue-500/35 bg-gradient-to-b from-blue-950/50 to-slate-950/80 ring-1 ring-blue-500/20',
    header: 'border-blue-500/30 bg-blue-950/60 text-blue-100',
    accent: 'text-blue-300/90',
  },
  {
    key: 'FRIDGE',
    title: 'Fridge',
    card: 'border-emerald-500/35 bg-gradient-to-b from-emerald-950/50 to-slate-950/80 ring-1 ring-emerald-500/20',
    header: 'border-emerald-500/30 bg-emerald-950/60 text-emerald-100',
    accent: 'text-emerald-300/90',
  },
  {
    key: 'DRY',
    title: 'Dry Storage',
    card: 'border-amber-500/35 bg-gradient-to-b from-amber-950/40 to-slate-950/80 ring-1 ring-amber-500/20',
    header: 'border-amber-500/30 bg-amber-950/60 text-amber-100',
    accent: 'text-amber-300/90',
  },
]

function groupByZone(rows: IngredientRow[]) {
  const m = new Map<Category, IngredientRow[]>()
  for (const z of ZONES) m.set(z.key, [])
  for (const r of rows) m.get(r.category)?.push(r)
  return m
}

function inventoryNameSet(rows: IngredientRow[]) {
  return new Set(rows.map((i) => i.name.toLowerCase().trim()))
}

/** Best = highest coverage of required ingredients; ties favor more items matched, then recipe name. */
function pickBestRecipe(
  recipes: SuggestedRecipe[],
  inventory: IngredientRow[],
): SuggestedRecipe | null {
  if (recipes.length === 0) return null
  const inv = inventoryNameSet(inventory)
  let best: SuggestedRecipe | null = null
  let bestScore = -1
  let bestMatched = -1
  for (const r of recipes) {
    const req = r.requiredIngredientNames
    if (req.length === 0) continue
    const matched = req.filter((n) => inv.has(n.toLowerCase().trim())).length
    const score = matched / req.length
    const better =
      score > bestScore ||
      (Math.abs(score - bestScore) < 1e-9 &&
        (matched > bestMatched ||
          (matched === bestMatched &&
            best !== null &&
            r.name.localeCompare(best.name) < 0)))
    if (better) {
      bestScore = score
      bestMatched = matched
      best = r
    }
  }
  return best
}

export default function App() {
  const [items, setItems] = useState<IngredientRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [magicError, setMagicError] = useState<string | null>(null)
  const [bestRecipe, setBestRecipe] = useState<SuggestedRecipe | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${API}/inventory`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: IngredientRow[] = await res.json()
        if (!cancelled) {
          setItems(data)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load inventory')
          setItems([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const grouped = useMemo(() => groupByZone(items), [items])

  const onMagicRecipe = useCallback(async () => {
    setMagicLoading(true)
    setMagicError(null)
    setBestRecipe(null)
    try {
      const res = await fetch(`${API}/recipes/suggested`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: SuggestedRecipe[] = await res.json()
      const best = pickBestRecipe(data, items)
      setBestRecipe(best)
      setModalOpen(true)
      if (!best) {
        setMagicError(
          data.length === 0
            ? 'No suggested recipes from the server.'
            : 'No recipe suggestions match your pantry yet.',
        )
      }
    } catch (e) {
      setMagicError(e instanceof Error ? e.message : 'Could not load suggestions')
      setModalOpen(true)
    } finally {
      setMagicLoading(false)
    }
  }, [items])

  const invNames = useMemo(() => inventoryNameSet(items), [items])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-900/90 px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Pantry Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Live from{' '}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                http://localhost:8080/api/inventory
              </code>{' '}
              via Vite proxy
            </p>
          </div>
          <button
            type="button"
            onClick={onMagicRecipe}
            disabled={magicLoading || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {magicLoading ? (
              <span>✨ Finding…</span>
            ) : (
              <>
                <span aria-hidden>✨</span>
                Magic Recipe
              </>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {loading && (
          <p className="mb-6 text-sm text-slate-400">Loading pantry…</p>
        )}
        {error && (
          <p className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          {ZONES.map((zone) => (
            <section
              key={zone.key}
              className={`flex flex-col overflow-hidden rounded-2xl border ${zone.card}`}
            >
              <div
                className={`flex items-center gap-2 border-b px-4 py-3 ${zone.header}`}
              >
                <span className="text-xl" aria-hidden>
                  {zone.key === 'FREEZER' ? '🧊' : zone.key === 'FRIDGE' ? '🥦' : '🧺'}
                </span>
                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  {zone.title}
                </h2>
              </div>
              <ul className="flex flex-1 flex-col gap-1 p-3">
                {(grouped.get(zone.key) ?? []).map((row) => (
                  <li
                    key={row.id}
                    className="rounded-lg border border-white/5 bg-black/20 px-3 py-2.5 text-sm"
                  >
                    <div className="flex justify-between gap-2">
                      <span className="font-medium text-slate-50">{row.name}</span>
                      <span className={`shrink-0 tabular-nums ${zone.accent}`}>
                        {row.quantity} {row.unit}
                      </span>
                    </div>
                    {row.expiryDate && (
                      <p className="mt-1 text-xs text-slate-500">
                        Exp. {row.expiryDate}
                      </p>
                    )}
                  </li>
                ))}
                {(grouped.get(zone.key) ?? []).length === 0 && !loading && (
                  <li className="py-8 text-center text-sm text-slate-500">
                    Empty
                  </li>
                )}
              </ul>
            </section>
          ))}
        </div>
      </main>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="magic-recipe-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3
              id="magic-recipe-title"
              className="text-lg font-semibold text-white"
            >
              Magic recipe match
            </h3>
            {magicError && (
              <p className="mt-3 text-sm text-amber-200">{magicError}</p>
            )}
            {bestRecipe && (
              <div className="mt-4 space-y-3">
                <p className="text-xl font-medium text-violet-200">
                  {bestRecipe.name}
                </p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Ingredients
                </p>
                <ul className="space-y-2">
                  {bestRecipe.requiredIngredientNames.map((name) => {
                    const have = invNames.has(name.toLowerCase().trim())
                    return (
                      <li
                        key={name}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                          have
                            ? 'bg-emerald-950/50 text-emerald-100'
                            : 'bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <span>{name}</span>
                        <span className="text-xs font-medium">
                          {have ? 'In pantry' : 'Missing'}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setModalOpen(false)
                setMagicError(null)
              }}
              className="mt-6 w-full rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
