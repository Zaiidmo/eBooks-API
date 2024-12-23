import { Injectable } from '@nestjs/common';
import { DynamoDBConfigService } from 'src/config/dynamodb.config';
import { Book, BorrowInfo } from './entities/book.entity';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

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

  //Update an existing book
  async update(bookId: string, updatedFields: Partial<Book>): Promise<void> {
    const UpdateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Build the update expression dynamically
    for (const [key, value] of Object.entries(updatedFields)) {
      if (value !== undefined) {
        UpdateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    }

    // If no fields to update, throw an error
    if (UpdateExpression.length === 0) {
      throw new Error('No fields provided for update.');
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { book_id: bookId },
      UpdateExpression: `SET ${UpdateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    try {
      await this.dynamoDBDocumentClient.send(new UpdateCommand(params));
    } catch (error) {
      console.error('Error updating book in DynamoDB:', error);
      throw new Error('Failed to update book in database.');
    }
  }
}
