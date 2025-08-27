import { IsNotEmpty, IsNumber } from 'class-validator';

export class BorrowBookDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;
}
