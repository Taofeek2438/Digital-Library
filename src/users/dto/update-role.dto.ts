import { IsIn, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/decorators/roles-list';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsIn([Role.USER, Role.ADMIN], { message: 'Role must be either user or admin' })
  role: string;
}
