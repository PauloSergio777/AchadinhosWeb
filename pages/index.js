"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1UCajn2wrJEid6fBVYehjW6p3tJX3WAUgB9UuymsvoB89d05HzHsVszqQUG8HyDtoHRs7WZCjT92L/pub?gid=0&single=true&output=csv"
        );
        const texto = await response.text();

        const linhas = texto
          .trim()
          .split("\n")
          .filter((l) => l.trim() !== "");

        const cabecalhos = linhas[0].split(",");
        const dados = linhas.slice(1).map((linha) => {
          // Divide a linha respeitando aspas duplas no CSV
          const valores = linha.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          const item = {};

          cabecalhos.forEach((coluna, i) => {
            item[coluna.trim()] = valores?.[i]?.replace(/^"|"$/g, "").trim();
          });
          return item;
        });

        setProdutos(dados);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Cabeçalho */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🛍️ Achadinhos Web
          </h1>
          <p className="text-sm opacity-80">
            Os melhores achados da internet!
          </p>
        </div>
      </header>

      {/* Campo de busca */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        <input
          type="text"
          placeholder="🔍 Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <h2 className="text-xl font-semibold mb-4">Produtos em destaque</h2>

        {carregando ? (
          <p className="text-center text-gray-500 mt-10">Carregando produtos...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Nenhum produto encontrado 😢
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtosFiltrados.map((produto, index) => {
              const precoBruto = produto.preco || "";
              const precoNum = precoBruto
                .replace(/[^\d,.-]/g, "")
                .replace(",", ".");
              const preco = isNaN(parseFloat(precoNum))
                ? "—"
                : parseFloat(precoNum).toFixed(2).replace(".", ",");

              const imagemUrl =
                produto.imagem && produto.imagem.startsWith("http")
                  ? produto.imagem
                  : "/no-image.png";

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 overflow-hidden flex flex-col"
                >
                  <img
                    src={imagemUrl}
                    alt={produto.nome || "Produto"}
                    onError={(e) => (e.target.src = "/no-image.png")}
                    className="w-full h-48 object-contain bg-gray-50"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">
                        {produto.nome || "Produto sem nome"}
                      </h3>
                      <p className="text-blue-600 font-semibold">
                        R$ {preco}
                      </p>
                    </div>
                    {produto.link && (
                      <a
                        href={produto.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Ver produto
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-100 text-center py-4 mt-10 text-sm text-gray-600 border-t">
        © {new Date().getFullYear()} Achadinhos Web — Todos os direitos reservados.
      </footer>
    </div>
  );
}
