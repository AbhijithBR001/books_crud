"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Library,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { BookFormModal, type Book } from "@/components/book-form-modal";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import {
  BookCardSkeleton,
  StatsCardSkeleton,
  SearchFilterSkeleton,
} from "@/components/loading-skeleton";
import { useToast } from "@/hooks/use-toast";
import { useBooks } from "@/hooks/use-books";

export function BookDashboard() {
  const { books, isLoading, error, createBook, updateBook, deleteBook } =
    useBooks();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Get unique genres for filter dropdown
  const genres = Array.from(new Set(books.map((book) => book.genre)));

  // Filter books based on search and filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "all" || book.genre === selectedGenre;
    const matchesStatus =
      selectedStatus === "all" || book.status === selectedStatus;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  const handleAddBook = () => {
    setModalMode("add");
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setModalMode("edit");
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);
    try {
      await deleteBook(bookToDelete.id!);
      toast({
        title: "Book Deleted",
        description: `"${bookToDelete.title}" has been successfully removed from your library.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleSubmitBook = async (data: Omit<Book, "id">) => {
    try {
      if (modalMode === "add") {
        await createBook(data);
      } else if (editingBook) {
        await updateBook(editingBook.id!, data);
      }
    } catch (error) {
      // Error handling is done in the modal component
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border-border max-w-md w-full mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground font-[family-name:var(--font-montserrat)] mb-2">
              Failed to Load Books
            </h3>
            <p className="text-muted-foreground text-center font-[family-name:var(--font-open-sans)] mb-4">
              There was an error loading your book collection. Please try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-[family-name:var(--font-open-sans)]"
            >
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Library className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-montserrat)]">
                  Book Management
                </h1>
                <p className="text-sm text-muted-foreground font-[family-name:var(--font-open-sans)]">
                  Manage your library collection
                </p>
              </div>
            </div>
            <Button
              onClick={handleAddBook}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-[family-name:var(--font-open-sans)]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Book
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards - Show skeletons while loading */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground font-[family-name:var(--font-open-sans)]">
                    Total Books
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground font-[family-name:var(--font-montserrat)]">
                    {books.length}
                  </div>
                  <p className="text-xs text-muted-foreground font-[family-name:var(--font-open-sans)]">
                    Books in collection
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground font-[family-name:var(--font-open-sans)]">
                    Available
                  </CardTitle>
                  <div className="h-4 w-4 bg-green-500 rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground font-[family-name:var(--font-montserrat)]">
                    {books.filter((book) => book.status === "Available").length}
                  </div>
                  <p className="text-xs text-muted-foreground font-[family-name:var(--font-open-sans)]">
                    Ready to borrow
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground font-[family-name:var(--font-open-sans)]">
                    Issued
                  </CardTitle>
                  <div className="h-4 w-4 bg-accent rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground font-[family-name:var(--font-montserrat)]">
                    {books.filter((book) => book.status === "Issued").length}
                  </div>
                  <p className="text-xs text-muted-foreground font-[family-name:var(--font-open-sans)]">
                    Currently borrowed
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Search and Filters - Show skeleton while loading */}
        {isLoading ? (
          <SearchFilterSkeleton />
        ) : (
          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground font-[family-name:var(--font-montserrat)]">
                Search & Filter Books
              </CardTitle>
              <CardDescription className="text-muted-foreground font-[family-name:var(--font-open-sans)]">
                Find books by title, author, genre, or status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground font-[family-name:var(--font-open-sans)]"
                  />
                </div>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-full md:w-48 bg-input border-border text-foreground font-[family-name:var(--font-open-sans)]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full md:w-48 bg-input border-border text-foreground font-[family-name:var(--font-open-sans)]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Issued">Issued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Books Grid - Show skeletons while loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))
            : filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  className="bg-card border-border hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-card-foreground font-[family-name:var(--font-montserrat)] text-balance">
                          {book.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground font-[family-name:var(--font-open-sans)] mt-1">
                          by {book.author}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          book.status === "Available" ? "default" : "secondary"
                        }
                        className={
                          book.status === "Available"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-accent text-accent-foreground"
                        }
                      >
                        {book.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-[family-name:var(--font-open-sans)]">
                          Genre:
                        </span>
                        <span className="text-card-foreground font-[family-name:var(--font-open-sans)]">
                          {book.genre}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-[family-name:var(--font-open-sans)]">
                          Published:
                        </span>
                        <span className="text-card-foreground font-[family-name:var(--font-open-sans)]">
                          {book.publishedYear}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBook(book)}
                        className="flex-1 font-[family-name:var(--font-open-sans)] bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBook(book)}
                        className="text-destructive hover:text-destructive font-[family-name:var(--font-open-sans)] bg-transparent"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {!isLoading && filteredBooks.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground font-[family-name:var(--font-montserrat)] mb-2">
                No books found
              </h3>
              <p className="text-muted-foreground text-center font-[family-name:var(--font-open-sans)]">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <BookFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitBook}
        book={editingBook}
        mode={modalMode}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        book={bookToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
