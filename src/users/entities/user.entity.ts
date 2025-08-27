import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Borrow } from '../../books/entities/borrow.entity';
import { Exclude } from 'class-transformer';
import { Role } from 'src/common/decorators/roles-list';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: Role.USER })
  role: string;

  @OneToMany(() => Borrow, (borrow) => borrow.user)
  borrowedBooks: Borrow[];

  @Exclude()
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
