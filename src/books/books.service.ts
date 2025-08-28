import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Borrow } from './entities/borrow.entity';
import { Book } from './entities/book.entity';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/DTOs/pagination.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { StandardResponse } from 'src/common/response/standard-response';
import { instanceToPlain } from 'class-transformer';
import { PaginationRequest } from 'src/common/request/pagination-request';

@Injectable()
export class BooksService {
    constructor(
    @InjectRepository(Book)
    private booksRepo: Repository<Book>,
    @InjectRepository(Borrow)
    private borrowRepo: Repository<Borrow>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private readonly commonService: CommonService,
  ) {}
    private readonly OPEN_LIBRARY_API = 'https://openlibrary.org/search.json';

    async findAll(paginationRequest: PaginationRequest) {
        const page = paginationRequest?.page && paginationRequest.page > 0 ? paginationRequest.page : 1;
        const size = paginationRequest?.size && paginationRequest.size > 0 ? paginationRequest.size : 10;

        const [items, total] = await this.booksRepo.findAndCount({
            skip: (page - 1) * size,
            take: size,
        });

        return StandardResponse.withPagination(
            "Books fetched successfully",
            items,
            { page, size },
            total,
            "/api/v1/books"
        ).toJSON();
    }

    async create(dto: CreateBookDto) {
        const book = this.booksRepo.create(dto);
        return this.booksRepo.save(book);
    }

    async borrowBook(bookId: number) {
        const authenticatedUser = await this.commonService.getLoggedInUser();

        const book = await this.booksRepo.findOne({ where: { id: bookId } });
        if (!book) {
            throw new NotFoundException(
                new StandardResponse(
                    true,
                    'Book not found',
                    null,
                    404
                ).toJSON(),
            );
        }

        if (book.copiesAvailable < 1) {
            throw new BadRequestException(
                new StandardResponse(
                    true,
                    'No copies available',
                    null,
                    400
                ).toJSON(),
            );
        }

        const user = await this.usersRepo.findOne({ where: { id: authenticatedUser.id } });
        if (!user) {
            throw new NotFoundException(
                new StandardResponse(
                    true,
                    'User not found',
                    null,
                    404
                ).toJSON(),
            );
        }

        const borrow = this.borrowRepo.create({
            user,
            book,
            borrowedAt: new Date(),
        });

        book.copiesAvailable -= 1;
        await this.booksRepo.save(book);
        const savedBorrow = await this.borrowRepo.save(borrow);

        return new StandardResponse(
            true,
            'Book borrowed successfully',
            instanceToPlain(savedBorrow),
            200
        ).toJSON();
    }

    async findBorrowedBooks(paginationRequest: PaginationRequest) {
        const authenticatedUser = await this.commonService.getLoggedInUser();
        const userId = authenticatedUser.id;

        const page = paginationRequest.page && paginationRequest.page > 0 ? paginationRequest.page : 1;
        const size = paginationRequest.size && paginationRequest.size > 0 ? paginationRequest.size : 10;

        const [borrowedBooks, total] = await this.borrowRepo.findAndCount({
            where: { user: { id: userId } },
            relations: ['book'],
            skip: (page - 1) * size,
            take: size,
        });

        return StandardResponse.withPagination(
            "Borrowed books fetched successfully",
            borrowedBooks,
            { page, size },
            total,
            "/api/v1/users/borrowed-books"
        ).toJSON();
    }

    async searchBooks(query: string, paginationRequest: PaginationRequest) {
        if (!query) {
            throw new HttpException(
                new StandardResponse(true, 'Query parameter "q" is required').toJSON(),
                HttpStatus.BAD_REQUEST,
            );
        }

        const page = paginationRequest?.page && paginationRequest.page > 0 ? paginationRequest.page : 1;
        const size = paginationRequest?.size && paginationRequest.size > 0 ? paginationRequest.size : 10;

        try {
            const response = await axios.get(this.OPEN_LIBRARY_API, {
                params: { q: query, page, limit: size },
            });

            const formattedBooks = response.data.docs.map((book: any) => ({
                title: book.title,
                author: book.author_name?.[0] || 'Unknown',
                first_publish_year: book.first_publish_year,
                cover_id: book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : null,
            }));

            const totalItems = response.data.numFound || 0;
            const totalPages = Math.ceil(totalItems / size);

            return StandardResponse.withPagination(
                "Searched books fetched successfully",
                formattedBooks,
                { page, size },
                totalItems,
                "/api/v1/books/search"
            ).toJSON();
        } catch (error) {
            throw new HttpException(
                new StandardResponse(true, 'Failed to fetch books').toJSON(),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
