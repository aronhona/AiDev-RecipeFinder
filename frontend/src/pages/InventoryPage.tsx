import { useEffect, useMemo, useState } from 'react'

type Category = 'FRIDGE' | 'FREEZER' | 'DRY'

type IngredientRow = {
  id: number
  name: string
  category: Category
  quantity: number
  unit: string
  expiryDate: string | null
}

const ZONES: { key: Category; title: string }[] = [
  { key: 'FRIDGE', title: 'Fridge' },
  { key: 'FREEZER', title: 'Freezer' },
  { key: 'DRY', title: 'Dry' },
]

function group(rows: IngredientRow[]) {
  const m = new Map<Category, IngredientRow[]>()
  for (const z of ZONES) m.set(z.key, [])
  for (const r of rows) m.get(r.category)?.push(r)
  return m
}

export function InventoryPage() {
  const [items, setItems] = useState<IngredientRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/inventory')
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

  const grouped = useMemo(() => group(items), [items])

  return (
    <div className="space-y-4">
      {loading && <p className="text-sm text-slate-400">Loading inventory…</p>}
      {error && (
        <p className="rounded border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {ZONES.map(({ key, title }) => (
          <section
            key={key}
            className="rounded-lg border border-slate-800 bg-slate-900/60"
          >
            <h2 className="border-b border-slate-800 px-3 py-2 text-sm font-medium text-slate-200">
              {title}
            </h2>
            <ul className="divide-y divide-slate-800/80 p-2">
              {(grouped.get(key) ?? []).map((row) => (
                <li key={row.id} className="py-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-100">{row.name}</span>
                    <span className="shrink-0 text-slate-500">
                      {row.quantity} {row.unit}
                    </span>
                  </div>
                </li>
              ))}
              {(grouped.get(key) ?? []).length === 0 && !loading && (
                <li className="py-6 text-center text-slate-500">No items</li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
