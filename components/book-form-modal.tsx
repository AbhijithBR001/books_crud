"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  author: z.string().min(1, "Author is required").max(100, "Author must be less than 100 characters"),
  genre: z.string().min(1, "Genre is required"),
  publishedYear: z
    .number()
    .min(1000, "Year must be at least 1000")
    .max(new Date().getFullYear(), `Year cannot be greater than ${new Date().getFullYear()}`),
  status: z.enum(["Available", "Issued"], {
    required_error: "Status is required",
  }),
})

type BookFormData = z.infer<typeof bookSchema>

export interface Book {
  id?: number
  title: string
  author: string
  genre: string
  publishedYear: number
  status: "Available" | "Issued"
}

interface BookFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BookFormData) => void
  book?: Book | null
  mode: "add" | "edit"
}

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Classic Literature",
  "Dystopian Fiction",
  "Coming-of-age",
  "Adventure",
  "Thriller",
  "Horror",
  "Poetry",
  "Drama",
  "Comedy",
]

export function BookFormModal({ isOpen, onClose, onSubmit, book, mode }: BookFormModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      genre: book?.genre || "",
      publishedYear: book?.publishedYear || new Date().getFullYear(),
      status: book?.status || "Available",
    },
  })

  const handleSubmit = async (data: BookFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      toast({
        title: mode === "add" ? "Book Added" : "Book Updated",
        description: `"${data.title}" has been ${mode === "add" ? "added to" : "updated in"} your library.`,
      })
      form.reset()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} book. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-card-foreground font-[family-name:var(--font-montserrat)]">
            {mode === "add" ? "Add New Book" : "Edit Book"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-[family-name:var(--font-open-sans)]">
            {mode === "add"
              ? "Fill in the details to add a new book to your library."
              : "Update the book information below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground font-[family-name:var(--font-open-sans)] font-medium">
                      Title *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter book title"
                        {...field}
                        className="bg-input border-border text-foreground font-[family-name:var(--font-open-sans)]"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground font-[family-name:var(--font-open-sans)] font-medium">
                      Author *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter author name"
                        {...field}
                        className="bg-input border-border text-foreground font-[family-name:var(--font-open-sans)]"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground font-[family-name:var(--font-open-sans)] font-medium">
                        Genre *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border text-foreground font-[family-name:var(--font-open-sans)]">
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-card-foreground font-[family-name:var(--font-open-sans)] font-medium">
                        Published Year *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2024"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                          className="bg-input border-border text-foreground font-[family-name:var(--font-open-sans)]"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground font-[family-name:var(--font-open-sans)] font-medium">
                      Status *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border text-foreground font-[family-name:var(--font-open-sans)]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Issued">Issued</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="font-[family-name:var(--font-open-sans)] bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-[family-name:var(--font-open-sans)]"
              >
                {isSubmitting ? "Saving..." : mode === "add" ? "Add Book" : "Update Book"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
