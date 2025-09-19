"use client"

import useSWR from "swr"
import { bookAPI } from "@/lib/api"
import type { Book } from "@/components/book-form-modal"

export function useBooks() {
  const {
    data: books,
    error,
    isLoading,
    mutate,
  } = useSWR<Book[]>("books", bookAPI.getAllBooks.bind(bookAPI), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  })

  const createBook = async (bookData: Omit<Book, "id">) => {
    try {
      const newBook = await bookAPI.createBook(bookData)
      mutate([...(books || []), newBook], false)
      return newBook
    } catch (error) {
      throw error
    }
  }

  const updateBook = async (id: number, bookData: Omit<Book, "id">) => {
    try {
      const updatedBook = await bookAPI.updateBook(id, bookData)
      mutate(books?.map((book) => (book.id === id ? updatedBook : book)) || [], false)
      return updatedBook
    } catch (error) {
      throw error
    }
  }

  const deleteBook = async (id: number) => {
    try {
      await bookAPI.deleteBook(id)
      mutate(books?.filter((book) => book.id !== id) || [], false)
    } catch (error) {
      throw error
    }
  }

  return {
    books: books || [],
    isLoading,
    error,
    createBook,
    updateBook,
    deleteBook,
    refetch: mutate,
  }
}
