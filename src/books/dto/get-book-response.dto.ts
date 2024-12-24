// For users who borrowed the book, we only expose minimal info
export class PublicBorrowInfoDto {
    borrow_date: string;
    dueDate: string;
  }
  
  // Base DTO for public book information
  export class GetBookResponseDto {
    title: string;
    author: string;
    category: string;
    quantity: number;
    cover: string;
    description: string;
    price: number;
    activeBorrows?: PublicBorrowInfoDto[];
  }
  
  // For getting multiple books
  export class GetBooksResponseDto {
    books: GetBookResponseDto[];
    totalBooks: number;
  }
  