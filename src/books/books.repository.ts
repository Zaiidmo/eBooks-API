import { Injectable } from '@nestjs/common';
import { DynamoDBConfigService } from 'src/config/dynamodb.config';
import { Book, BorrowInfo } from './entities/book.entity';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ReturnValue, TableAlreadyExistsException } from '@aws-sdk/client-dynamodb';

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
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { book_id: bookId }, // Specify the key for the item
      UpdateExpression: '',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ReturnValues: ReturnValue.ALL_NEW,
    };

    // Build UpdateExpression, ExpressionAttributeNames, and ExpressionAttributeValues dynamically
    const updateExpressions: string[] = [];
    for (const [key, value] of Object.entries(updatedFields)) {
      if (key === 'book_id') continue; // Skip updating the primary key
      const attributePlaceholder = `#${key}`;
      const valuePlaceholder = `:${key}`;
      updateExpressions.push(`${attributePlaceholder} = ${valuePlaceholder}`);
      params.ExpressionAttributeNames[attributePlaceholder] = key;
      params.ExpressionAttributeValues[valuePlaceholder] = value;
    }

    if (updateExpressions.length === 0) {
      throw new Error('No updatable fields provided.');
    }
  
    params.UpdateExpression = `SET ${updateExpressions.join(', ')}`;
  
    try {
      const result = await this.dynamoDBDocumentClient.send(
        new UpdateCommand(params)
      );
      console.log('Book updated successfully:', result);
    } catch (error) {
      console.error('Error updating book in DynamoDB:', error);
      throw new Error('Failed to update book in database.');
    }
  }

  //Delete a book by ID
  async delete(bookId: string): Promise<any> {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { book_id: bookId },
      ConditionExpression: 'attribute_exists(book_id)',
    };
    try {
      await this.dynamoDBDocumentClient.send(new DeleteCommand(params));
      return { message: 'Book deleted successfully' };
    } catch (error) {
      console.error('Error deleting book from DynamoDB:', error);
      throw new Error('Failed to delete book from database.');
    }
  }

  //Get a single book by ID
  async findById(bookId: string): Promise<Book> {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { book_id: bookId },
    };
    try {
      const result = await this.dynamoDBDocumentClient.send(
        new GetCommand(params),
      );
      return result.Item as Book | undefined;
    } catch (error) {
      console.error('Error fetching book from DynamoDB:', error);
      throw new Error('Failed to fetch book from database.');
    }
  }

}