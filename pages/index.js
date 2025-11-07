"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

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

        console.log("📦 Produtos carregados:", dados);
        setProdutos(dados);
      } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* 🧭 Cabeçalho fixo */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">
            🛍️ Achadinhos Web
          </h1>
          <p className="text-sm opacity-80">
            Os melhores achados da internet!
          </p>
        </div>
      </header>

      {/* 🔍 Conteúdo principal */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Produtos em destaque</h2>

        {carregando ? (
          <p className="text-center mt-10">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="text-center mt-10">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {produtos.map((produto, index) => (
              <div
                key={index}
                className="border rounded-2xl shadow-md p-4 hover:shadow-xl transition bg-white"
              >
                {produto.imagem && (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
                <h2 className="text-lg font-semibold mt-3">{produto.nome}</h2>
                <p className="text-gray-700">{produto.preco}</p>
                {produto.link && (
                  <a
                    href={produto.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-xl"
                  >
                    Ver produto
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ⚓ Rodapé simples */}
      <footer className="bg-gray-100 text-center py-4 mt-10 text-sm text-gray-600">
        © {new Date().getFullYear()} Achadinhos Web — Todos os direitos reservados.
      </footer>
    </div>
  );
}
