import { Book } from 'src/books/entities/book.entity';
import { DataSource } from 'typeorm';

export async function seedBooks(dataSource: DataSource) {
  const bookRepo = dataSource.getRepository(Book);

  const existingBooks = await bookRepo.count();
  if (existingBooks > 0) {
    console.log('📚 Books already seeded');
    return;
  }

  const books = [
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', copiesAvailable: 5 },
    { title: 'Clean Code', author: 'Robert C. Martin', copiesAvailable: 3 },
    { title: 'Design Patterns', author: 'Erich Gamma', copiesAvailable: 2 },
    { title: 'Refactoring', author: 'Martin Fowler', copiesAvailable: 4 },
    { title: 'Domain-Driven Design', author: 'Eric Evans', copiesAvailable: 2 },
    { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', copiesAvailable: 6 },
    { title: 'You Don’t Know JS', author: 'Kyle Simpson', copiesAvailable: 5 },
    { title: 'Effective Java', author: 'Joshua Bloch', copiesAvailable: 2 },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', copiesAvailable: 3 },
    { title: 'Head First Design Patterns', author: 'Eric Freeman', copiesAvailable: 4 },
  ];

  await bookRepo.save(books);
  console.log('✅ Books seeded successfully');
}
