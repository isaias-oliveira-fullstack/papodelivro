
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
//import { getImageUrl } from '@/utils/imageUtils'
import type { Book } from '@/types'

const HomePage = () => {
  const [latestBooks, setLatestBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  //const [currentSlide, setCurrentSlide] = useState(0)
  //const { signed } = useAuth()

  useEffect(() => {
  const fetchLatestBooks = async () => {
    try {
      const response = await api.get("/books?page=1&limit=8");

      const apiBooks: Book[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.books)
        ? response.data.books
        : [];

      const finalBookList = apiBooks.map((apiBook) => {
        return {
          ...apiBook,
          // 👇 fallback simples (SEM função externa)
          cover_url: apiBook.cover_url || "",
          isPlaceholder: !apiBook.summary,
        };
      });

      setLatestBooks(finalBookList.slice(0, 8));
    } catch (error) {
      console.error("Erro ao buscar os destaques:", error);

      // fallback mock SEM transformação
      setLatestBooks(mockLivros.slice(0, 8));
    } finally {
      setLoading(false);
    }
  };

  fetchLatestBooks();
}, []);

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