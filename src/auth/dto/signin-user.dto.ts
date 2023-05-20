import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class SignInUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
