import { useState, useEffect } from 'react'
import api from '../services/api'
import mockLivros from '../data/mockData'
import BookCard from '../components/BookCard'
import type { Book } from '../types'

const CategoriesPage = () => {
  const [allBooks, setAllBooks] = useState<Book[]>(mockLivros)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    api.get('/books')
      .then((response) => {
        if (!response.data || !Array.isArray(response.data)) {
          console.error('Resposta da API inválida.')
          return
        }

        const apiBooks: Book[] = response.data
        const apiBooksMap = new Map(apiBooks.map((book) => [book.slug, book]))
        const mockBooksMap = new Map(mockLivros.map((book) => [book.slug, book]))
        const allSlugs = new Set([...apiBooksMap.keys(), ...mockBooksMap.keys()])

        const finalBookList = Array.from(allSlugs).map((slug) => {
          const apiVersion = apiBooksMap.get(slug)
          const mockVersion = mockBooksMap.get(slug)

          if (apiVersion && mockVersion) {
            return {
              ...mockVersion,
              ...apiVersion,
              isPlaceholder: !apiVersion.summary,
            }
          }

          if (apiVersion) {
            return {
              ...apiVersion,
              isPlaceholder: !apiVersion.summary,
            }
          }

          return {
            ...mockVersion,
            isPlaceholder: true,
          } as Book
        })

        setAllBooks(finalBookList)
      })
      .catch((err) => {
        console.error('Erro ao buscar livros da API, usando dados locais:', err)
        setAllBooks(mockLivros)
      })
  }, [])

  const allCategories = [
    'Todos',
    ...new Set(
      allBooks
        .map((book) => book.category)
        .filter((category): category is string => Boolean(category))
    )
  ]
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const categoryFilteredBooks = selectedCategory === 'Todos' ? allBooks : allBooks.filter((book) => book.category === selectedCategory)
  const filteredBooks = normalizedSearch
    ? categoryFilteredBooks.filter((book) =>
        book.title.toLowerCase().includes(normalizedSearch) ||
        book.author.toLowerCase().includes(normalizedSearch) ||
        book.category?.toLowerCase().includes(normalizedSearch)
      )
    : categoryFilteredBooks

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/95 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">Navegue por Categoria</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Filtre livros por temas e descubra novos favoritos.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {allCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === selectedCategory ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <label htmlFor="search" className="sr-only">Buscar livros</label>
        <input
          id="search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Buscar por título, autor ou categoria"
          className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
        />
      </div>

      {filteredBooks.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          <p>Nenhum livro encontrado para essa busca.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((livro) => (
            <BookCard key={livro.slug || livro.id} livro={livro} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
