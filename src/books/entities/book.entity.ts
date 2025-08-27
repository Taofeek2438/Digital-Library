import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Borrow } from './borrow.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ default: true })
  available: boolean;

  @Column({ default: 1 })
  copiesAvailable: number;

  @OneToMany(() => Borrow, (borrow) => borrow.book)
  borrows: Borrow[];
}
