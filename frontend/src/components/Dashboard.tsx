import { useEffect, useMemo, useState } from 'react'

export type StorageCategory = 'FRIDGE' | 'FREEZER' | 'DRY'

export type IngredientRow = {
  id: number
  name: string
  category: StorageCategory
  quantity: number
  unit: string
  expiryDate: string | null
}

const COLUMN_LABEL: Record<StorageCategory, string> = {
  FRIDGE: 'Refrigerated',
  FREEZER: 'Frozen',
  DRY: 'Dry Storage',
}

const COLUMN_ORDER: StorageCategory[] = ['FRIDGE', 'FREEZER', 'DRY']

const SAMPLE: IngredientRow[] = [
  { id: 1, name: 'Whole milk', category: 'FRIDGE', quantity: 1, unit: 'L', expiryDate: '2026-04-15' },
  { id: 2, name: 'Eggs', category: 'FRIDGE', quantity: 12, unit: 'each', expiryDate: '2026-04-10' },
  { id: 3, name: 'All-purpose flour', category: 'DRY', quantity: 2, unit: 'kg', expiryDate: null },
  { id: 4, name: 'Butter', category: 'FRIDGE', quantity: 250, unit: 'g', expiryDate: '2026-05-01' },
  { id: 5, name: 'Frozen peas', category: 'FREEZER', quantity: 500, unit: 'g', expiryDate: '2026-12-31' },
  { id: 6, name: 'Greek yogurt', category: 'FRIDGE', quantity: 4, unit: 'cups', expiryDate: '2026-04-02' },
  { id: 7, name: 'Cheddar cheese', category: 'FRIDGE', quantity: 400, unit: 'g', expiryDate: '2026-04-20' },
  { id: 8, name: 'Vanilla ice cream', category: 'FREEZER', quantity: 1, unit: 'L', expiryDate: '2026-08-01' },
  { id: 9, name: 'Frozen mixed berries', category: 'FREEZER', quantity: 400, unit: 'g', expiryDate: '2027-01-15' },
  { id: 10, name: 'Basmati rice', category: 'DRY', quantity: 1.5, unit: 'kg', expiryDate: null },
  { id: 11, name: 'Spaghetti', category: 'DRY', quantity: 500, unit: 'g', expiryDate: null },
  { id: 12, name: 'Olive oil', category: 'DRY', quantity: 750, unit: 'ml', expiryDate: '2026-11-30' },
]

function groupByCategory(rows: IngredientRow[]) {
  const map = new Map<StorageCategory, IngredientRow[]>()
  for (const cat of COLUMN_ORDER) {
    map.set(cat, [])
  }
  for (const row of rows) {
    map.get(row.category)?.push(row)
  }
  return map
}

export function Dashboard() {
  const [items, setItems] = useState<IngredientRow[]>(SAMPLE)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/inventory')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: IngredientRow[] = await res.json()
        if (!cancelled) {
          setItems(data)
          setLoadError(null)
        }
      } catch {
        if (!cancelled) {
          setItems(SAMPLE)
          setLoadError('Using sample data (start the API on :8080 to load live inventory).')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const grouped = useMemo(() => groupByCategory(items), [items])

  return (
    <section className="space-y-6">
      {loadError && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {loadError}
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        {COLUMN_ORDER.map((cat) => (
          <div
            key={cat}
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 shadow-lg shadow-black/20"
          >
            <div className="border-b border-slate-800 px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                {COLUMN_LABEL[cat]}
              </h2>
              <p className="text-xs text-slate-500">
                {grouped.get(cat)?.length ?? 0} item
                {(grouped.get(cat)?.length ?? 0) === 1 ? '' : 's'}
              </p>
            </div>
            <ul className="flex flex-1 flex-col gap-2 p-3">
              {(grouped.get(cat) ?? []).map((row) => (
                <li
                  key={row.id}
                  className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-100">{row.name}</span>
                    <span className="shrink-0 text-xs tabular-nums text-slate-400">
                      {row.quantity} {row.unit}
                    </span>
                  </div>
                  {row.expiryDate && (
                    <p className="mt-1 text-xs text-slate-500">
                      Expires {row.expiryDate}
                    </p>
                  )}
                </li>
              ))}
              {(grouped.get(cat) ?? []).length === 0 && (
                <li className="rounded-lg border border-dashed border-slate-800 px-3 py-6 text-center text-sm text-slate-500">
                  Nothing here yet.
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
