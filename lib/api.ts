import type { Book } from "@/components/book-form-modal"

// Mock API base URL - in a real app, this would be from environment variables
const API_BASE_URL = "https://crudcrud.com/api/YOUR_API_KEY"

// For demo purposes, we'll use a mock API that simulates the crudcrud.com behavior
// In production, replace this with your actual crudcrud.com API key

export interface ApiBook extends Omit<Book, "id"> {
  _id?: string
}

export interface CreateBookData extends Omit<Book, "id"> {}

export interface UpdateBookData extends Omit<Book, "id"> {}

class BookAPI {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async getAllBooks(): Promise<Book[]> {
    try {
      // const response = await fetch(`${this.baseUrl}/books`)
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // const data: ApiBook[] = await response.json()
      // return data.map(book => ({ ...book, id: book._id }))

      // Mock data simulation with delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockBooks: Book[] = [
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          genre: "Classic Literature",
          publishedYear: 1925,
          status: "Available",
        },
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genre: "Fiction",
          publishedYear: 1960,
          status: "Issued",
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          genre: "Dystopian Fiction",
          publishedYear: 1949,
          status: "Available",
        },
        {
          id: 4,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          genre: "Romance",
          publishedYear: 1813,
          status: "Available",
        },
        {
          id: 5,
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          genre: "Coming-of-age",
          publishedYear: 1951,
          status: "Issued",
        },
        {
          id: 6,
          title: "Lord of the Flies",
          author: "William Golding",
          genre: "Adventure",
          publishedYear: 1954,
          status: "Available",
        },
      ]

      return mockBooks
    } catch (error) {
      console.error("Error fetching books:", error)
      throw new Error("Failed to fetch books")
    }
  }

  async createBook(bookData: CreateBookData): Promise<Book> {
    try {
      // const response = await fetch(`${this.baseUrl}/books`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(bookData),
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // const data: ApiBook = await response.json()
      // return { ...data, id: data._id }

      // Mock API simulation with delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newBook: Book = {
        ...bookData,
        id: Date.now(), // Simple ID generation for demo
      }

      return newBook
    } catch (error) {
      console.error("Error creating book:", error)
      throw new Error("Failed to create book")
    }
  }

  async updateBook(id: number, bookData: UpdateBookData): Promise<Book> {
    try {
      // const response = await fetch(`${this.baseUrl}/books/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(bookData),
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // const data: ApiBook = await response.json()
      // return { ...data, id: data._id }
   
      await new Promise((resolve) => setTimeout(resolve, 800))

      const updatedBook: Book = {
        ...bookData,
        id,
      }

      return updatedBook
    } catch (error) {
      console.error("Error updating book:", error)
      throw new Error("Failed to update book")
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      // const response = await fetch(`${this.baseUrl}/books/${id}`, {
      //   method: 'DELETE',
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return
    } catch (error) {
      console.error("Error deleting book:", error)
      throw new Error("Failed to delete book")
    }
  }
}

export const bookAPI = new BookAPI()
