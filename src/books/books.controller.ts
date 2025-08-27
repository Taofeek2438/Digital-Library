import { Controller, Get, Post, Body, UseGuards, Query, Param } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Role } from 'src/common/decorators/roles-list';
import { BooksService } from './books.service';
import { PaginationDto } from 'src/common/DTOs/pagination.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { PaginationRequest } from 'src/common/request/pagination-request';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll(@Query() paginationRequest: PaginationRequest) {
    return this.booksService.findAll(paginationRequest);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Post(':id/borrow')
  async borrow(@Param('id') id: string) {
    return this.booksService.borrowBook(+id);
  }
  
  @Get('search')
  async searchBooks(@Query('q') query: string, @Query() paginationRequest: PaginationRequest) {
    return this.booksService.searchBooks(query, paginationRequest);
  }
}
