import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class RoleCheckedDto {
  roleId: number;
  roleName: string;
  checked: boolean;
}

export class ActionWithRolesDto {
  actionId: number;
  actionName: string;
  description: string;
  roles: RoleCheckedDto[];
}
// export class UpdateActionRoleDto {
//   @ApiProperty({ example: 2, description: 'ID của vai trò (role)' })
//   @IsInt()
//   roleId: number;
// }
export class UpdateActionRoleDto {
  @ApiProperty({ example: 1, description: 'Role ID (1 hoặc 2)' })
  @IsInt()
  roleId: number;

  @ApiProperty({
    example: true,
    description: 'Cấp quyền (true) hoặc thu hồi (false)',
  })
  @IsBoolean()
  checked: boolean;
}

export class ToggleRole2Dto {
  @ApiProperty({ example: 5 })
  @IsInt()
  actionId: number;
}
