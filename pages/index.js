"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const carregarCSV = async () => {
      try {
const response = await fetch(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1UCajn2wrJEid6fBVYehjW6p3tJX3WAUgB9UuymsvoB89d05HzHsVszqQUG8HyDtoHRs7WZCjT92L/pub?gid=0&single=true&output=csv"
);        const texto = await response.text();

        const linhas = texto.split("\n").slice(1);
        const produtosProcessados = linhas
          .map((linha) => {
            const colunas = linha.split(",");
            if (colunas.length < 4) return null;

            const [nome, preco, imagem, link] = colunas;

            return {
              nome: nome?.trim(),
              preco: preco?.trim(),
              imagem: imagem?.trim(),
              link: link?.trim(),
            };
          })
          .filter(Boolean);

        setProdutos(produtosProcessados);
      } catch (error) {
        console.error("Erro ao carregar CSV:", error);
      }
    };

    carregarCSV();
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span role="img" aria-label="bolsa">
              🛍️
            </span>
            Achadinhos Web
          </h1>
          <p className="text-sm text-blue-100">Os melhores achados da internet!</p>
        </div>
      </header>

      {/* Campo de busca */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <input
          type="text"
          placeholder="🔍 Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </section>

      {/* Lista de produtos */}
      <section className="flex-1 max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Produtos em destaque
        </h2>

        {produtosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum produto encontrado 😢</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {produtosFiltrados.map((produto, index) => {
              const imageUrl = produto.imagem
                ? produto.imagem.trim().replace("http://", "https://")
                : "/no-image.png";

              const preco = produto.preco
                ? parseFloat(produto.preco.replace(",", ".")).toFixed(2)
                : "0.00";

              return (
                <div
                  key={index}
                  className="bg-white shadow-sm hover:shadow-lg transition rounded-2xl p-4 flex flex-col items-center border border-gray-100"
                >
                  <img
                    src={imageUrl}
                    alt={produto.nome}
                    className="w-full h-48 object-contain rounded-lg mb-3"
                    onError={(e) => (e.target.src = "/no-image.png")}
                  />
                  <h3 className="text-base font-semibold text-gray-800 text-center">
                    {produto.nome}
                  </h3>
                  <p className="text-blue-600 font-semibold mt-1">
                    R$ {preco.replace(".", ",")}
                  </p>
                  <a
                    href={produto.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Ver produto
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Rodapé */}
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500 border-t">
        © 2025 <strong>Achadinhos Web</strong> — Todos os direitos reservados.
      </footer>
    </main>
  );
}
