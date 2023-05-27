import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin-user.dto';
import { Public } from './../../decorators/publicRoutes.decorator';
import {
  RequestUser,
  RequestUserType,
} from './../../decorators/requestUser.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInUser: SignInUserDto) {
    const token = await this.authService.signIn(signInUser);
    return token;
  }

  @Get('profile')
  async getProfile(@RequestUser() req: RequestUserType) {
    const reqId = req.user.id;
    const user = await this.authService.getProfile(reqId);
    return user;
  }
}
