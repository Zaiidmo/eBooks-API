export class Book {
    book_id: string;
    title: string;
    author: string;
    category: string;
    quantity: number;
    cover: string;
    description: string;
    price: number;
    borrowedBy?: BorrowInfo[];
    createdAt: string;
    updatedAt: string;
}

export class BorrowInfo {
    user_id: string;
    borrow_date: string;
    dueDate: string;
}