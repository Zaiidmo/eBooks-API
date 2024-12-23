import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: String;

    @IsNotEmpty()
    @IsString()
    author: String;

    @IsNotEmpty()
    @IsString()
    category: String;

    @IsNotEmpty()
    @IsString()
    cover: String;

    @IsNotEmpty()
    @IsString()
    description: String;

    @IsNotEmpty()
    @IsString()
    price: String;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;
}
