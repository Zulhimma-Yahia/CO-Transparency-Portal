import React, { useEffect, useMemo, useState } from 'react'

function escapeInput(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const SAMPLE_DATA = [
  { id: 1, country: 'Germany', company: 'EnerTech GmbH', co2: 48.2 },
  { id: 2, country: 'USA', company: 'SkyCoal Inc.', co2: 412.1 },
  { id: 3, country: 'China', company: 'Beijing Power', co2: 980.4 },
  { id: 4, country: 'France', company: 'BlueNuke', co2: 12.9 },
  { id: 5, country: 'India', company: 'Ganga Energy', co2: 250.7 },
  { id: 6, country: 'Brazil', company: 'Amazon Renewables', co2: 33.0 },
]

export default function App() {
  const [data, setData] = useState(SAMPLE_DATA)
  const [countryFilter, setCountryFilter] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [sortField, setSortField] = useState('country')
  const [sortAsc, setSortAsc] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isRTL, setIsRTL] = useState(false)

  useEffect(() => {
    const rtlLangs = ['ar', 'he', 'fa', 'ur']
    const lang = (navigator.language || 'en').toLowerCase()
    setIsRTL(rtlLangs.some(r => lang.startsWith(r)))
    document.documentElement.dir = rtlLangs.some(r => lang.startsWith(r)) ? 'rtl' : 'ltr'
  }, [])

  const visible = useMemo(() => {
    const c = escapeInput(countryFilter).toLowerCase()
    const comp = escapeInput(companyFilter).toLowerCase()
    let out = data.filter(row => {
      const countryMatches = row.country.toLowerCase().includes(c)
      const compMatches = row.company.toLowerCase().includes(comp)
      return countryMatches && compMatches
    })

    out.sort((a, b) => {
      if (sortField === 'co2') {
        return sortAsc ? a.co2 - b.co2 : b.co2 - a.co2
      }
      const A = String(a[sortField]).toLowerCase()
      const B = String(b[sortField]).toLowerCase()
      if (A < B) return sortAsc ? -1 : 1
      if (A > B) return sortAsc ? 1 : -1
      return 0
    })
    return out
  }, [data, countryFilter, companyFilter, sortField, sortAsc])

  function toggleSort(field) {
    if (field === sortField) setSortAsc(s => !s)
    else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 shadow">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo192.png" alt="Logo" className="w-12 h-12 rounded bg-white p-1" />
            <div>
              <h1 className="text-2xl font-bold leading-tight">CO₂ Transparency Portal</h1>
              <div className="text-sm">Fiktive CO₂-Emissionsdaten — Demonstration</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="hover:underline">Home</a>
            <a href="#data" className="hover:underline">Daten</a>
            <a href="#about" className="hover:underline">Über</a>
            <a href="#contact" className="hover:underline">Kontakt</a>
          </nav>

          <div className="md:hidden">
            <button aria-label="Menü öffnen" onClick={() => setMenuOpen(o => !o)} className="bg-white/20 px-3 py-1 rounded">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden container mx-auto mt-2 bg-white/10 p-3 rounded">
            <a className="block py-1" href="#home">Home</a>
            <a className="block py-1" href="#data">Daten</a>
            <a className="block py-1" href="#about">Über</a>
            <a className="block py-1" href="#contact">Kontakt</a>
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className={`md:col-span-1 order-1 ${isRTL ? 'md:ml-4' : 'md:mr-4'}`}>
          <div className="bg-white shadow rounded p-4 sticky top-6">
            <h2 className="font-semibold mb-2">Navigation</h2>
            <ul className="space-y-2">
              <li><a href="#data" className="block">CO₂-Daten</a></li>
              <li><a href="#add" className="block">Daten hinzufügen</a></li>
              <li><a href="#method" className="block">Methodik</a></li>
            </ul>
          </div>
        </aside>

        <section className="md:col-span-3 order-2 bg-white shadow rounded p-4">
          <h2 id="data" className="text-xl font-bold mb-4">CO₂-Emissionsdaten (fiktiv)</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm">Filter: Land</label>
              <input
                aria-label="Filter Land"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="z. B. Germany"
              />
            </div>
            <div>
              <label className="block text-sm">Filter: Unternehmen</label>
              <input
                aria-label="Filter Unternehmen"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="z. B. EnerTech"
              />
            </div>
            <div>
              <label className="block text-sm">Sortieren nach</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="w-full border rounded p-2"
                aria-label="Sortierfeld"
              >
                <option value="country">Land</option>
                <option value="company">Unternehmen</option>
                <option value="co2">CO₂ (kt)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b cursor-pointer" onClick={() => toggleSort('country')}>Land</th>
                  <th className="text-left p-2 border-b cursor-pointer" onClick={() => toggleSort('company')}>Unternehmen</th>
                  <th className="text-right p-2 border-b cursor-pointer" onClick={() => toggleSort('co2')}>CO₂ (kt)</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{r.country}</td>
                    <td className="p-2 border-b">{r.company}</td>
                    <td className="p-2 border-b text-right">{r.co2.toFixed(1)}</td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">Keine Einträge gefunden.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <section id="add" className="mt-6">
            <h3 className="font-semibold mb-2">Daten hinzufügen (Beispielformular)</h3>
            <AddDataForm onAdd={(newRow) => setData((s) => [...s, { id: Date.now(), ...newRow }])} />
          </section>
        </section>
      </main>

      <footer className="bg-gray-100 text-gray-700 p-4">
        <div className="container mx-auto text-sm">
          <div>© {new Date().getFullYear()} CO₂ Transparency Portal — Beispielseite einer Non-Profit-Organisation</div>
          <div className="mt-1">Rechtliche Hinweise: Alle Daten sind fiktiv. Diese Webseite ist zu Demonstrationszwecken erstellt.</div>
        </div>
      </footer>
    </div>
  )
}

function AddDataForm({ onAdd }) {
  const [country, setCountry] = useState('')
  const [company, setCompany] = useState('')
  const [co2, setCo2] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const c = escapeInput(country).trim()
    const comp = escapeInput(company).trim()
    const num = Number(co2)
    if (!c || !comp || Number.isNaN(num)) {
      alert('Bitte gültige Werte eingeben: Land, Unternehmen und numerischer CO₂-Wert.')
      return
    }
    onAdd({ country: c, company: comp, co2: Number(num) })
    setCountry('')
    setCompany('')
    setCo2('')
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Land" className="border p-2 rounded" aria-label="Land" />
      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Unternehmen" className="border p-2 rounded" aria-label="Unternehmen" />
      <div className="flex gap-2">
        <input value={co2} onChange={(e) => setCo2(e.target.value)} placeholder="CO₂ in kt" className="border p-2 rounded flex-1" aria-label="CO2" />
        <button type="submit" className="bg-green-600 text-white rounded px-3">Hinzufügen</button>
      </div>
    </form>
  )
}
