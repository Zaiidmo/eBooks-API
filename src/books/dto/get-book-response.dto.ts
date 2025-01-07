// For users who borrowed the book, we only expose minimal info
export class Borrower {
  userId: string;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

// Base DTO for public book information
export class GetBookResponseDto {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  borrowedBy: Borrower[];
  quantity: number;
  cover: string;
  description: string;
  price: number;
}

// For getting multiple books
export class GetBooksResponseDto {
  books: GetBookResponseDto[];
  totalBooks: number;
}
