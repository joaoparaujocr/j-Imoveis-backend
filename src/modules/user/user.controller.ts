import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from './../../decorators/publicRoutes.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { IsAdminInterceptor } from 'src/interceptors/isAdmin.interceptor';
import {
  RequestUser,
  RequestUserType,
} from 'src/decorators/requestUser.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userCreated = await this.userService.create(createUserDto);
    return userCreated;
  }

  @UseInterceptors(IsAdminInterceptor)
  @Get()
  findAll(
    @Paginate() query: PaginateQuery,
    @RequestUser() req: RequestUserType,
  ) {
    return this.userService.findAll(query, req.user.isAdmin);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
