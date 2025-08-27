import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BooksModule,
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
