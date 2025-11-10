"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const url =
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vTSE0JrZSm3kklQ3AIQX8U-y2fA5v1zUSb_V_YsZbR3pjD6rxWvHLcLxjXoDgZJfY/pub?output=csv";
        const resposta = await fetch(url);
        const texto = await resposta.text();

        const linhas = texto.split("\n").slice(1);
        const lista = linhas
          .map((linha) => {
            const [id, nome, preco, imagem, link] = linha.split(",");
            return {
              id,
              nome: nome?.trim(),
              preco: preco?.replace(/["R$\s]/g, "").trim(),
              imagem: imagem?.trim(),
              link: link?.trim(),
            };
          })
          .filter((p) => p.nome && p.imagem);

        setProdutos(lista);
      } catch (e) {
        console.error("Erro ao carregar planilha:", e);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const produtosFiltrados = produtos.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#0f172a] text-gray-200 p-6">
      <header className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-blue-400">🛍️ Achadinhos da Web</h1>
        <span className="text-sm text-gray-400">Os melhores achados da internet para você!</span>
      </header>

      <div className="max-w-3xl mx-auto mb-10">
        <input
          type="text"
          placeholder="🔍 Buscar produto..."
          className="w-full p-3 rounded-xl bg-[#1e293b] text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando ? (
        <p className="text-center text-gray-400">Carregando produtos...</p>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produtosFiltrados.map((p) => (
            <div
              key={p.id}
              className="bg-[#1e293b] rounded-2xl shadow-md shadow-blue-900/40 p-4 flex flex-col justify-between hover:scale-105 transition-transform"
            >
              <img
                src={p.imagem}
                alt={p.nome}
                className="w-full h-48 object-contain rounded-lg mb-4 bg-[#0f172a]"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-100 mb-1 text-center">
                  {p.nome}
                </h2>
                <p className="text-center text-blue-400 font-medium mb-3">
                  R$ {p.preco?.replace(".", ",")}
                </p>
              </div>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-xl hover:opacity-90"
              >
                Ver produto
              </a>
            </div>
          ))}
        </section>
      )}

      <footer className="text-center text-gray-500 text-sm mt-12 border-t border-gray-700 pt-4">
        © 2025 Achadinhos Web — Todos os direitos reservados.
      </footer>
    </main>
  );
}
