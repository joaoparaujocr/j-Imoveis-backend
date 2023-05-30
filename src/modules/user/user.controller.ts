import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from './../../decorators/publicRoutes.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import {
  RequestUser,
  RequestUserType,
} from './../../decorators/requestUser.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userCreated = await this.userService.create(createUserDto);
    return userCreated;
  }

  @Get()
  findAll(
    @Paginate() query: PaginateQuery,
    @RequestUser() req: RequestUserType,
  ) {
    return this.userService.findAll(query, req.user.isAdmin);
  }

  @Get(':id')
  findOne(@RequestUser() req: RequestUserType, @Param('id') id: string) {
    const userLogger = req.user;

    return this.userService.findOne(+id, userLogger);
  }

  @Patch(':id')
  update(
    @RequestUser() req: RequestUserType,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userLogger = req.user;

    return this.userService.update(+id, updateUserDto, userLogger);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
