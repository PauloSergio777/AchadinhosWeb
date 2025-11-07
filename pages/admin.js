
import { useEffect, useState } from 'react'
import initialData from '../data/products.json'
// Small helper to get/save localStorage
const STORAGE_KEY = 'achadinhos_products'

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialData
    return JSON.parse(raw)
  } catch (e) {
    return initialData
  }
}

export default function Admin() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', price: '', image: '', category: '', affiliateUrl: '' })

  useEffect(() => {
    setProducts(loadProducts())
  }, [])

  useEffect(() => {
    // save whenever products changes
    if (products.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  function startEdit(p) {
    setEditing(p.id)
    setForm({ title: p.title, price: p.price, image: p.image, category: p.category, affiliateUrl: p.affiliateUrl })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditing(null)
    setForm({ title: '', price: '', image: '', category: '', affiliateUrl: '' })
  }

  function saveNew() {
    const item = { id: ('id_'+Date.now()+'_'+Math.floor(Math.random()*10000)), ...form, price: parseFloat(form.price || 0) }
    const next = [item, ...products]
    setProducts(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    resetForm()
  }

  function saveEdit() {
    const next = products.map(p => p.id === editing ? { ...p, ...form, price: parseFloat(form.price || 0) } : p)
    setProducts(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    resetForm()
  }

  function remove(id) {
    if (!confirm('Excluir produto?')) return
    const next = products.filter(p => p.id !== id)
    setProducts(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-black">AW</div>
          <h1 className="text-2xl font-bold">Painel Admin — AchadinhosWeb</h1>
        </header>

        <section className="bg-white/5 rounded-xl p-4 mb-6">
          <h2 className="font-semibold mb-2">Adicionar / Editar produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Título" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="p-2 rounded bg-white/6" />
            <input placeholder="Preço" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="p-2 rounded bg-white/6" />
            <input placeholder="URL da imagem" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="p-2 rounded bg-white/6" />
            <input placeholder="Categoria" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="p-2 rounded bg-white/6" />
            <input placeholder="Link de afiliado" value={form.affiliateUrl} onChange={e => setForm({...form, affiliateUrl: e.target.value})} className="p-2 rounded bg-white/6 col-span-1 md:col-span-2" />
          </div>

          <div className="flex gap-2 mt-3">
            {editing ? (
              <>
                <button onClick={saveEdit} className="px-4 py-2 rounded bg-teal-400 text-black font-semibold">Salvar alteração</button>
                <button onClick={resetForm} className="px-4 py-2 rounded bg-white/6">Cancelar</button>
              </>
            ) : (
              <button onClick={saveNew} className="px-4 py-2 rounded bg-teal-400 text-black font-semibold">Adicionar produto</button>
            )}
          </div>
        </section>

        <section>
          <h3 className="font-semibold mb-3">Produtos cadastrados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
                <img src={p.image} alt={p.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-white/70">R${p.price.toFixed(2)} — {p.category}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => startEdit(p)} className="px-3 py-1 rounded bg-white/6">Editar</button>
                    <button onClick={() => remove(p.id)} className="px-3 py-1 rounded bg-red-600 text-black">Excluir</button>
                    <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded bg-white/6">Abrir</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
