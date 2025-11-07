
import { useState, useMemo } from 'react'
import productsData from '../data/products.json'

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  const categories = useMemo(() => {
    const s = new Set(productsData.map(p => p.category))
    return ['Todos', ...Array.from(s)]
  }, [])

  const [products] = useState(productsData)

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory, products])

  return (
    <div className="min-h-screen bg-[#0f1115] text-white antialiased">
      <header className="sticky top-0 z-20 backdrop-blur-sm bg-black/30 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-black">AW</div>
            <div className="text-lg font-semibold">AchadinhosWeb</div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full rounded-xl bg-white/6 placeholder-white/60 px-4 py-2 outline-none"
              />
            </div>
          </div>

          <nav className="hidden md:flex gap-3 items-center">
            {categories.slice(0, 4).map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1 rounded-lg text-sm ${activeCategory === c ? 'bg-gradient-to-br from-teal-400 to-blue-500 text-black' : 'bg-transparent text-white/80'}`}
              >
                {c}
              </button>
            ))}
            <a href="/admin" className="px-3 py-1 rounded-lg text-sm bg-white/6">Admin</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <section className="mb-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${activeCategory === c ? 'bg-gradient-to-br from-teal-400 to-blue-500 text-black' : 'bg-white/6 text-white/80'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section>
          {filtered.length === 0 ? (
            <div className="text-center text-white/60 py-20">Nenhum produto encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <article key={p.id} className="bg-white/5 rounded-2xl overflow-hidden card-shadow hover:shadow-2xl transition-shadow duration-200">
                  <div className="w-full aspect-[4/3] bg-black/20">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                    <div className="text-teal-300 font-bold mb-3">R${p.price.toFixed(2)}</div>
                    <div className="flex items-center gap-3">
                      <a
                        href={p.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/8 hover:bg-gradient-to-br from-teal-400 to-blue-500 text-white/90 transition-all"
                      >
                        Comprar agora
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m6-9v9m2-13h.01" />
                        </svg>
                      </a>
                      <button onClick={() => alert('Favorito adicionado (demo)')} className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8">♥ Favoritar</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-10 text-center text-white/60 text-sm">
          Este site usa links de afiliados — podemos receber comissão por compras feitas através deles.
        </footer>
      </main>
    </div>
  )
}
