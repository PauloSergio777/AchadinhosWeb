"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1UCajn2wrJEid6fBVYehjW6p3tJX3WAUgB9UuymsvoB89d05HzHsVszqQUG8HyDtoHRs7WZCjT92L/pub?gid=0&single=true&output=csv"
        );
        const texto = await response.text();

        // ✅ Parser CSV robusto (mantém vírgulas dentro de aspas)
        const linhas = texto
          .trim()
          .split("\n")
          .map((linha) => {
            const partes = [];
            let atual = "";
            let dentroDeAspas = false;

            for (let char of linha) {
              if (char === '"') dentroDeAspas = !dentroDeAspas;
              else if (char === "," && !dentroDeAspas) {
                partes.push(atual);
                atual = "";
              } else {
                atual += char;
              }
            }
            partes.push(atual);
            return partes;
          });

        const cabecalhos = linhas[0].map((h) => h.trim());
        const dados = linhas.slice(1).map((linha) => {
          const item = {};
          cabecalhos.forEach((coluna, i) => {
            item[coluna] = linha[i]?.trim().replace(/^"|"$/g, "");
          });
          return item;
        });

        setProdutos(dados);
      } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col">
      {/* 🧭 Cabeçalho fixo e minimalista */}
      <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-20 shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-blue-600">
            🛍️ Achadinhos Web
          </h1>

          {/* 🔍 Campo de busca com animação */}
          <div className="relative w-full sm:w-auto flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white 
              transition-all duration-300 placeholder:text-gray-400"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔎</span>
          </div>
        </div>
      </header>

      {/* 🧱 Conteúdo principal */}
      <main className="flex-1 max-w-6xl mx-auto p-6 w-full">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">
          Produtos em destaque
        </h2>

        {carregando ? (
          <p className="text-center mt-20 text-gray-500 animate-pulse">
            Carregando produtos...
          </p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-center mt-20 text-gray-500">
            Nenhum produto encontrado 😕
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtosFiltrados.map((produto, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm 
                hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 
                flex flex-col overflow-hidden"
              >
                {produto.imagem && (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-full h-48 object-cover rounded-t-2xl transition-all duration-500 hover:scale-105"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">
                    {produto.nome}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {produto.preco}
                  </p>
                  <div className="mt-auto">
                    {produto.link && (
                      <a
                        href={produto.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-center w-full bg-blue-600 
                        hover:bg-blue-700 text-white py-2 rounded-xl transition-all duration-300"
                      >
                        Ver produto
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ⚓ Rodapé clean */}
      <footer className="bg-white border-t border-gray-200 text-center py-4 text-sm text-gray-600 mt-10">
        © {new Date().getFullYear()} Achadinhos Web — Todos os direitos
        reservados.
      </footer>
    </div>
  );
}
