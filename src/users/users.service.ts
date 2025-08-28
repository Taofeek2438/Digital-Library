import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateRoleDto } from './dto/update-role.dto';
import { StandardResponse } from 'src/common/response/standard-response';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) {}

    async changeUserRole(userId: number, updateRoleDto: UpdateRoleDto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(
            new StandardResponse(true, 'User not found').toJSON(),
            );
        }

        if (user.role === updateRoleDto.role) {
            return new StandardResponse(
            false,
            `User is already assigned the role '${user.role}'`,
            instanceToPlain(user),
            400,
            ).toJSON();
        }

        user.role = updateRoleDto.role;
        const savedUser = await this.userRepo.save(user);

        return new StandardResponse(
            true,
            'User role updated successfully',
            instanceToPlain(savedUser),
        ).toJSON();
    }

}
