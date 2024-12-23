import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { BookCategory } from "../entities/book.entity";

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsEnum(BookCategory)
    category: BookCategory;

    @IsNotEmpty()
    @IsString()
    cover: string; 

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;


}
