import { Injectable } from '@nestjs/common';
import { DynamoDBConfigService } from 'src/config/dynamodb.config';
import { Book, BorrowInfo } from './entities/book.entity';
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Service } from 'src/services/s3.service';

@Injectable()
export class BooksRepository {
  private readonly tableName = process.env.DYNAMODB_TABLE_NAME || 'books';

  constructor(
    private readonly dynamoDBConfigService: DynamoDBConfigService,
    private readonly s3Service: S3Service,
  ) {}

  private getClient() {
    return this.dynamoDBConfigService.getClient();
  }

  //Helper function to map DynamoDB response to Book entity
  private mapToBook(item: any): Book {
    return {
      book_id: item.book_id.S,
      title: item.title.S,
      author: item.author.S,
      category: item.category.S,
      quantity: parseInt(item.quantity.N, 10),
      cover: item.cover.S,
      description: item.description.S,
      price: parseFloat(item.price.N),
      borrowedBy: item.borrowedBy ? this.mapBorrowInfo(item.borrowedBy.L) : [],
      createdAt: item.createdAt.S,
      updatedAt: item.updatedAt.S,
    };
  }

  //Helper function to map DynamoDB response to BorrowInfo entity
  private mapBorrowInfo(borrowInfoList: any[]): BorrowInfo[] {
    return borrowInfoList.map((borrowInfoItem) => ({
      user_id: borrowInfoItem.M.user_id.S,
      borrow_date: borrowInfoItem.M.borrow_date.S,
      dueDate: borrowInfoItem.M.dueDate.S,
    }));
  }

  // Helper function to map Book object to DynamoDB Item
  private mapBookToDynamoDBItem(book: Book): any {
    return {
      book_id: { S: book.book_id },
      title: { S: book.title },
      author: { S: book.author },
      category: { S: book.category },
      quantity: { N: book.quantity.toString() },
      cover: { S: book.cover },
      description: { S: book.description },
      price: { N: book.price.toString() },
      borrowedBy: book.borrowedBy
        ? {
            L: book.borrowedBy.map((borrow) =>
              this.mapBorrowInfoToDynamoDB(borrow),
            ),
          }
        : { L: [] },
      createdAt: { S: book.createdAt },
      updatedAt: { S: book.updatedAt },
    };
  }

  // Helper function to map BorrowInfo object to DynamoDB Item
  private mapBorrowInfoToDynamoDB(borrow: BorrowInfo): any {
    return {
      M: {
        user_id: { S: borrow.user_id },
        borrow_date: { S: borrow.borrow_date },
        dueDate: { S: borrow.dueDate },
      },
    };
  }

  // Find a single book by its ID
  async function(book_id: string): Promise<Book> {
    const client = this.getClient();
    const params = {
      TableName: this.tableName,
      Key: {
        book_id: { S: book_id },
      },
    };

    const { Item } = await client.send(new GetItemCommand(params));
    return Item ? this.mapToBook(Item) : null;
  }

  //Create a new Book
  async create(book: Book, coverFilePath: string): Promise<Book> {
    const client = this.getClient();

    //Upload  the cover image to S3 and get the URL
    const coverUrl = await this.s3Service.uploadCover(coverFilePath, process.env.S3_BUCKET_NAME);

    //Set the URL in the book object 
    book.cover = coverUrl;

    //Prepare DynamoDB parameters for book creation 
    const params = {
        TableName: this.tableName,
        Item: this.mapBookToDynamoDBItem(book),
    }

    await client.send(new PutItemCommand(params));
    return book;
  }
}
