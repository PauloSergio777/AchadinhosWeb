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
        const linhas = texto.trim().split("\n");
        const cabecalhos = linhas[0].split(",");

        const dados = linhas.slice(1).map((linha) => {
          const valores = linha.split(",");
          const item = {};
          cabecalhos.forEach((coluna, i) => {
            item[coluna.trim()] = valores[i]?.trim();
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

  // Filtrar produtos pela busca
  const produtosFiltrados = produtos.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      {/* 🧭 Cabeçalho */}
      <header className="bg-blue-600 dark:bg-blue-700 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">🛍️ Achadinhos Web</h1>
          <p className="text-sm opacity-80 hidden sm:block">
            Os melhores achados da internet para você!
          </p>
        </div>
      </header>

      {/* 🔍 Busca e lista */}
      <main className="flex-grow max-w-6xl mx-auto p-6 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Produtos em destaque</h2>

          {/* Campo de busca com ícone */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Estado: Carregando */}
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-full w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-center mt-10 text-gray-600 dark:text-gray-400">
            Nenhum produto encontrado 😕
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {produtosFiltrados.map((produto, index) => (
              <div
                key={index}
                className="group border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all overflow-hidden"
              >
                {produto.imagem && (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1 line-clamp-1">
                    {produto.nome}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {produto.preco}
                  </p>
                  {produto.link && (
                    <a
                      href={produto.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition"
                    >
                      Ver produto
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ⚓ Rodapé */}
      <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4 mt-10 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} Achadinhos Web — Todos os direitos
        reservados.
      </footer>
    </div>
  );
}
