import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  //Create a new book
  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File, 
  ) {
    try {
      await this.booksService.createBook(createBookDto, file);
      return { message: 'Book created successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }

  //Update An Existing Book
  @Put(':id')
  async updateBook(
    @Param('id') bookId: string,
    @Body() updateBookDto: UpdateBookDto,
  ) : Promise<any>{
    try {
      await this.booksService.updateBook(bookId, updateBookDto);
      return { message: 'Book updated successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
