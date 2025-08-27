import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Borrow } from './entities/borrow.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Borrow, User]),
    CommonModule,
  ],
  providers: [BooksService],
  controllers: [BooksController],
  exports: [BooksService],
})
export class BooksModule {}
