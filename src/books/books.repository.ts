import { Injectable } from '@nestjs/common';
import { DynamoDBConfigService } from 'src/config/dynamodb.config';
import { Book, BorrowInfo } from './entities/book.entity';
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { S3ConfigService } from 'src/services/s3.service';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class BooksRepository {
  private readonly dynamoDBDocumentClient: DynamoDBDocumentClient;

  constructor(private readonly dynamoDBConfigService: DynamoDBConfigService) {
    this.dynamoDBDocumentClient = DynamoDBDocumentClient.from(
      this.dynamoDBConfigService.getClient(),
    );
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

  //Create a new Book
  async create(book: Book): Promise<void> {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: book,
    };

    try {
      await this.dynamoDBDocumentClient.send(new PutCommand(params));
    } catch (error) {
      console.error('Error creating book in DynamoDB:', error);
      throw new Error('Failed to create book in database.');
    }
  }
}
