'use client'

import { useEffect, useState } from 'react'
import ThemeToggle from './components/ThemeToggle'

type Produto = {
  id: number
  nome: string
  descricao: string
  preco: number | string
}

export default function Home() {
  const [produto, setProduto] = useState<Partial<Produto>>({})
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [erro, setErro] = useState<string | null>(null)
  useEffect(() => {
    obterProdutos().catch((error: unknown) => {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar produtos.')
    })
  }, [])

  // Repository-derived product CRUD flow.
  async function obterProdutos() {
    const resp = await fetch('http://localhost:3001/produtos')
    if (!resp.ok) {
      throw new Error(`Falha ao carregar produtos (${resp.status}).`)
    }

    const produtos = (await resp.json()) as Produto[]
    setProdutos(produtos)
  }

  async function criarProduto() {
    setErro(null)
    try {
      const resp = await fetch('http://localhost:3001/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      })
      if (!resp.ok) {
        throw new Error(`Falha ao criar produto (${resp.status}): ${await resp.text()}`)
      }

      await obterProdutos()
      setProduto({})
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao criar produto.')
    }
  }

  async function alterarProduto() {
    if (!produto.id) {
      setErro('Selecione um produto antes de alterar.')
      return
    }

    setErro(null)
    try {
      const resp = await fetch(`http://localhost:3001/produtos/${produto.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      })
      if (!resp.ok) {
        throw new Error(`Falha ao alterar produto (${resp.status}): ${await resp.text()}`)
      }

      await obterProdutos()
      setProduto({})
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao alterar produto.')
    }
  }

  async function obterProdutoPorId(id: number) {
    setErro(null)
    try {
      const resp = await fetch(`http://localhost:3001/produtos/${id}`)
      if (!resp.ok) {
        throw new Error(`Falha ao carregar produto (${resp.status}): ${await resp.text()}`)
      }

      const produto = (await resp.json()) as Produto
      setProduto(produto)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar produto.')
    }
  }

  async function excluirProduto(id: number) {
    setErro(null)
    try {
      const resp = await fetch(`http://localhost:3001/produtos/${id}`, {
        method: 'DELETE',
      })
      if (!resp.ok) {
        throw new Error(`Falha ao excluir produto (${resp.status}): ${await resp.text()}`)
      }

      if (produto.id === id) {
        setProduto({})
      }
      await obterProdutos()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao excluir produto.')
    }
  }

  function renderizarFormProduto() {
    return (
      <div className="flex gap-5 items-end">
        <div className="flex flex-col">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={produto.nome ?? ''}
            onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
            className="rounded-md bg-[var(--input)] p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            value={produto.descricao ?? ''}
            onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
            className="rounded-md bg-[var(--input)] p-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="preco">Preço</label>
          <input
            id="preco"
            type="number"
            value={produto.preco ?? ''}
            onChange={(e) => setProduto({ ...produto, preco: +e.target.value })}
            className="rounded-md bg-[var(--input)] p-2"
          />
        </div>
        <div>
          {produto.id ? (
            <button
              onClick={alterarProduto}
              className="bg-blue-500 px-4 py-2 rounded-md"
            >
              Alterar Produto
            </button>
          ) : (
            <button
              onClick={criarProduto}
              className="bg-blue-500 px-4 py-2 rounded-md"
            >
              Criar Produto
            </button>
          )}
        </div>
      </div>
    )
  }

  function renderizarProdutos() {
    return (
      <div className="flex flex-col gap-2">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="flex items-center gap-2 rounded-md bg-[var(--surface)] px-4 py-2"
          >
            <div className="flex-1">{produto.nome}</div>
            <div>{produto.preco}</div>
            <div className="flex gap-2">
              <button
                onClick={() => obterProdutoPorId(produto.id)}
                className="bg-green-500 p-2 rounded-md"
              >
                Alterar
              </button>
              <button
                onClick={() => excluirProduto(produto.id)}
                className="bg-red-500 p-2 rounded-md"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[var(--background)] text-[var(--foreground)]">
      {/* Aqui é coisa do tema */}
      <ThemeToggle />
      {renderizarFormProduto()}
      {erro && <p role="alert" className="text-red-500">{erro}</p>}
      {renderizarProdutos()}
    </div>
  )
}
