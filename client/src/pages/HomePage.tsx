
import Hero from "@/components/Hero";
import About from "@/components/About";
import Books from "@/components/Books";
import Steps from "@/components/Steps";
import Features from "@/components/Features";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import { useState, useEffect } from 'react'
import api from '@/services/api'
import mockLivros from '@/data/mockData'
import { getImageUrl } from '@/utils/imageUtils'
import type { Book } from '@/types'

const HomePage = () => {
  const [latestBooks, setLatestBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  //const [currentSlide, setCurrentSlide] = useState(0)
  //const { signed } = useAuth()

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const response = await api.get('/books?page=1&limit=8')
        const apiBooks: Book[] = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.books)
          ? response.data.books
          : []

        const mockBooksMap = new Map<string | undefined, Book>(mockLivros.map((book) => [book.slug, book]))

        const finalBookList = apiBooks
          .map((apiBook) => {
            const mockVersion = mockBooksMap.get(apiBook.slug)
            if (mockVersion) {
              return {
                ...mockVersion,
                ...apiBook,
                cover_url: apiBook.cover_url || mockVersion?.cover_url,
                isPlaceholder: !apiBook.summary,
              }
            }
            return apiBook
          })
          .filter(Boolean) as Book[]

        if (finalBookList.length < 8) {
          const existingSlugs = new Set(finalBookList.map((b) => b.slug))
          const neededMocks = mockLivros
            .filter((b) => !existingSlugs.has(b.slug))
            .slice(0, 8 - finalBookList.length)
            .map((book) => ({ ...book, cover_url: getImageUrl(book) }))
          finalBookList.push(...neededMocks)
        }

        setLatestBooks(finalBookList.slice(0, 8))
      } catch (error) {
        console.error('Erro ao buscar os destaques, usando dados locais:', error)
        const formattedMockBooks = mockLivros.slice(0, 8).map((book) => ({
          ...book,
          cover_url: getImageUrl(book),
        }))
        setLatestBooks(formattedMockBooks)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestBooks()
  }, [])

  useEffect(() => {
    if (latestBooks.length > 0) {
      const timer = setInterval(() => {
        //setCurrentSlide((prevSlide) => (prevSlide + 1) % Math.min(latestBooks.length, 5))
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [latestBooks])

  return (
    <>
      <Hero />
      <About />
      <Steps />
      <Books loading={loading} latestBooks={latestBooks} />
      <Features />
      <Contact />
      <CTA />
    </>
  );
};

export default HomePage;