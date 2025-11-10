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

        // ✅ Tratamento de CSV com aspas e vírgulas
        const linhas = texto
          .trim()
          .split("\n")
          .map((linha) => {
            const partes = [];
            let atual = "";
            let dentroDeAspas = false;

            for (let char of linha) {
              if (char === '"') {
                dentroDeAspas = !dentroDeAspas;
              } else if (char === "," && !dentroDeAspas) {
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

  // 🔍 Filtragem de produtos
  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Cabeçalho */}
      <header className="bg-blue-600 text-white py-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">🛍️ Achadinhos Web</h1>
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="px-3 py-2 rounded-lg text-gray-900 w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Produtos em destaque</h2>

        {carregando ? (
          <p className="text-center mt-10">Carregando produtos...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-center mt-10">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {produtosFiltrados.map((produto, index) => (
              <div
                key={index}
                className="border rounded-2xl shadow-md p-4 hover:shadow-xl transition bg-white"
              >
                {produto.imagem && (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-full h-48 object-cover rounded-xl"
                    onError={(e) => (e.target.style.display = "none")} // Evita quebra se imagem der erro
                  />
                )}
                <h2 className="text-lg font-semibold mt-3">{produto.nome}</h2>
                <p className="text-gray-700">{produto.preco}</p>
                {produto.link && (
                  <a
                    href={produto.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                  >
                    Ver produto
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-100 text-center py-4 mt-10 text-sm text-gray-600">
        © {new Date().getFullYear()} Achadinhos Web — Todos os direitos reservados.
      </footer>
    </div>
  );
}
