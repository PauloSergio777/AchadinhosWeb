"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1UCajn2wrJEid6fBVYehjW6p3tJX3WAUgB9UuymsvoB89d05HzHsVszqQUG8HyDtoHRs7WZCjT92L/pub?output=csv"
        );
        const data = await response.text();

        const linhas = data.split("\n").slice(1);
        const produtosFormatados = linhas
          .map((linha) => {
            const colunas = linha.split(",");
            return {
              id: colunas[0],
              nome: colunas[1],
              preco: colunas[2],
              imagem: colunas[3],
              link: colunas[4]?.trim(),
            };
          })
          .filter((p) => p.nome && p.link);

        setProdutos(produtosFormatados);
      } catch (error) {
        console.error("Erro ao buscar planilha:", error);
      } finally {
        setCarregando(false);
      }
    }

    fetchData();
  }, []);

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#0b1622] text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        🛍️ Achadinhos da Web
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Os melhores achados da internet para você!
      </p>

      <input
        type="text"
        placeholder="🔎 Buscar produto..."
        className="w-full max-w-2xl p-3 rounded-xl bg-[#101d2c] border border-gray-700 text-gray-200 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {carregando
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#111c2a] rounded-2xl shadow-lg p-4"
              >
                <div className="bg-gray-700 h-48 w-full rounded-xl mb-4 shimmer" />
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-10 bg-gray-700 rounded-xl w-full" />
              </div>
            ))
          : produtosFiltrados.map((produto) => (
              <div
                key={produto.id}
                className="bg-[#101d2c] rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-blue-500/20"
              >
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-48 object-cover bg-gray-900"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x300?text=Imagem+Indisponível")
                  }
                />
                <div className="p-5 text-center">
                  <h2 className="text-lg font-semibold mb-1">{produto.nome}</h2>
                  <p className="text-blue-400 font-semibold mb-4">
                    {produto.preco}
                  </p>
                  <a
                    href={produto.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 transition-colors"
                  >
                    Ver produto
                  </a>
                </div>
              </div>
            ))}
      </div>

      <footer className="mt-16 text-gray-500 text-sm border-t border-gray-800 pt-4 w-full text-center">
        © 2025 Achadinhos Web — Todos os direitos reservados.
      </footer>

      <style jsx global>{`
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        .shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          width: 150%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          100% {
            left: 150%;
          }
        }
      `}</style>
    </main>
  );
}
