import axios from "axios";

export default async function handler(req, res) {
  const sheetId = "1AbCDEfgHIJK123xyz"; // ← coloque aqui o ID da sua planilha
  const sheetName = "ProdutosSite"; // nome da aba da planilha
  const url = 'https://docs.google.com/spreadsheets/d/1ZRQZJvHMGOvqmiE032TC2BtYNFUrxieppCd6jVc_lJc/edit?usp=sharing';

  try {
    const response = await axios.get(url);
    const data = JSON.parse(response.data.substr(47).slice(0, -2));
    const produtos = data.table.rows.map(row => ({
      id: row.c[0]?.v,
      nome: row.c[1]?.v,
      preco: row.c[2]?.v,
      imagem: row.c[3]?.v,
      link: row.c[4]?.v
    }));
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar produtos" });
  }
}
