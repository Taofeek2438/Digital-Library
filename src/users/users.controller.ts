import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import { Role } from 'src/common/decorators/roles-list';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/DTOs/pagination.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PaginationRequest } from 'src/common/request/pagination-request';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly booksService: BooksService
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    @Get('borrowed-books')
    async getMyBorrowed(@Query() paginationRequest: PaginationRequest) {
        return this.booksService.findBorrowedBooks(paginationRequest);
    }

    @Patch(':id/role')
    async updateUserRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return this.usersService.changeUserRole(id, updateRoleDto);
    }
}
