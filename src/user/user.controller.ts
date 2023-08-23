import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/infra/modules/auth/guard';
import { UserService } from './user.service';
import { EditUserDto, UserFiltered } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  get(@GetUser() user: UserFiltered): UserFiltered {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
