import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { Borrow } from './books/entities/borrow.entity';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    // Database connection setup
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'library.db',
      entities: [User, Book, Borrow],
      synchronize: true, // Auto-create tables (disable in production)
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

    // Application modules
    AuthModule,
    UsersModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
