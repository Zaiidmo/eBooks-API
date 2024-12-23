import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksRepository } from './books.repository';
import { Book } from './entities/book.entity';
import { S3ConfigService } from 'src/services/s3.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BooksService {
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly s3Service: S3ConfigService,
  ) {}

  //Create a new books
  async createBook(
    createBookDto: CreateBookDto,
    file: Express.Multer.File,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('Cover image is required');
    }

    //Generate unique identifiers and timestamps
    const bookId = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    //Upload cover to S3 
    const key = `covers/${file.originalname}`;
    const coverUrl = await this.s3Service.uploadCover(file, key);

    //  Create a new book object
    const newBook: Book = {
      book_id: bookId,
      title: createBookDto.title,
      author: createBookDto.author,
      category: createBookDto.category,
      quantity: createBookDto.quantity,
      cover: coverUrl,
      description: createBookDto.description,
      price: createBookDto.price,
      borrowedBy: [],
      createdAt,
      updatedAt,
    };

    //Save to DynamoDB
    try {
    await this.booksRepository.create(newBook);
    } catch (error) {
      throw new BadRequestException('Failed to create book');
    }
  }
}
