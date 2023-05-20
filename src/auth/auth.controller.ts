import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Res() res: Response, @Body() signInUser: SignInUserDto) {
    const token = await this.authService.signIn(signInUser);
    return res.status(200).json(token);
  }
}
