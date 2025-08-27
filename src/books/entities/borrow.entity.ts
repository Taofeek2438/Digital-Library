import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from './book.entity';

@Entity('borrows')
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.borrowedBooks)
  user: User;

  @ManyToOne(() => Book, (book) => book.borrows)
  book: Book;

  @CreateDateColumn()
  borrowedAt: Date;
}
